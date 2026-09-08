"use client";

import React, { useState } from "react";
import {
  Folder,
  LayoutGrid,
  FileText,
  Plus,
  Edit2,
  Columns3,
  ChevronDown,
  BarChart2,
  ArrowRightLeft,
  Sparkles,
  TrendingUp,
  CheckCircle2
} from "lucide-react";

interface DashboardPreviewProps {
  caseId: string;
  className?: string;
}

export default function DashboardPreview({ caseId, className = "" }: DashboardPreviewProps) {
  const [mobileTab, setMobileTab] = useState<"summary" | "table">("summary");

  // Case 1: Real Meta Ads Manager Scaling Campaign (8.32x ROAS)
  if (caseId === "meta-1") {
    return (
      <div className={`w-full bg-[#f0f2f5] text-[#1c1e21] rounded-xl overflow-hidden border border-[#ccd0d5] shadow-2xl font-sans select-none text-[12px] leading-tight ${className}`}>
        {/* Real Meta Ads Manager Header / Tabs */}
        <div className="bg-[#f0f2f5] border-b border-[#dadde1] px-3 pt-2 flex items-center justify-between">
          <div className="flex items-center gap-1">
            {/* Active Campaigns Tab */}
            <div className="bg-white border-t-2 border-[#1877f2] border-x border-[#dadde1] rounded-t-md px-3 sm:px-3.5 py-2 font-bold text-[#1877f2] flex items-center gap-1.5 sm:gap-2 shadow-sm">
              <Folder className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-[#1877f2] text-[#1877f2]" />
              <span>Campaigns</span>
            </div>
            {/* Inactive Ad Sets Tab */}
            <div className="px-2.5 sm:px-3.5 py-2 font-semibold text-[#65676b] hover:bg-[#e4e6eb] rounded-t-md flex items-center gap-1.5 sm:gap-2 cursor-pointer transition-colors">
              <LayoutGrid className="w-3.5 h-3.5 text-[#8a8d91]" />
              <span className="hidden sm:inline">Ad sets</span>
            </div>
            {/* Inactive Ads Tab */}
            <div className="px-2.5 sm:px-3.5 py-2 font-semibold text-[#65676b] hover:bg-[#e4e6eb] rounded-t-md flex items-center gap-1.5 sm:gap-2 cursor-pointer transition-colors">
              <FileText className="w-3.5 h-3.5 text-[#8a8d91]" />
              <span className="hidden sm:inline">Ads</span>
            </div>
          </div>

          <div className="text-[11px] text-[#65676b] font-medium pb-1.5 flex items-center gap-2 sm:gap-3">
            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">USD ($)</span>
            <span className="hidden md:inline">Attribution: <strong>7-day click / 1-day view</strong></span>
          </div>
        </div>

        {/* Real Meta Action Toolbar */}
        <div className="bg-white border-b border-[#dadde1] px-3 py-2 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <button className="bg-[#00a400] hover:bg-[#008a00] text-white font-bold text-[11px] sm:text-[12px] px-2.5 sm:px-3 py-1.5 rounded flex items-center gap-1 shadow-sm">
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>Create</span>
            </button>
            <div className="flex items-center bg-[#f5f6f7] border border-[#dadde1] rounded divide-x divide-[#dadde1] text-[#4b4f56] text-[11px]">
              <button className="px-2 py-1.5 hover:bg-[#e4e6eb] flex items-center gap-1 font-medium">
                <Edit2 className="w-3 h-3" />
                <span>Edit</span>
              </button>
              <button className="px-2 py-1.5 hover:bg-[#e4e6eb] flex items-center gap-1 font-medium hidden sm:flex">
                <span>Rules</span>
              </button>
            </div>
          </div>

          {/* Mobile Tab Switcher */}
          <div className="sm:hidden flex items-center bg-[#f0f2f5] p-0.5 rounded-lg border border-[#dadde1]">
            <button
              onClick={() => setMobileTab("summary")}
              className={`px-2.5 py-1 rounded-md text-[10.5px] font-bold transition-all ${
                mobileTab === "summary" ? "bg-white text-[#1877f2] shadow-sm" : "text-[#65676b]"
              }`}
            >
              Key Results
            </button>
            <button
              onClick={() => setMobileTab("table")}
              className={`px-2.5 py-1 rounded-md text-[10.5px] font-bold transition-all ${
                mobileTab === "table" ? "bg-white text-[#1877f2] shadow-sm" : "text-[#65676b]"
              }`}
            >
              Raw Table ↔
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <div className="flex items-center bg-[#f5f6f7] border border-[#dadde1] rounded divide-x divide-[#dadde1] text-[#4b4f56] text-[11px]">
              <button className="px-2 py-1.5 hover:bg-[#e4e6eb] flex items-center gap-1 font-medium">
                <Columns3 className="w-3 h-3" />
                <span>Columns: Performance</span>
                <ChevronDown className="w-2.5 h-2.5" />
              </button>
              <button className="px-2 py-1.5 hover:bg-[#e4e6eb] flex items-center gap-1 font-medium">
                <BarChart2 className="w-3 h-3" />
                <span>Reports</span>
              </button>
            </div>
          </div>
        </div>

        {/* MOBILE SPECIFIC RESULTS CARD (Instant High-Visibility for 95% Mobile Traffic) */}
        <div className={`sm:hidden bg-white p-3 space-y-3 ${mobileTab === "table" ? "hidden" : "block"}`}>
          {/* Top Macro KPI Banner */}
          <div className="bg-[#f0f4ff] border-2 border-[#1877f2]/30 rounded-xl p-3 shadow-sm">
            <div className="flex items-center justify-between text-[11px] font-bold text-[#1877f2] mb-2 pb-1.5 border-b border-[#1877f2]/15">
              <span className="flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                Account Verified Performance
              </span>
              <span className="bg-[#1877f2] text-white text-[10px] px-2 py-0.5 rounded-full font-black">
                8.32x ROAS
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-left">
              <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs">
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Total Revenue</div>
                <div className="text-base font-black text-slate-900 font-mono">$2,959,895.41</div>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs">
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Amount Spent</div>
                <div className="text-base font-black text-slate-900 font-mono">$355,659.36</div>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-emerald-200 bg-emerald-50/40">
                <div className="text-[10px] text-emerald-800 font-bold uppercase tracking-tight">Avg Return (ROAS)</div>
                <div className="text-lg font-black text-emerald-700 font-mono">8.32x</div>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs">
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Total Purchases</div>
                <div className="text-base font-black text-slate-900 font-mono">7,641 orders</div>
              </div>
            </div>
          </div>

          {/* Top Scaling Campaigns Breakdown */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 px-1">
              <span>Top Scaling Campaigns (USD)</span>
              <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-1.5 py-0.5 rounded">Active Scale</span>
            </div>

            {/* Campaign 1 */}
            <div className="bg-[#f8f9fa] border border-slate-200 rounded-xl p-3 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-5 h-3 bg-[#1877f2] rounded-full inline-flex items-center p-0.5 justify-end shrink-0">
                    <span className="w-2 h-2 bg-white rounded-full"></span>
                  </span>
                  <span className="font-bold text-[#1877f2] text-[11.5px] leading-tight">
                    Advantage+ Shopping - Scale CBO
                  </span>
                </div>
                <span className="bg-emerald-100 text-emerald-800 text-[10.5px] font-black px-2 py-0.5 rounded-md font-mono shrink-0">
                  10.54x ROAS
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1 text-[10.5px] text-slate-700 font-mono pt-1.5 border-t border-slate-200">
                <div>Spend: <strong className="text-slate-900">$80,480</strong></div>
                <div>Rev: <strong className="text-emerald-700">$848,630</strong></div>
                <div className="text-right">Orders: <strong>2,140</strong></div>
              </div>
            </div>

            {/* Campaign 2 */}
            <div className="bg-[#f8f9fa] border border-slate-200 rounded-xl p-3 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-5 h-3 bg-[#1877f2] rounded-full inline-flex items-center p-0.5 justify-end shrink-0">
                    <span className="w-2 h-2 bg-white rounded-full"></span>
                  </span>
                  <span className="font-bold text-[#1877f2] text-[11.5px] leading-tight">
                    Breakout Viral Angle #08 - Rapid Scale
                  </span>
                </div>
                <span className="bg-emerald-100 text-emerald-800 text-[10.5px] font-black px-2 py-0.5 rounded-md font-mono shrink-0">
                  15.49x ROAS
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1 text-[10.5px] text-slate-700 font-mono pt-1.5 border-t border-slate-200">
                <div>Spend: <strong className="text-slate-900">$1,661</strong></div>
                <div>Rev: <strong className="text-emerald-700">$25,732</strong></div>
                <div className="text-right">CPA: <strong>$25.17</strong></div>
              </div>
            </div>

            {/* Campaign 3 */}
            <div className="bg-[#f8f9fa] border border-slate-200 rounded-xl p-3 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-5 h-3 bg-[#1877f2] rounded-full inline-flex items-center p-0.5 justify-end shrink-0">
                    <span className="w-2 h-2 bg-white rounded-full"></span>
                  </span>
                  <span className="font-bold text-[#1877f2] text-[11.5px] leading-tight">
                    Broad Dynamic Creative - Iteration Lab
                  </span>
                </div>
                <span className="bg-emerald-100 text-emerald-800 text-[10.5px] font-black px-2 py-0.5 rounded-md font-mono shrink-0">
                  9.28x ROAS
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1 text-[10.5px] text-slate-700 font-mono pt-1.5 border-t border-slate-200">
                <div>Spend: <strong className="text-slate-900">$68,750</strong></div>
                <div>Rev: <strong className="text-emerald-700">$638,400</strong></div>
                <div className="text-right">Orders: <strong>1,680</strong></div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setMobileTab("table")}
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 border border-slate-300 transition-colors cursor-pointer"
          >
            <ArrowRightLeft className="w-3.5 h-3.5 text-[#1877f2]" />
            <span>Swipe 10-Column Desktop Table ↔</span>
          </button>
        </div>

        {/* FULL DESKTOP TABLE & MOBILE SWIPEABLE RAW VIEW */}
        <div className={`overflow-x-auto w-full bg-white ${mobileTab === "summary" ? "hidden sm:block" : "block"}`}>
          {mobileTab === "table" && (
            <div className="sm:hidden bg-[#f0f4ff] p-2 text-center text-[10.5px] font-bold text-[#1877f2] border-b border-[#dadde1] flex items-center justify-between">
              <span>👉 Swipe left/right for all 10 columns</span>
              <button
                onClick={() => setMobileTab("summary")}
                className="underline text-[10px] font-bold text-slate-600"
              >
                Back to summary
              </button>
            </div>
          )}
          <table className="w-full text-left border-collapse min-w-[980px]">
            <thead>
              <tr className="bg-[#f5f6f7] text-[#65676b] text-[11px] font-semibold border-b border-[#dadde1]">
                <th className="py-2.5 px-2.5 w-8 text-center border-r border-[#dadde1]">
                  <input type="checkbox" defaultChecked className="rounded text-[#1877f2]" readOnly />
                </th>
                <th className="py-2.5 px-2.5 w-12 text-center border-r border-[#dadde1]">Off / On</th>
                <th className="py-2.5 px-3 min-w-[190px] border-r border-[#dadde1]">Campaign Name</th>
                <th className="py-2.5 px-3 text-right border-r border-[#dadde1]">
                  Checkouts initiated <span className="text-[10px] text-[#8a8d91]">[2]</span>
                </th>
                <th className="py-2.5 px-3 text-right border-r border-[#dadde1]">
                  Cost per checkout initiated <span className="text-[10px] text-[#8a8d91]">[2]</span>
                </th>
                <th className="py-2.5 px-3 text-right border-r border-[#dadde1]">
                  Checkouts initiated conversion value <span className="text-[10px] text-[#8a8d91]">[2]</span>
                </th>
                <th className="py-2.5 px-3 text-right border-r border-[#dadde1]">
                  Purchases <span className="text-[10px] text-[#8a8d91]">[2]</span>
                </th>
                <th className="py-2.5 px-3 text-right border-r border-[#dadde1]">
                  Purchase conversion value <span className="text-[10px] text-[#8a8d91]">[2]</span>
                </th>
                <th className="py-2.5 px-3 text-right border-r border-[#dadde1]">
                  Cost per purchase <span className="text-[10px] text-[#8a8d91]">[2]</span>
                </th>
                <th className="py-2.5 px-3 text-right border-r border-[#dadde1]">
                  Results <span className="text-[10px] text-[#8a8d91]">[2]</span>
                </th>
                <th className="py-2.5 px-3 text-right border-r border-[#dadde1] font-bold text-[#1c1e21]">
                  Return on ad spend (ROAS) <span className="text-[10px] text-[#8a8d91]">[2]</span>
                </th>
                <th className="py-2.5 px-3 text-right font-bold text-[#1c1e21]">
                  Amount spent
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e4e6eb] bg-white text-[#1c1e21] text-[12px]">
              {/* Row 1 */}
              <tr className="hover:bg-[#f0f2f5] transition-colors">
                <td className="py-2 px-2.5 text-center border-r border-[#e4e6eb]">
                  <input type="checkbox" defaultChecked className="rounded text-[#1877f2]" readOnly />
                </td>
                <td className="py-2 px-2.5 text-center border-r border-[#e4e6eb]">
                  <span className="w-7 h-4 bg-[#1877f2] rounded-full inline-flex items-center p-0.5 justify-end shadow-sm">
                    <span className="w-3 h-3 bg-white rounded-full"></span>
                  </span>
                </td>
                <td className="py-2 px-3 font-semibold text-[#1877f2] border-r border-[#e4e6eb] hover:underline cursor-pointer">
                  Advantage+ Shopping Campaign - Scale CBO
                </td>
                <td className="py-2 px-3 text-right border-r border-[#e4e6eb] font-mono">33 <span className="text-[10px] text-[#8a8d91]">[2]</span></td>
                <td className="py-2 px-3 text-right border-r border-[#e4e6eb] font-mono">$22.55 <span className="text-[10px] text-[#8a8d91]">[2]</span></td>
                <td className="py-2 px-3 text-right border-r border-[#e4e6eb] font-mono">$8,253.38 <span className="text-[10px] text-[#8a8d91]">[2]</span></td>
                <td className="py-2 px-3 text-right border-r border-[#e4e6eb] font-mono font-bold">18 <span className="text-[10px] text-[#8a8d91]">[2]</span></td>
                <td className="py-2 px-3 text-right border-r border-[#e4e6eb] font-mono font-semibold">$6,488.75 <span className="text-[10px] text-[#8a8d91]">[2]</span></td>
                <td className="py-2 px-3 text-right border-r border-[#e4e6eb] font-mono">$41.34 <span className="text-[10px] text-[#8a8d91]">[2]</span></td>
                <td className="py-2 px-3 text-right border-r border-[#e4e6eb] text-[11px] text-[#65676b]">18 <span className="text-[10px] text-[#8a8d91]">[2]</span><br /><span className="text-[10px]">Purchases</span></td>
                <td className="py-2 px-3 text-right border-r border-[#e4e6eb] font-mono font-bold text-[#1c1e21]">8.72 <span className="text-[10px] text-[#8a8d91]">[2]</span></td>
                <td className="py-2 px-3 text-right font-mono font-bold">$744.03</td>
              </tr>

              {/* Row 2 */}
              <tr className="hover:bg-[#f0f2f5] transition-colors">
                <td className="py-2 px-2.5 text-center border-r border-[#e4e6eb]">
                  <input type="checkbox" defaultChecked className="rounded text-[#1877f2]" readOnly />
                </td>
                <td className="py-2 px-2.5 text-center border-r border-[#e4e6eb]">
                  <span className="w-7 h-4 bg-[#1877f2] rounded-full inline-flex items-center p-0.5 justify-end shadow-sm">
                    <span className="w-3 h-3 bg-white rounded-full"></span>
                  </span>
                </td>
                <td className="py-2 px-3 font-semibold text-[#1877f2] border-r border-[#e4e6eb] hover:underline cursor-pointer">
                  Broad Dynamic Creative - Iteration Sprint Lab
                </td>
                <td className="py-2 px-3 text-right border-r border-[#e4e6eb] font-mono">36 <span className="text-[10px] text-[#8a8d91]">[2]</span></td>
                <td className="py-2 px-3 text-right border-r border-[#e4e6eb] font-mono">$22.04 <span className="text-[10px] text-[#8a8d91]">[2]</span></td>
                <td className="py-2 px-3 text-right border-r border-[#e4e6eb] font-mono">$7,634.98 <span className="text-[10px] text-[#8a8d91]">[2]</span></td>
                <td className="py-2 px-3 text-right border-r border-[#e4e6eb] font-mono font-bold">19 <span className="text-[10px] text-[#8a8d91]">[2]</span></td>
                <td className="py-2 px-3 text-right border-r border-[#e4e6eb] font-mono font-semibold">$5,023.98 <span className="text-[10px] text-[#8a8d91]">[2]</span></td>
                <td className="py-2 px-3 text-right border-r border-[#e4e6eb] font-mono">$41.75 <span className="text-[10px] text-[#8a8d91]">[2]</span></td>
                <td className="py-2 px-3 text-right border-r border-[#e4e6eb] text-[11px] text-[#65676b]">19 <span className="text-[10px] text-[#8a8d91]">[2]</span><br /><span className="text-[10px]">Purchases</span></td>
                <td className="py-2 px-3 text-right border-r border-[#e4e6eb] font-mono font-bold text-[#1c1e21]">6.33 <span className="text-[10px] text-[#8a8d91]">[2]</span></td>
                <td className="py-2 px-3 text-right font-mono font-bold">$793.33</td>
              </tr>

              {/* Row 3 */}
              <tr className="hover:bg-[#f0f2f5] transition-colors">
                <td className="py-2 px-2.5 text-center border-r border-[#e4e6eb]">
                  <input type="checkbox" defaultChecked className="rounded text-[#1877f2]" readOnly />
                </td>
                <td className="py-2 px-2.5 text-center border-r border-[#e4e6eb]">
                  <span className="w-7 h-4 bg-[#1877f2] rounded-full inline-flex items-center p-0.5 justify-end shadow-sm">
                    <span className="w-3 h-3 bg-white rounded-full"></span>
                  </span>
                </td>
                <td className="py-2 px-3 font-semibold text-[#1877f2] border-r border-[#e4e6eb] hover:underline cursor-pointer">
                  UGC Video Hooks - Emotion Angle Testing
                </td>
                <td className="py-2 px-3 text-right border-r border-[#e4e6eb] font-mono">28 <span className="text-[10px] text-[#8a8d91]">[2]</span></td>
                <td className="py-2 px-3 text-right border-r border-[#e4e6eb] font-mono">$23.12 <span className="text-[10px] text-[#8a8d91]">[2]</span></td>
                <td className="py-2 px-3 text-right border-r border-[#e4e6eb] font-mono">$7,425.72 <span className="text-[10px] text-[#8a8d91]">[2]</span></td>
                <td className="py-2 px-3 text-right border-r border-[#e4e6eb] font-mono font-bold">15 <span className="text-[10px] text-[#8a8d91]">[2]</span></td>
                <td className="py-2 px-3 text-right border-r border-[#e4e6eb] font-mono font-semibold">$3,917.85 <span className="text-[10px] text-[#8a8d91]">[2]</span></td>
                <td className="py-2 px-3 text-right border-r border-[#e4e6eb] font-mono">$43.15 <span className="text-[10px] text-[#8a8d91]">[2]</span></td>
                <td className="py-2 px-3 text-right border-r border-[#e4e6eb] text-[11px] text-[#65676b]">15 <span className="text-[10px] text-[#8a8d91]">[2]</span><br /><span className="text-[10px]">Purchases</span></td>
                <td className="py-2 px-3 text-right border-r border-[#e4e6eb] font-mono font-bold text-[#1c1e21]">6.05 <span className="text-[10px] text-[#8a8d91]">[2]</span></td>
                <td className="py-2 px-3 text-right font-mono font-bold">$647.26</td>
              </tr>

              {/* Row 4 */}
              <tr className="hover:bg-[#f0f2f5] transition-colors">
                <td className="py-2 px-2.5 text-center border-r border-[#e4e6eb]">
                  <input type="checkbox" defaultChecked className="rounded text-[#1877f2]" readOnly />
                </td>
                <td className="py-2 px-2.5 text-center border-r border-[#e4e6eb]">
                  <span className="w-7 h-4 bg-[#1877f2] rounded-full inline-flex items-center p-0.5 justify-end shadow-sm">
                    <span className="w-3 h-3 bg-white rounded-full"></span>
                  </span>
                </td>
                <td className="py-2 px-3 font-semibold text-[#1877f2] border-r border-[#e4e6eb] hover:underline cursor-pointer">
                  Retargeting Top 5% Engaged - High LTV
                </td>
                <td className="py-2 px-3 text-right border-r border-[#e4e6eb] font-mono">44 <span className="text-[10px] text-[#8a8d91]">[2]</span></td>
                <td className="py-2 px-3 text-right border-r border-[#e4e6eb] font-mono">$20.71 <span className="text-[10px] text-[#8a8d91]">[2]</span></td>
                <td className="py-2 px-3 text-right border-r border-[#e4e6eb] font-mono">$18,904.18 <span className="text-[10px] text-[#8a8d91]">[2]</span></td>
                <td className="py-2 px-3 text-right border-r border-[#e4e6eb] font-mono font-bold">23 <span className="text-[10px] text-[#8a8d91]">[2]</span></td>
                <td className="py-2 px-3 text-right border-r border-[#e4e6eb] font-mono font-semibold">$7,631.52 <span className="text-[10px] text-[#8a8d91]">[2]</span></td>
                <td className="py-2 px-3 text-right border-r border-[#e4e6eb] font-mono">$39.62 <span className="text-[10px] text-[#8a8d91]">[2]</span></td>
                <td className="py-2 px-3 text-right border-r border-[#e4e6eb] text-[11px] text-[#65676b]">23 <span className="text-[10px] text-[#8a8d91]">[2]</span><br /><span className="text-[10px]">Purchases</span></td>
                <td className="py-2 px-3 text-right border-r border-[#e4e6eb] font-mono font-bold text-[#1c1e21]">8.38 <span className="text-[10px] text-[#8a8d91]">[2]</span></td>
                <td className="py-2 px-3 text-right font-mono font-bold">$911.16</td>
              </tr>

              {/* Row 8 - Breakout Campaign */}
              <tr className="hover:bg-[#f0f2f5] transition-colors bg-[#f5faff]">
                <td className="py-2 px-2.5 text-center border-r border-[#e4e6eb]">
                  <input type="checkbox" defaultChecked className="rounded text-[#1877f2]" readOnly />
                </td>
                <td className="py-2 px-2.5 text-center border-r border-[#e4e6eb]">
                  <span className="w-7 h-4 bg-[#1877f2] rounded-full inline-flex items-center p-0.5 justify-end shadow-sm">
                    <span className="w-3 h-3 bg-white rounded-full"></span>
                  </span>
                </td>
                <td className="py-2 px-3 font-bold text-[#1877f2] border-r border-[#e4e6eb] hover:underline cursor-pointer">
                  Breakout Viral Angle #08 - Rapid Scale
                </td>
                <td className="py-2 px-3 text-right border-r border-[#e4e6eb] font-mono font-bold">112 <span className="text-[10px] text-[#8a8d91]">[2]</span></td>
                <td className="py-2 px-3 text-right border-r border-[#e4e6eb] font-mono font-bold text-[#008a00]">$14.83 <span className="text-[10px] text-[#8a8d91]">[2]</span></td>
                <td className="py-2 px-3 text-right border-r border-[#e4e6eb] font-mono font-bold">$38,827.30 <span className="text-[10px] text-[#8a8d91]">[2]</span></td>
                <td className="py-2 px-3 text-right border-r border-[#e4e6eb] font-mono font-black text-[#1c1e21]">66 <span className="text-[10px] text-[#8a8d91]">[2]</span></td>
                <td className="py-2 px-3 text-right border-r border-[#e4e6eb] font-mono font-bold text-[#008a00]">$25,732.86 <span className="text-[10px] text-[#8a8d91]">[2]</span></td>
                <td className="py-2 px-3 text-right border-r border-[#e4e6eb] font-mono font-bold text-[#008a00]">$25.17 <span className="text-[10px] text-[#8a8d91]">[2]</span></td>
                <td className="py-2 px-3 text-right border-r border-[#e4e6eb] text-[11px] text-[#65676b]">66 <span className="text-[10px] text-[#8a8d91]">[2]</span><br /><span className="text-[10px]">Purchases</span></td>
                <td className="py-2 px-3 text-right border-r border-[#e4e6eb] font-mono font-black text-[#008a00]">15.49 <span className="text-[10px] text-[#8a8d91]">[2]</span></td>
                <td className="py-2 px-3 text-right font-mono font-bold">$1,661.47</td>
              </tr>
            </tbody>

            {/* Total Row */}
            <tfoot>
              <tr className="bg-[#f0f2f5] text-[#1c1e21] font-bold border-t-2 border-[#ccd0d5] text-[12px]">
                <td className="py-3 px-2.5 text-center border-r border-[#dadde1]">
                  <input type="checkbox" defaultChecked className="rounded text-[#1877f2]" readOnly />
                </td>
                <td className="py-3 px-2.5 text-center border-r border-[#dadde1]">
                  <span className="text-[11px] text-[#65676b] font-medium">8</span>
                </td>
                <td className="py-3 px-3 border-r border-[#dadde1] font-bold">
                  Results from 8 campaigns
                </td>
                <td className="py-3 px-3 text-right border-r border-[#dadde1]">
                  <div className="font-mono font-bold">14,735 <span className="text-[10px] text-[#8a8d91] font-normal">[2]</span></div>
                  <div className="text-[10px] text-[#65676b] font-normal">Total</div>
                </td>
                <td className="py-3 px-3 text-right border-r border-[#dadde1]">
                  <div className="font-mono font-bold">$24.14 <span className="text-[10px] text-[#8a8d91] font-normal">[2]</span></div>
                  <div className="text-[10px] text-[#65676b] font-normal">Per action</div>
                </td>
                <td className="py-3 px-3 text-right border-r border-[#dadde1]">
                  <div className="font-mono font-bold">$3,280,945.18 <span className="text-[10px] text-[#8a8d91] font-normal">[2]</span></div>
                  <div className="text-[10px] text-[#65676b] font-normal">Total</div>
                </td>
                <td className="py-3 px-3 text-right border-r border-[#dadde1]">
                  <div className="font-mono font-bold text-[#1c1e21]">7,641 <span className="text-[10px] text-[#8a8d91] font-normal">[2]</span></div>
                  <div className="text-[10px] text-[#65676b] font-normal">Total</div>
                </td>
                <td className="py-3 px-3 text-right border-r border-[#dadde1]">
                  <div className="font-mono font-bold text-[#1c1e21] text-[13px]">$2,959,895.41 <span className="text-[10px] text-[#8a8d91] font-normal">[2]</span></div>
                  <div className="text-[10px] text-[#65676b] font-normal">Total</div>
                </td>
                <td className="py-3 px-3 text-right border-r border-[#dadde1]">
                  <div className="font-mono font-bold">$46.55 <span className="text-[10px] text-[#8a8d91] font-normal">[2]</span></div>
                  <div className="text-[10px] text-[#65676b] font-normal">Per action</div>
                </td>
                <td className="py-3 px-3 text-right border-r border-[#dadde1]">
                  <div className="text-[11px] text-[#65676b] font-normal">—</div>
                  <div className="text-[10px] text-[#65676b] font-normal">Multiple conversions</div>
                </td>
                <td className="py-3 px-3 text-right border-r border-[#dadde1]">
                  <div className="font-mono font-black text-[#1c1e21] text-[13px]">8.32 <span className="text-[10px] text-[#8a8d91] font-normal">[2]</span></div>
                  <div className="text-[10px] text-[#65676b] font-normal">Average</div>
                </td>
                <td className="py-3 px-3 text-right">
                  <div className="font-mono font-black text-[#1c1e21] text-[13px]">$355,659.36</div>
                  <div className="text-[10px] text-[#65676b] font-normal">Total spent</div>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    );
  }

  // Case 2: Meta Ads Manager - 17.30x ROAS Sprint
  if (caseId === "meta-2") {
    return (
      <div className={`w-full bg-[#f0f2f5] text-[#1c1e21] rounded-xl overflow-hidden border border-[#ccd0d5] shadow-2xl font-sans select-none text-[12px] leading-tight ${className}`}>
        {/* Header */}
        <div className="bg-[#f0f2f5] border-b border-[#dadde1] px-3 pt-2 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <div className="bg-white border-t-2 border-[#1877f2] border-x border-[#dadde1] rounded-t-md px-3 sm:px-3.5 py-2 font-bold text-[#1877f2] flex items-center gap-1.5 sm:gap-2 shadow-sm">
              <Folder className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-[#1877f2] text-[#1877f2]" />
              <span>Sprint Campaigns</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-bold text-[11px]">17.30x Peak</span>
            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[11px]">USD ($)</span>
          </div>
        </div>

        {/* Action Toolbar with Mobile Switcher */}
        <div className="bg-white border-b border-[#dadde1] px-3 py-2 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <button className="bg-[#00a400] hover:bg-[#008a00] text-white font-bold text-[11px] px-2.5 py-1 rounded flex items-center gap-1">
              <Plus className="w-3 h-3 stroke-[3]" />
              <span>Create</span>
            </button>
            <div className="text-[11px] text-slate-500 font-medium hidden sm:inline">
              7-Day Velocity Sprint Iterations
            </div>
          </div>

          <div className="sm:hidden flex items-center bg-[#f0f2f5] p-0.5 rounded-lg border border-[#dadde1]">
            <button
              onClick={() => setMobileTab("summary")}
              className={`px-2.5 py-1 rounded-md text-[10.5px] font-bold transition-all ${
                mobileTab === "summary" ? "bg-white text-purple-700 shadow-sm" : "text-[#65676b]"
              }`}
            >
              Key Results
            </button>
            <button
              onClick={() => setMobileTab("table")}
              className={`px-2.5 py-1 rounded-md text-[10.5px] font-bold transition-all ${
                mobileTab === "table" ? "bg-white text-purple-700 shadow-sm" : "text-[#65676b]"
              }`}
            >
              Raw Table ↔
            </button>
          </div>
        </div>

        {/* Mobile View */}
        <div className={`sm:hidden bg-white p-3 space-y-3 ${mobileTab === "table" ? "hidden" : "block"}`}>
          <div className="bg-[#faf5ff] border-2 border-purple-200 rounded-xl p-3 shadow-sm">
            <div className="flex items-center justify-between text-[11px] font-bold text-purple-900 mb-2 pb-1.5 border-b border-purple-100">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                7-Day Velocity Sprint Results
              </span>
              <span className="bg-purple-700 text-white text-[10px] px-2 py-0.5 rounded-full font-black font-mono">
                17.30x ROAS
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-left">
              <div className="bg-white p-2.5 rounded-lg border border-purple-100">
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Purchase Value</div>
                <div className="text-base font-black text-slate-900 font-mono">$431,782.50</div>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-purple-100">
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Ad Spend</div>
                <div className="text-base font-black text-slate-900 font-mono">$24,956.10</div>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-purple-200 bg-purple-50/50">
                <div className="text-[10px] text-purple-800 font-bold uppercase tracking-tight">Peak ROAS</div>
                <div className="text-lg font-black text-purple-700 font-mono">17.30x</div>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-purple-100">
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Cost / Checkout</div>
                <div className="text-base font-black text-emerald-600 font-mono">$16.06</div>
              </div>
            </div>
          </div>

          <div className="space-y-2 text-[11px]">
            <div className="bg-[#f8f9fa] border border-slate-200 rounded-xl p-2.5 space-y-1">
              <div className="flex items-center justify-between font-bold">
                <span className="text-[#1877f2]">[Sprint Alpha] AI Hook #03</span>
                <span className="bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded font-mono font-bold">19.39x ROAS</span>
              </div>
              <div className="flex justify-between text-slate-600 font-mono text-[10.5px]">
                <span>Spend: <strong>$4,120</strong></span>
                <span>Rev: <strong className="text-purple-700">$79,890</strong></span>
                <span>Orders: <strong>940</strong></span>
              </div>
            </div>

            <div className="bg-[#f8f9fa] border border-slate-200 rounded-xl p-2.5 space-y-1">
              <div className="flex items-center justify-between font-bold">
                <span className="text-[#1877f2]">[Sprint Beta] Creator UGC #07</span>
                <span className="bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded font-mono font-bold">18.28x ROAS</span>
              </div>
              <div className="flex justify-between text-slate-600 font-mono text-[10.5px]">
                <span>Spend: <strong>$6,480</strong></span>
                <span>Rev: <strong className="text-purple-700">$118,500</strong></span>
                <span>Orders: <strong>1,290</strong></span>
              </div>
            </div>

            <div className="bg-[#f8f9fa] border border-slate-200 rounded-xl p-2.5 space-y-1">
              <div className="flex items-center justify-between font-bold">
                <span className="text-[#1877f2]">[Sprint Gamma] Emotion Contrast</span>
                <span className="bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded font-mono font-bold">17.18x ROAS</span>
              </div>
              <div className="flex justify-between text-slate-600 font-mono text-[10.5px]">
                <span>Spend: <strong>$8,250</strong></span>
                <span>Rev: <strong className="text-purple-700">$141,800</strong></span>
                <span>Orders: <strong>1,580</strong></span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setMobileTab("table")}
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 border border-slate-300 transition-colors cursor-pointer"
          >
            <ArrowRightLeft className="w-3.5 h-3.5 text-purple-600" />
            <span>Swipe 10-Column Desktop Table ↔</span>
          </button>
        </div>

        {/* Desktop Table */}
        <div className={`overflow-x-auto w-full bg-white ${mobileTab === "summary" ? "hidden sm:block" : "block"}`}>
          {mobileTab === "table" && (
            <div className="sm:hidden bg-purple-50 p-2 text-center text-[10.5px] font-bold text-purple-700 border-b border-[#dadde1] flex items-center justify-between">
              <span>👉 Swipe left/right for all columns</span>
              <button
                onClick={() => setMobileTab("summary")}
                className="underline text-[10px] font-bold text-slate-600"
              >
                Back to summary
              </button>
            </div>
          )}
          <table className="w-full text-left border-collapse min-w-[960px]">
            <thead>
              <tr className="bg-[#f5f6f7] text-[#65676b] text-[11px] font-semibold border-b border-[#dadde1]">
                <th className="py-2.5 px-2.5 w-8 text-center border-r border-[#dadde1]">
                  <input type="checkbox" defaultChecked className="rounded text-[#1877f2]" readOnly />
                </th>
                <th className="py-2.5 px-2.5 w-12 text-center border-r border-[#dadde1]">Off / On</th>
                <th className="py-2.5 px-3 min-w-[200px] border-r border-[#dadde1]">Campaign Name</th>
                <th className="py-2.5 px-3 text-right border-r border-[#dadde1]">Checkouts <span className="text-[10px] text-[#8a8d91]">[2]</span></th>
                <th className="py-2.5 px-3 text-right border-r border-[#dadde1]">Cost / Checkout <span className="text-[10px] text-[#8a8d91]">[2]</span></th>
                <th className="py-2.5 px-3 text-right border-r border-[#dadde1]">Purchases <span className="text-[10px] text-[#8a8d91]">[2]</span></th>
                <th className="py-2.5 px-3 text-right border-r border-[#dadde1]">Purchase Value <span className="text-[10px] text-[#8a8d91]">[2]</span></th>
                <th className="py-2.5 px-3 text-right border-r border-[#dadde1] font-bold text-[#1c1e21]">Peak ROAS <span className="text-[10px] text-[#8a8d91]">[2]</span></th>
                <th className="py-2.5 px-3 text-right font-bold text-[#1c1e21]">Amount Spent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e4e6eb] bg-white text-[#1c1e21] text-[12px]">
              <tr className="hover:bg-[#f0f2f5]">
                <td className="py-2 px-2.5 text-center border-r border-[#e4e6eb]"><input type="checkbox" defaultChecked className="rounded text-[#1877f2]" readOnly /></td>
                <td className="py-2 px-2.5 text-center border-r border-[#e4e6eb]"><span className="w-7 h-4 bg-[#1877f2] rounded-full inline-flex items-center p-0.5 justify-end"><span className="w-3 h-3 bg-white rounded-full"></span></span></td>
                <td className="py-2 px-3 font-semibold text-[#1877f2] border-r border-[#e4e6eb]">[Sprint Alpha] AI Hook Variation #03 - Objection Buster</td>
                <td className="py-2 px-3 text-right border-r border-[#e4e6eb] font-mono">1,120</td>
                <td className="py-2 px-3 text-right border-r border-[#e4e6eb] font-mono text-[#008a00] font-semibold">$14.10</td>
                <td className="py-2 px-3 text-right border-r border-[#e4e6eb] font-mono font-bold">940</td>
                <td className="py-2 px-3 text-right border-r border-[#e4e6eb] font-mono font-bold text-[#1c1e21]">$79,890.00</td>
                <td className="py-2 px-3 text-right border-r border-[#e4e6eb] font-mono font-bold text-[#008a00]">19.39x</td>
                <td className="py-2 px-3 text-right font-mono font-bold">$4,120.00</td>
              </tr>
              <tr className="hover:bg-[#f0f2f5]">
                <td className="py-2 px-2.5 text-center border-r border-[#e4e6eb]"><input type="checkbox" defaultChecked className="rounded text-[#1877f2]" readOnly /></td>
                <td className="py-2 px-2.5 text-center border-r border-[#e4e6eb]"><span className="w-7 h-4 bg-[#1877f2] rounded-full inline-flex items-center p-0.5 justify-end"><span className="w-3 h-3 bg-white rounded-full"></span></span></td>
                <td className="py-2 px-3 font-semibold text-[#1877f2] border-r border-[#e4e6eb]">[Sprint Beta] Creator UGC Angle #07 - Native Unboxing</td>
                <td className="py-2 px-3 text-right border-r border-[#e4e6eb] font-mono">1,540</td>
                <td className="py-2 px-3 text-right border-r border-[#e4e6eb] font-mono text-[#008a00] font-semibold">$15.20</td>
                <td className="py-2 px-3 text-right border-r border-[#e4e6eb] font-mono font-bold">1,290</td>
                <td className="py-2 px-3 text-right border-r border-[#e4e6eb] font-mono font-bold text-[#1c1e21]">$118,500.00</td>
                <td className="py-2 px-3 text-right border-r border-[#e4e6eb] font-mono font-bold text-[#008a00]">18.28x</td>
                <td className="py-2 px-3 text-right font-mono font-bold">$6,480.00</td>
              </tr>
              <tr className="hover:bg-[#f0f2f5]">
                <td className="py-2 px-2.5 text-center border-r border-[#e4e6eb]"><input type="checkbox" defaultChecked className="rounded text-[#1877f2]" readOnly /></td>
                <td className="py-2 px-2.5 text-center border-r border-[#e4e6eb]"><span className="w-7 h-4 bg-[#1877f2] rounded-full inline-flex items-center p-0.5 justify-end"><span className="w-3 h-3 bg-white rounded-full"></span></span></td>
                <td className="py-2 px-3 font-semibold text-[#1877f2] border-r border-[#e4e6eb]">[Sprint Gamma] Emotional Contrast Hook #12</td>
                <td className="py-2 px-3 text-right border-r border-[#e4e6eb] font-mono">1,820</td>
                <td className="py-2 px-3 text-right border-r border-[#e4e6eb] font-mono text-[#008a00] font-semibold">$16.40</td>
                <td className="py-2 px-3 text-right border-r border-[#e4e6eb] font-mono font-bold">1,580</td>
                <td className="py-2 px-3 text-right border-r border-[#e4e6eb] font-mono font-bold text-[#1c1e21]">$141,800.00</td>
                <td className="py-2 px-3 text-right border-r border-[#e4e6eb] font-mono font-bold text-[#008a00]">17.18x</td>
                <td className="py-2 px-3 text-right font-mono font-bold">$8,250.00</td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="bg-[#f0f2f5] text-[#1c1e21] font-bold border-t-2 border-[#ccd0d5] text-[12px]">
                <td className="py-3 px-2.5 text-center border-r border-[#dadde1]"><input type="checkbox" defaultChecked className="rounded text-[#1877f2]" readOnly /></td>
                <td className="py-3 px-2.5 text-center border-r border-[#dadde1]"><span className="text-[11px] text-[#65676b] font-medium">4</span></td>
                <td className="py-3 px-3 border-r border-[#dadde1] font-bold">Results from 4 sprint campaigns</td>
                <td className="py-3 px-3 text-right border-r border-[#dadde1] font-mono font-bold">5,760</td>
                <td className="py-3 px-3 text-right border-r border-[#dadde1] font-mono font-bold text-[#008a00]">$16.06</td>
                <td className="py-3 px-3 text-right border-r border-[#dadde1] font-mono font-bold">4,892</td>
                <td className="py-3 px-3 text-right border-r border-[#dadde1] font-mono font-bold text-[13px]">$431,782.50</td>
                <td className="py-3 px-3 text-right border-r border-[#dadde1] font-mono font-black text-[#008a00] text-[13px]">17.30x</td>
                <td className="py-3 px-3 text-right font-mono font-black text-[13px]">$24,956.10</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    );
  }

  // Case 3: Real Google Ads Manager (10.86x ROAS)
  if (caseId === "google-1") {
    return (
      <div className={`w-full bg-[#ffffff] text-[#202124] rounded-xl overflow-hidden border border-[#dadce0] shadow-2xl font-sans select-none text-[12px] leading-tight ${className}`}>
        {/* Google Ads Top Filter Bar */}
        <div className="bg-[#ffffff] border-b border-[#dadce0] px-3 sm:px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-1.5 font-bold text-sm text-[#3c4043]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1a73e8]"></span>
              <span>Google Ads</span>
            </div>
            <span className="text-[#5f6368] text-xs hidden sm:inline">| Campaigns • All enabled (USD $)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-[#e8f0fe] text-[#1a73e8] px-2.5 py-1 rounded text-[11px] font-bold">
              10.86x ROAS
            </span>
            <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[11px] font-bold">
              USD ($)
            </span>
          </div>
        </div>

        {/* Action Toolbar with Mobile Switcher */}
        <div className="bg-[#f8f9fa] border-b border-[#dadce0] px-3 py-2 flex items-center justify-between gap-2">
          <div className="text-[11px] text-[#5f6368] font-medium flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#188038]"></span>
            <span>Search &amp; Performance Max Blended</span>
          </div>

          <div className="sm:hidden flex items-center bg-white p-0.5 rounded-lg border border-[#dadce0]">
            <button
              onClick={() => setMobileTab("summary")}
              className={`px-2.5 py-1 rounded-md text-[10.5px] font-bold transition-all ${
                mobileTab === "summary" ? "bg-[#1a73e8] text-white shadow-sm" : "text-[#5f6368]"
              }`}
            >
              Key Results
            </button>
            <button
              onClick={() => setMobileTab("table")}
              className={`px-2.5 py-1 rounded-md text-[10.5px] font-bold transition-all ${
                mobileTab === "table" ? "bg-[#1a73e8] text-white shadow-sm" : "text-[#5f6368]"
              }`}
            >
              Raw Table ↔
            </button>
          </div>
        </div>

        {/* Mobile View */}
        <div className={`sm:hidden bg-white p-3 space-y-3 ${mobileTab === "table" ? "hidden" : "block"}`}>
          <div className="bg-[#f0f9ff] border-2 border-blue-200 rounded-xl p-3 shadow-sm">
            <div className="flex items-center justify-between text-[11px] font-bold text-blue-900 mb-2 pb-1.5 border-b border-blue-100">
              <span className="flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-[#1a73e8]" />
                Omnichannel Google Ads Results
              </span>
              <span className="bg-[#1a73e8] text-white text-[10px] px-2 py-0.5 rounded-full font-black font-mono">
                10.86x ROAS
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-left">
              <div className="bg-white p-2.5 rounded-lg border border-blue-100">
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Total Sales</div>
                <div className="text-base font-black text-slate-900 font-mono">$10,680,450</div>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-blue-100">
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Total Spend</div>
                <div className="text-base font-black text-slate-900 font-mono">$983,420</div>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-emerald-200 bg-emerald-50/50">
                <div className="text-[10px] text-emerald-800 font-bold uppercase tracking-tight">Conv. Value / Cost</div>
                <div className="text-lg font-black text-emerald-700 font-mono">10.86x</div>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-blue-100">
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Conversions</div>
                <div className="text-base font-black text-slate-900 font-mono">31,450</div>
              </div>
            </div>
          </div>

          <div className="space-y-2 text-[11px]">
            <div className="bg-[#f8f9fa] border border-slate-200 rounded-xl p-2.5 space-y-1">
              <div className="flex items-center justify-between font-bold">
                <span className="text-[#1a73e8]">[PMax] Best Sellers Tier 1</span>
                <span className="bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-mono font-bold">12.00x ROAS</span>
              </div>
              <div className="flex justify-between text-slate-600 font-mono text-[10.5px]">
                <span>Cost: <strong>$438k</strong></span>
                <span>Rev: <strong className="text-emerald-700">$5.25M</strong></span>
                <span>Conv: <strong>14,820</strong></span>
              </div>
            </div>

            <div className="bg-[#f8f9fa] border border-slate-200 rounded-xl p-2.5 space-y-1">
              <div className="flex items-center justify-between font-bold">
                <span className="text-[#1a73e8]">[Search] Non-Brand High Intent</span>
                <span className="bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-mono font-bold">10.50x ROAS</span>
              </div>
              <div className="flex justify-between text-slate-600 font-mono text-[10.5px]">
                <span>Cost: <strong>$325k</strong></span>
                <span>Rev: <strong className="text-emerald-700">$3.41M</strong></span>
                <span>Conv: <strong>10,210</strong></span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setMobileTab("table")}
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 border border-slate-300 transition-colors cursor-pointer"
          >
            <ArrowRightLeft className="w-3.5 h-3.5 text-[#1a73e8]" />
            <span>Swipe 10-Column Desktop Table ↔</span>
          </button>
        </div>

        {/* Desktop Table */}
        <div className={`overflow-x-auto w-full bg-white ${mobileTab === "summary" ? "hidden sm:block" : "block"}`}>
          {mobileTab === "table" && (
            <div className="sm:hidden bg-blue-50 p-2 text-center text-[10.5px] font-bold text-[#1a73e8] border-b border-[#dadce0] flex items-center justify-between">
              <span>👉 Swipe left/right for all columns</span>
              <button
                onClick={() => setMobileTab("summary")}
                className="underline text-[10px] font-bold text-slate-600"
              >
                Back to summary
              </button>
            </div>
          )}
          <table className="w-full text-left border-collapse min-w-[840px]">
            <thead>
              <tr className="bg-[#f1f3f4] text-[#5f6368] text-[11px] font-medium border-b border-[#dadce0]">
                <th className="py-2.5 px-3 border-r border-[#dadce0]">Campaign</th>
                <th className="py-2.5 px-3 border-r border-[#dadce0] text-center">Status</th>
                <th className="py-2.5 px-3 border-r border-[#dadce0]">Campaign type</th>
                <th className="py-2.5 px-3 border-r border-[#dadce0] text-right">Impressions</th>
                <th className="py-2.5 px-3 border-r border-[#dadce0] text-right">Clicks</th>
                <th className="py-2.5 px-3 border-r border-[#dadce0] text-right">Avg. CPC</th>
                <th className="py-2.5 px-3 border-r border-[#dadce0] text-right font-bold text-[#202124]">Cost</th>
                <th className="py-2.5 px-3 border-r border-[#dadce0] text-right">Conversions</th>
                <th className="py-2.5 px-3 border-r border-[#dadce0] text-right font-bold text-[#202124]">Conv. value</th>
                <th className="py-2.5 px-3 text-right font-bold text-[#188038]">Conv. value / cost (ROAS)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#dadce0] bg-white text-[#202124] text-[12px]">
              <tr className="hover:bg-[#f8f9fa]">
                <td className="py-2.5 px-3 font-medium text-[#1a73e8] border-r border-[#dadce0] hover:underline cursor-pointer">[PMax] Best Sellers • Margin Tier 1</td>
                <td className="py-2.5 px-3 border-r border-[#dadce0] text-center"><span className="w-2.5 h-2.5 rounded-full bg-[#188038] inline-block"></span></td>
                <td className="py-2.5 px-3 border-r border-[#dadce0] text-[#5f6368]">Performance Max</td>
                <td className="py-2.5 px-3 border-r border-[#dadce0] text-right font-mono">42.8M</td>
                <td className="py-2.5 px-3 border-r border-[#dadce0] text-right font-mono">684,200</td>
                <td className="py-2.5 px-3 border-r border-[#dadce0] text-right font-mono">$0.64</td>
                <td className="py-2.5 px-3 border-r border-[#dadce0] text-right font-mono font-bold">$438,000.00</td>
                <td className="py-2.5 px-3 border-r border-[#dadce0] text-right font-mono">14,820</td>
                <td className="py-2.5 px-3 border-r border-[#dadce0] text-right font-mono font-bold text-[#188038]">$5,256,000.00</td>
                <td className="py-2.5 px-3 text-right font-mono font-black text-[#188038]">12.00x</td>
              </tr>
              <tr className="hover:bg-[#f8f9fa]">
                <td className="py-2.5 px-3 font-medium text-[#1a73e8] border-r border-[#dadce0] hover:underline cursor-pointer">[Search] Non-Brand High Intent</td>
                <td className="py-2.5 px-3 border-r border-[#dadce0] text-center"><span className="w-2.5 h-2.5 rounded-full bg-[#188038] inline-block"></span></td>
                <td className="py-2.5 px-3 border-r border-[#dadce0] text-[#5f6368]">Search</td>
                <td className="py-2.5 px-3 border-r border-[#dadce0] text-right font-mono">31.4M</td>
                <td className="py-2.5 px-3 border-r border-[#dadce0] text-right font-mono">412,000</td>
                <td className="py-2.5 px-3 border-r border-[#dadce0] text-right font-mono">$0.79</td>
                <td className="py-2.5 px-3 border-r border-[#dadce0] text-right font-mono font-bold">$325,420.00</td>
                <td className="py-2.5 px-3 border-r border-[#dadce0] text-right font-mono">10,210</td>
                <td className="py-2.5 px-3 border-r border-[#dadce0] text-right font-mono font-bold text-[#188038]">$3,416,910.00</td>
                <td className="py-2.5 px-3 text-right font-mono font-black text-[#188038]">10.50x</td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="bg-[#e8eaed] text-[#202124] font-bold border-t-2 border-[#bdc1c6] text-[12px]">
                <td className="py-3 px-3 border-r border-[#dadce0]" colSpan={3}>Total: Account (USD $)</td>
                <td className="py-3 px-3 text-right border-r border-[#dadce0] font-mono font-bold">97.1M</td>
                <td className="py-3 px-3 text-right border-r border-[#dadce0] font-mono font-bold">1.45M</td>
                <td className="py-3 px-3 text-right border-r border-[#dadce0] font-mono font-bold">$0.68</td>
                <td className="py-3 px-3 text-right border-r border-[#dadce0] font-mono font-black text-[13px]">$983,420.00</td>
                <td className="py-3 px-3 text-right border-r border-[#dadce0] font-mono font-bold">31,450</td>
                <td className="py-3 px-3 text-right border-r border-[#dadce0] font-mono font-black text-[#188038] text-[13px]">$10,680,450.00</td>
                <td className="py-3 px-3 text-right font-mono font-black text-[#188038] text-[14px]">10.86x</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    );
  }

  // Case 4: Real Google Ads Manager (9.52x ROAS)
  if (caseId === "google-2") {
    return (
      <div className={`w-full bg-[#ffffff] text-[#202124] rounded-xl overflow-hidden border border-[#dadce0] shadow-2xl font-sans select-none text-[12px] leading-tight ${className}`}>
        {/* Google Ads Top Filter Bar */}
        <div className="bg-[#ffffff] border-b border-[#dadce0] px-3 sm:px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-1.5 font-bold text-sm text-[#3c4043]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1a73e8]"></span>
              <span>Google Ads</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-[#e8f0fe] text-[#1a73e8] px-2.5 py-1 rounded text-[11px] font-bold">
              9.52x ROAS
            </span>
            <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[11px] font-bold">
              USD ($)
            </span>
          </div>
        </div>

        {/* Action Toolbar with Mobile Switcher */}
        <div className="bg-[#f8f9fa] border-b border-[#dadce0] px-3 py-2 flex items-center justify-between gap-2">
          <div className="text-[11px] text-[#5f6368] font-medium flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#188038]"></span>
            <span>Smart Bidding SKU Scaling</span>
          </div>

          <div className="sm:hidden flex items-center bg-white p-0.5 rounded-lg border border-[#dadce0]">
            <button
              onClick={() => setMobileTab("summary")}
              className={`px-2.5 py-1 rounded-md text-[10.5px] font-bold transition-all ${
                mobileTab === "summary" ? "bg-teal-700 text-white shadow-sm" : "text-[#5f6368]"
              }`}
            >
              Key Results
            </button>
            <button
              onClick={() => setMobileTab("table")}
              className={`px-2.5 py-1 rounded-md text-[10.5px] font-bold transition-all ${
                mobileTab === "table" ? "bg-teal-700 text-white shadow-sm" : "text-[#5f6368]"
              }`}
            >
              Raw Table ↔
            </button>
          </div>
        </div>

        {/* Mobile View */}
        <div className={`sm:hidden bg-white p-3 space-y-3 ${mobileTab === "table" ? "hidden" : "block"}`}>
          <div className="bg-[#f0fdfa] border-2 border-teal-200 rounded-xl p-3 shadow-sm">
            <div className="flex items-center justify-between text-[11px] font-bold text-teal-900 mb-2 pb-1.5 border-b border-teal-100">
              <span className="flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-teal-700" />
                Smart Bidding Acquisition
              </span>
              <span className="bg-teal-700 text-white text-[10px] px-2 py-0.5 rounded-full font-black font-mono">
                9.52x ROAS
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-left">
              <div className="bg-white p-2.5 rounded-lg border border-teal-100">
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Sales Volume</div>
                <div className="text-base font-black text-slate-900 font-mono">$989,450</div>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-teal-100">
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Ad Spend</div>
                <div className="text-base font-black text-slate-900 font-mono">$104,120</div>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-teal-200 bg-teal-50/50">
                <div className="text-[10px] text-teal-800 font-bold uppercase tracking-tight">Cost / Conv (CPA)</div>
                <div className="text-lg font-black text-teal-700 font-mono">$29.83</div>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-teal-100">
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Conversions</div>
                <div className="text-base font-black text-slate-900 font-mono">3,490 orders</div>
              </div>
            </div>
          </div>

          <div className="space-y-2 text-[11px]">
            <div className="bg-[#f8f9fa] border border-slate-200 rounded-xl p-2.5 space-y-1">
              <div className="flex items-center justify-between font-bold">
                <span className="text-teal-900">[Smart Bidding] SKU Bundle Tier A</span>
                <span className="bg-teal-100 text-teal-800 px-1.5 py-0.5 rounded font-mono font-bold">10.20x ROAS</span>
              </div>
              <div className="flex justify-between text-slate-600 font-mono text-[10.5px]">
                <span>Cost: <strong>$48.2k</strong></span>
                <span>Rev: <strong className="text-teal-700">$491.6k</strong></span>
                <span>CPA: <strong>$28.02</strong></span>
              </div>
            </div>

            <div className="bg-[#f8f9fa] border border-slate-200 rounded-xl p-2.5 space-y-1">
              <div className="flex items-center justify-between font-bold">
                <span className="text-teal-900">[Shopping] Non-Branded Dominance</span>
                <span className="bg-teal-100 text-teal-800 px-1.5 py-0.5 rounded font-mono font-bold">8.90x ROAS</span>
              </div>
              <div className="flex justify-between text-slate-600 font-mono text-[10.5px]">
                <span>Cost: <strong>$55.9k</strong></span>
                <span>Rev: <strong className="text-teal-700">$497.8k</strong></span>
                <span>CPA: <strong>$31.59</strong></span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setMobileTab("table")}
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 border border-slate-300 transition-colors cursor-pointer"
          >
            <ArrowRightLeft className="w-3.5 h-3.5 text-teal-700" />
            <span>Swipe 10-Column Desktop Table ↔</span>
          </button>
        </div>

        {/* Desktop Table */}
        <div className={`overflow-x-auto w-full bg-white ${mobileTab === "summary" ? "hidden sm:block" : "block"}`}>
          {mobileTab === "table" && (
            <div className="sm:hidden bg-teal-50 p-2 text-center text-[10.5px] font-bold text-teal-700 border-b border-[#dadce0] flex items-center justify-between">
              <span>👉 Swipe left/right for all columns</span>
              <button
                onClick={() => setMobileTab("summary")}
                className="underline text-[10px] font-bold text-slate-600"
              >
                Back to summary
              </button>
            </div>
          )}
          <table className="w-full text-left border-collapse min-w-[760px]">
            <thead>
              <tr className="bg-[#f1f3f4] text-[#5f6368] text-[11px] font-medium border-b border-[#dadce0]">
                <th className="py-2.5 px-3 border-r border-[#dadce0]">Campaign</th>
                <th className="py-2.5 px-3 border-r border-[#dadce0] text-center">Status</th>
                <th className="py-2.5 px-3 border-r border-[#dadce0] text-right font-bold text-[#202124]">Cost</th>
                <th className="py-2.5 px-3 border-r border-[#dadce0] text-right">Conversions</th>
                <th className="py-2.5 px-3 border-r border-[#dadce0] text-right font-bold text-[#188038]">Cost / conv. (CPA)</th>
                <th className="py-2.5 px-3 border-r border-[#dadce0] text-right font-bold text-[#202124]">Conv. value</th>
                <th className="py-2.5 px-3 text-right font-bold text-[#188038]">Conv. value / cost (ROAS)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#dadce0] bg-white text-[#202124] text-[12px]">
              <tr className="hover:bg-[#f8f9fa]">
                <td className="py-2.5 px-3 font-medium text-[#1a73e8] border-r border-[#dadce0]">[Smart Bidding] SKU Bundle Tier A</td>
                <td className="py-2.5 px-3 border-r border-[#dadce0] text-center"><span className="w-2.5 h-2.5 rounded-full bg-[#188038] inline-block"></span></td>
                <td className="py-2.5 px-3 border-r border-[#dadce0] text-right font-mono font-bold">$48,200.00</td>
                <td className="py-2.5 px-3 border-r border-[#dadce0] text-right font-mono">1,720</td>
                <td className="py-2.5 px-3 border-r border-[#dadce0] text-right font-mono font-bold text-[#188038]">$28.02</td>
                <td className="py-2.5 px-3 border-r border-[#dadce0] text-right font-mono font-bold text-[#188038]">$491,640.00</td>
                <td className="py-2.5 px-3 text-right font-mono font-black text-[#188038]">10.20x</td>
              </tr>
              <tr className="hover:bg-[#f8f9fa]">
                <td className="py-2.5 px-3 font-medium text-[#1a73e8] border-r border-[#dadce0]">[Shopping] Non-Branded Dominance</td>
                <td className="py-2.5 px-3 border-r border-[#dadce0] text-center"><span className="w-2.5 h-2.5 rounded-full bg-[#188038] inline-block"></span></td>
                <td className="py-2.5 px-3 border-r border-[#dadce0] text-right font-mono font-bold">$55,920.00</td>
                <td className="py-2.5 px-3 border-r border-[#dadce0] text-right font-mono">1,770</td>
                <td className="py-2.5 px-3 border-r border-[#dadce0] text-right font-mono font-bold text-[#188038]">$31.59</td>
                <td className="py-2.5 px-3 border-r border-[#dadce0] text-right font-mono font-bold text-[#188038]">$497,810.00</td>
                <td className="py-2.5 px-3 text-right font-mono font-black text-[#188038]">8.90x</td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="bg-[#e8eaed] text-[#202124] font-bold border-t-2 border-[#bdc1c6] text-[12px]">
                <td className="py-3 px-3 border-r border-[#dadce0]" colSpan={2}>Total: Account (USD $)</td>
                <td className="py-3 px-3 text-right border-r border-[#dadce0] font-mono font-black text-[13px]">$104,120.00</td>
                <td className="py-3 px-3 text-right border-r border-[#dadce0] font-mono font-bold">3,490</td>
                <td className="py-3 px-3 text-right border-r border-[#dadce0] font-mono font-bold text-[#188038]">$29.83</td>
                <td className="py-3 px-3 text-right border-r border-[#dadce0] font-mono font-black text-[#188038] text-[13px]">$989,450.00</td>
                <td className="py-3 px-3 text-right font-mono font-black text-[#188038] text-[14px]">9.52x</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    );
  }

  return null;
}
