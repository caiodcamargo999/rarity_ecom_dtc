import { NextResponse } from "next/server";

export async function GET() {
  const schema = {
    openapi: "3.1.0",
    info: {
      title: "Rarity USA Analytics & Telemetry API",
      description:
        "Real-time landing page telemetry, UTM channel attribution, US states geo-tracking, live leads radar, VTurb video retention, and lead journeys for Rarity USA (ecom.rarityagency.io).",
      version: "1.0.0",
    },
    servers: [
      {
        url: "https://ecom.rarityagency.io",
        description: "Production API Server",
      },
    ],
    paths: {
      "/api/v1/analytics": {
        get: {
          summary: "Get Realtime Landing Page Analytics & Attribution",
          description:
            "Retrieve executive KPIs, per-landing-page metrics, traffic channel attribution (ChatGPT, Meta Ads, Google Ads, Organic), US state distribution, live active visitors, lead journeys, and VTurb video retention stats.",
          operationId: "getAnalyticsData",
          parameters: [
            {
              name: "range",
              in: "query",
              required: false,
              description: "Time range filter for analytics data.",
              schema: {
                type: "string",
                enum: ["today", "7d", "30d", "all"],
                default: "7d",
              },
            },
            {
              name: "visitorId",
              in: "query",
              required: false,
              description: "Specific visitor UUID for full chronological journey drilldown and event logs.",
              schema: {
                type: "string",
              },
            },
          ],
          responses: {
            "200": {
              description: "Successful response containing full analytics dataset",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      timeframe: { type: "string" },
                      overview: {
                        type: "object",
                        properties: {
                          totalVisitors: { type: "integer", description: "Total unique visitor sessions" },
                          uniqueVisitors: { type: "integer" },
                          totalPageviews: { type: "integer", description: "Total page impressions" },
                          avgDurationSeconds: { type: "integer", description: "Average dwell time on pages in seconds" },
                          avgScrollDepth: { type: "integer", description: "Average max vertical scroll percentage" },
                          activeLiveVisitors: { type: "integer", description: "Visitors currently active within last 5 minutes" },
                          totalLeads: { type: "integer", description: "Total form and audit submissions" },
                          totalBookings: { type: "integer", description: "Total strategy calls booked via Cal.com" },
                          conversionRate: { type: "number", description: "Overall visitor-to-lead conversion percentage" },
                          vturbPlays: { type: "integer", description: "Total VTurb VSL video plays" },
                        },
                      },
                      pagesPerformance: {
                        type: "array",
                        description: "Breakdown of metrics per landing page path (/growth-team, /lp2, etc.)",
                        items: {
                          type: "object",
                          properties: {
                            pathname: { type: "string" },
                            title: { type: "string" },
                            pageviews: { type: "integer" },
                            uniqueVisitors: { type: "integer" },
                            avgDuration: { type: "integer" },
                            avgScrollDepth: { type: "integer" },
                            ctaClicks: { type: "integer" },
                            videoPlays: { type: "integer" },
                            leadsCount: { type: "integer" },
                            bookingsCount: { type: "integer" },
                            conversionRate: { type: "number" },
                            bounceRate: { type: "number" },
                          },
                        },
                      },
                      channelStats: {
                        type: "array",
                        description: "Attribution by channel (ChatGPT / AI Search, Meta Ads, Google Ads, Instagram Organic, etc.)",
                        items: {
                          type: "object",
                          properties: {
                            channel: { type: "string" },
                            category: { type: "string" },
                            sessions: { type: "integer" },
                            leads: { type: "integer" },
                            bookings: { type: "integer" },
                            conversionRate: { type: "number" },
                            pct: { type: "number" },
                          },
                        },
                      },
                      geoStats: {
                        type: "object",
                        properties: {
                          states: {
                            type: "array",
                            description: "US states distribution and conversion metrics (California, Florida, Texas, New York, etc.)",
                            items: {
                              type: "object",
                              properties: {
                                state: { type: "string" },
                                stateCode: { type: "string" },
                                country: { type: "string" },
                                visitors: { type: "integer" },
                                leads: { type: "integer" },
                                bookings: { type: "integer" },
                                conversionRate: { type: "number" },
                                pct: { type: "number" },
                              },
                            },
                          },
                          countries: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                country: { type: "string" },
                                countryCode: { type: "string" },
                                visitors: { type: "integer" },
                                leads: { type: "integer" },
                                conversionRate: { type: "number" },
                                pct: { type: "number" },
                              },
                            },
                          },
                        },
                      },
                      liveVisitors: {
                        type: "array",
                        description: "List of users active on the site in real time",
                        items: {
                          type: "object",
                          properties: {
                            visitor_id: { type: "string" },
                            current_page: { type: "string" },
                            channel: { type: "string" },
                            city: { type: "string" },
                            country: { type: "string" },
                            device_type: { type: "string" },
                            full_name: { type: "string" },
                            email: { type: "string" },
                          },
                        },
                      },
                      vturbStats: {
                        type: "object",
                        properties: {
                          totalPlays: { type: "integer" },
                          totalUnlocks: { type: "integer" },
                          playRate: { type: "number" },
                          pitchUnlockRate: { type: "number" },
                          milestones: {
                            type: "object",
                            properties: {
                              m10s: { type: "integer" },
                              m30s: { type: "integer" },
                              m60s: { type: "integer" },
                              m120s: { type: "integer" },
                              m300s: { type: "integer" },
                              m600s: { type: "integer" },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            "401": {
              description: "Unauthorized - missing or invalid x-api-key header",
            },
          },
          security: [
            {
              ApiKeyAuth: [],
            },
          ],
        },
      },
    },
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: "apiKey",
          in: "header",
          name: "x-api-key",
          description: "API Key for authenticating MCP and Custom GPT queries. Default: rarity2025",
        },
      },
    },
  };

  return NextResponse.json(schema, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
