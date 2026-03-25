"use client";

import { listings, offMarketLeads } from "@/lib/mock-data";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  CartesianGrid,
  ZAxis,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  TrendingUp,
  MapPin,
  Target,
  DollarSign,
  BarChart3,
  Zap,
} from "lucide-react";

const COLORS = ["#3b82f6", "#22c55e", "#f59e0b", "#a78bfa", "#ef4444", "#06b6d4"];

export default function IntelligencePage() {
  // Multiple vs Revenue scatter data
  const scatterData = listings.map((l) => ({
    name: l.name,
    revenue: l.revenue / 1_000_000,
    multiple: l.multiple,
    ebitdaMargin: l.ebitdaMargin,
    score: l.score,
  }));

  // State comparison
  const stateComparison = ["NY", "NJ", "CT"].map((state) => {
    const stateListings = listings.filter((l) => l.state === state);
    const stateLeads = offMarketLeads.filter((l) => l.state === state);
    return {
      state,
      listings: stateListings.length,
      offMarket: stateLeads.length,
      avgMultiple: stateListings.length > 0
        ? +(stateListings.reduce((s, l) => s + l.multiple, 0) / stateListings.length).toFixed(1)
        : 0,
      avgMargin: stateListings.length > 0
        ? +(stateListings.reduce((s, l) => s + l.ebitdaMargin, 0) / stateListings.length).toFixed(1)
        : 0,
      avgRevenue: stateListings.length > 0
        ? +(stateListings.reduce((s, l) => s + l.revenue, 0) / stateListings.length / 1_000_000).toFixed(2)
        : 0,
    };
  });

  // Source distribution
  const sourceData = [
    { name: "BizBuySell", value: listings.filter((l) => l.source === "bizbuysell").length },
    { name: "DealStream", value: listings.filter((l) => l.source === "dealstream").length },
    { name: "HedgeStone", value: listings.filter((l) => l.source === "hedgestone").length },
    { name: "LoopNet", value: listings.filter((l) => l.source === "loopnet").length },
    { name: "BizQuest", value: listings.filter((l) => l.source === "bizquest").length },
  ];

  // Radar chart for market scoring
  const radarData = [
    { metric: "Market Size", ny: 9, nj: 7, ct: 5 },
    { metric: "Fragmentation", ny: 8, nj: 9, ct: 8 },
    { metric: "Deal Flow", ny: 8, nj: 7, ct: 5 },
    { metric: "Avg Multiple", ny: 6, nj: 8, ct: 8 },
    { metric: "Growth Rate", ny: 7, nj: 8, ct: 6 },
    { metric: "Route Density", ny: 9, nj: 8, ct: 5 },
  ];

  // Revenue buckets
  const revBuckets = [
    { range: "<$500K", count: listings.filter((l) => l.revenue < 500_000).length },
    { range: "$500K-$1M", count: listings.filter((l) => l.revenue >= 500_000 && l.revenue < 1_000_000).length },
    { range: "$1M-$2M", count: listings.filter((l) => l.revenue >= 1_000_000 && l.revenue < 2_000_000).length },
    { range: "$2M-$3M", count: listings.filter((l) => l.revenue >= 2_000_000 && l.revenue < 3_000_000).length },
    { range: "$3M+", count: listings.filter((l) => l.revenue >= 3_000_000).length },
  ];

  // Key comps
  const comps = [
    { metric: "Rollins (ROL)", multiple: "25-30x EBITDA", note: "Public market premium, $3.2B revenue" },
    { metric: "Rentokil Initial", multiple: "18-22x EBITDA", note: "Post-Terminix merger, global scale" },
    { metric: "Anticimex", multiple: "15-18x EBITDA", note: "Private, PE-backed, 400+ acquisitions" },
    { metric: "Regional platforms ($10-50M)", multiple: "7-10x EBITDA", note: "Our exit target range" },
    { metric: "Local operators ($1-5M)", multiple: "3-4.5x EBITDA", note: "Our entry buy range" },
  ];

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Market Intelligence</h1>
        <p className="text-[var(--muted)] text-sm mt-1">
          Residential pest control market analysis | NYC Metro area
        </p>
      </div>

      {/* Industry Overview Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <IndustryCard
          icon={<DollarSign className="w-4 h-4" />}
          label="US Market Size"
          value="$25-29B"
          sub="Growing 5-6% annually"
          color="var(--accent)"
        />
        <IndustryCard
          icon={<BarChart3 className="w-4 h-4" />}
          label="Industry Firms"
          value="~33,100"
          sub="60%+ sub-$5M revenue"
          color="var(--accent-green)"
        />
        <IndustryCard
          icon={<Target className="w-4 h-4" />}
          label="Entry Multiple"
          value="3.0-4.5x"
          sub="EBITDA for $1-3M rev"
          color="var(--accent-amber)"
        />
        <IndustryCard
          icon={<Zap className="w-4 h-4" />}
          label="Exit Multiple"
          value="7-9x"
          sub="Strategic premium at scale"
          color="var(--accent-purple)"
        />
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Multiple vs Revenue Scatter */}
        <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-5">
          <h3 className="text-sm font-semibold mb-4">Multiple vs Revenue (Bubble = Score)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis
                dataKey="revenue"
                name="Revenue ($M)"
                tick={{ fill: "var(--muted)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                label={{ value: "Revenue ($M)", position: "bottom", fill: "var(--muted)", fontSize: 11 }}
              />
              <YAxis
                dataKey="multiple"
                name="Multiple"
                tick={{ fill: "var(--muted)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                label={{ value: "Multiple (x)", angle: -90, position: "left", fill: "var(--muted)", fontSize: 11 }}
              />
              <ZAxis dataKey="score" range={[100, 800]} name="Score" />
              <Tooltip
                contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }}
                formatter={(value, name) => [
                  name === "Revenue ($M)" ? `$${Number(value).toFixed(2)}M` : name === "Multiple" ? `${Number(value).toFixed(1)}x` : value,
                  name,
                ]}
              />
              <Scatter data={scatterData} fill="#3b82f6" fillOpacity={0.7} />
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {/* Market Radar */}
        <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-5">
          <h3 className="text-sm font-semibold mb-4">Market Attractiveness by State</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="var(--border)" />
              <PolarAngleAxis dataKey="metric" tick={{ fill: "var(--muted)", fontSize: 11 }} />
              <PolarRadiusAxis tick={false} axisLine={false} domain={[0, 10]} />
              <Radar name="New York" dataKey="ny" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.15} strokeWidth={2} />
              <Radar name="New Jersey" dataKey="nj" stroke="#22c55e" fill="#22c55e" fillOpacity={0.15} strokeWidth={2} />
              <Radar name="Connecticut" dataKey="ct" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.15} strokeWidth={2} />
              <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
            </RadarChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-2">
            <Legend color="#3b82f6" label="New York" />
            <Legend color="#22c55e" label="New Jersey" />
            <Legend color="#f59e0b" label="Connecticut" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-6">
        {/* Revenue Distribution */}
        <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-5">
          <h3 className="text-sm font-semibold mb-4">Revenue Distribution</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={revBuckets}>
              <XAxis dataKey="range" tick={{ fill: "var(--muted)", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "var(--muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Source Mix */}
        <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-5">
          <h3 className="text-sm font-semibold mb-4">Listing Source Mix</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={sourceData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} dataKey="value" stroke="none">
                {sourceData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-3">
            {sourceData.map((s, i) => (
              <div key={s.name} className="flex items-center gap-1.5 text-xs text-[var(--muted)]">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i] }} />
                {s.name} ({s.value})
              </div>
            ))}
          </div>
        </div>

        {/* State Comparison Table */}
        <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-5">
          <h3 className="text-sm font-semibold mb-4">State Comparison</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[var(--muted)] text-xs border-b border-[var(--border)]">
                <th className="text-left py-2 font-medium">State</th>
                <th className="text-right py-2 font-medium">Listed</th>
                <th className="text-right py-2 font-medium">Off-Mkt</th>
                <th className="text-right py-2 font-medium">Avg Mult</th>
                <th className="text-right py-2 font-medium">Avg Margin</th>
              </tr>
            </thead>
            <tbody>
              {stateComparison.map((s) => (
                <tr key={s.state} className="border-b border-[var(--border)]">
                  <td className="py-2.5 font-medium">{s.state}</td>
                  <td className="py-2.5 text-right">{s.listings}</td>
                  <td className="py-2.5 text-right">{s.offMarket}</td>
                  <td className="py-2.5 text-right font-mono">{s.avgMultiple}x</td>
                  <td className="py-2.5 text-right font-mono">{s.avgMargin}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Comparable Transactions */}
      <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-5 mb-6">
        <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-[var(--accent)]" />
          Comparable Transaction Multiples (Industry Reference)
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[var(--muted)] text-xs uppercase tracking-wider border-b border-[var(--border)]">
                <th className="text-left py-3 px-3 font-medium">Comp / Segment</th>
                <th className="text-left py-3 px-3 font-medium">Valuation Multiple</th>
                <th className="text-left py-3 px-3 font-medium">Notes</th>
              </tr>
            </thead>
            <tbody>
              {comps.map((c) => (
                <tr key={c.metric} className="border-b border-[var(--border)]">
                  <td className="py-3 px-3 font-medium">{c.metric}</td>
                  <td className="py-3 px-3 font-mono text-[var(--accent)]">{c.multiple}</td>
                  <td className="py-3 px-3 text-[var(--muted)]">{c.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 p-4 rounded-lg bg-[var(--accent)]/5 border border-[var(--accent)]/20">
          <p className="text-xs text-[var(--accent)] font-semibold mb-1">Multiple Arbitrage Opportunity</p>
          <p className="text-xs text-[var(--muted)]">
            Buy at 3.0-4.5x EBITDA (local operators), professionalize and scale to $15M+ revenue,
            exit at 7-9x EBITDA to strategic acquirers (Rentokil, Rollins, Anticimex) or mid-market PE.
            This 2-3x multiple expansion is the primary return driver, amplified by EBITDA growth from
            tuck-in acquisitions and margin improvements through route density optimization.
          </p>
        </div>
      </div>

      {/* Key Acquisition Criteria Fit Analysis */}
      <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-5">
        <h3 className="text-sm font-semibold mb-4">Key Metrics Across Pipeline</h3>
        <div className="grid grid-cols-4 gap-4">
          <MetricDistribution
            label="EBITDA Margin"
            values={listings.map((l) => l.ebitdaMargin)}
            target={{ min: 15, max: 22 }}
            unit="%"
          />
          <MetricDistribution
            label="Multiple"
            values={listings.map((l) => l.multiple)}
            target={{ min: 3.0, max: 4.5 }}
            unit="x"
          />
          <MetricDistribution
            label="Recurring Revenue %"
            values={listings.map((l) => l.recurringRevenuePct)}
            target={{ min: 70, max: 100 }}
            unit="%"
          />
          <MetricDistribution
            label="Deal Score"
            values={listings.map((l) => l.score)}
            target={{ min: 80, max: 100 }}
            unit=""
          />
        </div>
      </div>
    </div>
  );
}

function IndustryCard({ icon, label, value, sub, color }: { icon: React.ReactNode; label: string; value: string; sub: string; color: string }) {
  return (
    <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-4">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: `color-mix(in srgb, ${color} 15%, transparent)`, color }}>
          {icon}
        </div>
        <span className="text-xs text-[var(--muted)]">{label}</span>
      </div>
      <p className="text-xl font-bold">{value}</p>
      <p className="text-[10px] text-[var(--muted)] mt-0.5">{sub}</p>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5 text-xs text-[var(--muted)]">
      <div className="w-3 h-3 rounded-sm" style={{ background: color }} />
      {label}
    </div>
  );
}

function MetricDistribution({ label, values, target, unit }: { label: string; values: number[]; target: { min: number; max: number }; unit: string }) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const avg = values.reduce((s, v) => s + v, 0) / values.length;
  const inRange = values.filter((v) => v >= target.min && v <= target.max).length;

  return (
    <div className="p-3 rounded-lg bg-[var(--background)] border border-[var(--border)]">
      <p className="text-xs font-semibold mb-2">{label}</p>
      <div className="space-y-1.5 text-[11px]">
        <div className="flex justify-between text-[var(--muted)]">
          <span>Range</span>
          <span className="font-mono">{min.toFixed(1)}{unit} - {max.toFixed(1)}{unit}</span>
        </div>
        <div className="flex justify-between text-[var(--muted)]">
          <span>Average</span>
          <span className="font-mono">{avg.toFixed(1)}{unit}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[var(--muted)]">In target</span>
          <span className="font-mono text-[var(--accent-green)]">{inRange}/{values.length}</span>
        </div>
        <div className="flex justify-between text-[var(--muted)]">
          <span>Target</span>
          <span className="font-mono text-[var(--accent)]">{target.min}{unit} - {target.max}{unit}</span>
        </div>
      </div>
    </div>
  );
}
