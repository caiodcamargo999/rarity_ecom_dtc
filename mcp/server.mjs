#!/usr/bin/env node

/**
 * Rarity Analytics - Model Context Protocol (MCP) Server
 * Connects Claude Desktop, Cursor, and ChatGPT directly to real-time landing page telemetry.
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const API_BASE_URL = process.env.RARITY_API_URL || "https://ecom.rarityagency.io";
const API_KEY = process.env.RARITY_API_KEY || "rarity2025";

const server = new Server(
  {
    name: "rarity-analytics-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Helper function to query the Rarity Analytics API
async function fetchAnalytics(range = "7d", visitorId = "") {
  const url = `${API_BASE_URL}/api/v1/analytics?range=${encodeURIComponent(range)}&visitorId=${encodeURIComponent(visitorId)}`;
  const res = await fetch(url, {
    headers: {
      "x-api-key": API_KEY,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Analytics API error (${res.status}): ${text}`);
  }

  return await res.json();
}

// List all MCP Tools exposed to Claude / ChatGPT
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "get_analytics_overview",
        description:
          "Retrieve top-level executive KPIs (total visitors, pageviews, average dwell time, scroll depth %, VTurb video plays, leads captured, Cal.com bookings, conversion rate, and active live visitors).",
        inputSchema: {
          type: "object",
          properties: {
            range: {
              type: "string",
              enum: ["today", "7d", "30d", "all"],
              description: "Time range for analytics metrics (default: '7d')",
            },
          },
        },
      },
      {
        name: "get_landing_pages_performance",
        description:
          "Retrieve granular page-by-page performance across all landing pages (/growth-team, /lp2, /free-audit, etc.) including views, unique visitors, dwell duration, average scroll depth, CTA clicks, video plays, leads, and conversion rates.",
        inputSchema: {
          type: "object",
          properties: {
            range: {
              type: "string",
              enum: ["today", "7d", "30d", "all"],
              description: "Time range (default: '7d')",
            },
          },
        },
      },
      {
        name: "get_channels_attribution",
        description:
          "Retrieve traffic channel attribution (ChatGPT / AI Search, Meta Ads, Google Ads, Instagram Organic, TikTok, SEO, Direct) with session volumes, lead generation, and conversion rates per channel.",
        inputSchema: {
          type: "object",
          properties: {
            range: {
              type: "string",
              enum: ["today", "7d", "30d", "all"],
              description: "Time range (default: '7d')",
            },
          },
        },
      },
      {
        name: "get_us_states_and_geo",
        description:
          "Retrieve geographic traffic distribution across US states (California, Texas, Florida, New York, etc.) and global countries with traffic share % and conversion metrics.",
        inputSchema: {
          type: "object",
          properties: {
            range: {
              type: "string",
              enum: ["today", "7d", "30d", "all"],
              description: "Time range (default: '7d')",
            },
          },
        },
      },
      {
        name: "get_live_visitors",
        description:
          "Inspect visitors currently active on the landing pages right now in real time (routes being viewed, location, device, and identified lead info).",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "get_lead_journeys",
        description:
          "Inspect chronological navigation trails of leads and visitors, including first touch channel, landing page entry, form submissions, and Cal.com call bookings.",
        inputSchema: {
          type: "object",
          properties: {
            range: {
              type: "string",
              enum: ["today", "7d", "30d", "all"],
              description: "Time range (default: '7d')",
            },
          },
        },
      },
      {
        name: "get_vturb_video_stats",
        description:
          "Retrieve VTurb video player retention milestones (10s hook, 30s, 60s, 120s, 300s, 600s), video start rates, and pitch CTA unlock rates.",
        inputSchema: {
          type: "object",
          properties: {
            range: {
              type: "string",
              enum: ["today", "7d", "30d", "all"],
              description: "Time range (default: '7d')",
            },
          },
        },
      },
    ],
  };
});

// Handle Tool Calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  const range = args?.range || "7d";

  try {
    const data = await fetchAnalytics(range);

    switch (name) {
      case "get_analytics_overview":
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  timeframe: range,
                  overview: data.overview,
                  activeLiveVisitors: data.liveVisitors?.length || 0,
                },
                null,
                2
              ),
            },
          ],
        };

      case "get_landing_pages_performance":
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  timeframe: range,
                  pages: data.pagesPerformance || [],
                },
                null,
                2
              ),
            },
          ],
        };

      case "get_channels_attribution":
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  timeframe: range,
                  channels: data.channelStats || [],
                  campaigns: data.utmPerformance || [],
                },
                null,
                2
              ),
            },
          ],
        };

      case "get_us_states_and_geo":
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  timeframe: range,
                  usStates: data.geoStats?.states || [],
                  countries: data.geoStats?.countries || [],
                  cities: data.geoStats?.cities || [],
                },
                null,
                2
              ),
            },
          ],
        };

      case "get_live_visitors":
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  activeLiveLeads: data.liveVisitors || [],
                  count: data.liveVisitors?.length || 0,
                },
                null,
                2
              ),
            },
          ],
        };

      case "get_lead_journeys":
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  timeframe: range,
                  journeys: (data.recentJourneys || []).slice(0, 50),
                },
                null,
                2
              ),
            },
          ],
        };

      case "get_vturb_video_stats":
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  timeframe: range,
                  vturb: data.vturbStats,
                },
                null,
                2
              ),
            },
          ],
        };

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error executing tool ${name}: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
});

// Run server using standard stdio
async function run() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Rarity Analytics MCP Server running on stdio");
}

run().catch((err) => {
  console.error("Fatal error in MCP Server:", err);
  process.exit(1);
});
