"use client";

import { listings, offMarketLeads } from "@/lib/mock-data";
import { fmtDollar } from "@/lib/format";
import {
  DollarSign,
  TrendingUp,
  Target,
  Users,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#3b82f6", "#22c55e", "#f59e0b", "#a78bfa", "#ef4444"];

export default function Dashboard() {
  const activeListings = listings.filter((l) => l.status !== "passed");
  const avgMultiple =
    activeListings.reduce((s, l) => s + l.multiple, 0) / activeListings.length;
  const avgRevenue =
    activeListings.reduce((s, l) => s + l.revenue, 0) / activeListings.length;
  const totalPipeline = activeListings.reduce(
    (s, l) => s + l.askingPrice,
    0
  );
  const hotLeads = offMarketLeads.filter((l) => l.priorityScore >= 85);

  const topDeals = [...listings]
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  const statusCounts = [
    {
      name: "New",
      value: listings.filter((l) => l.status === "new").length,
    },
    {
      name: "Reviewing",
      value: listings.filter((l) => l.status === "reviewing").length,
    },
    {
      name: "Contacted",
      value: listings.filter((l) => l.status === "contacted").length,
    },
    {
      name: "LOI",
      value: listings.filter((l) => l.status === "loi").length,
    },
    {
      name: "Passed",
      value: listings.filter((l) => l.status === "passed").length,
    },
  ];

  const stateData = [
    {
      state: "NJ",
      count: listings.filter((l) => l.state === "NJ").length,
      offMarket: offMarketLeads.filter((l) => l.state === "NJ").length,
    },
    {
      state: "NY",
      count: listings.filter((l) => l.state === "NY").length,
      offMarket: offMarketLeads.filter((l) => l.state === "NY").length,
    },
    {
      state: "CT",
      count: listings.filter((l) => l.state === "CT").length,
      offMarket: offMarketLeads.filter((l) => l.state === "CT").length,
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">
          Deal Sourcing Dashboard
        </h1>
        <p className="text-[var(--muted)] text-sm mt-1">
          Residential pest control acquisitions | NYC Metro (NY, NJ, CT)
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <KPICard
          label="Active Pipeline"
          value={`$${(totalPipeline / 1_000_000).toFixed(1)}M`}
          sub={`${activeListings.length} listings`}
          icon={<DollarSign className="w-4 h-4" />}
          color="var(--accent)"
        />
        <KPICard
          label="Avg Revenue"
          value={`$${(avgRevenue / 1_000_000).toFixed(2)}M`}
          sub="Target: $1M-$3M"
          icon={<TrendingUp className="w-4 h-4" />}
          color="var(--accent-green)"
        />
        <KPICard
          label="Avg Multiple"
          value={`${avgMultiple.toFixed(1)}x`}
          sub="Target: 3.0-4.5x"
          icon={<Target className="w-4 h-4" />}
          color="var(--accent-amber)"
        />
        <KPICard
          label="Off-Market Hot Leads"
          value={hotLeads.length.toString()}
          sub={`${offMarketLeads.length} total leads`}
          icon={<Users className="w-4 h-4" />}
          color="var(--accent-purple)"
        />
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        {/* Pipeline Status */}
        <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-5">
          <h3 className="text-sm font-semibold mb-4">Pipeline Status</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={statusCounts}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                dataKey="value"
                stroke="none"
              >
                {statusCounts.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-3 mt-2 justify-center">
            {statusCounts.map((s, i) => (
              <div key={s.name} className="flex items-center gap-1.5 text-xs text-[var(--muted)]">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ background: COLORS[i] }}
                />
                {s.name} ({s.value})
              </div>
            ))}
          </div>
        </div>

        {/* By State */}
        <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-5">
          <h3 className="text-sm font-semibold mb-4">
            Opportunities by State
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={stateData}>
              <XAxis
                dataKey="state"
                tick={{ fill: "var(--muted)", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "var(--muted)", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <Bar
                dataKey="count"
                name="Listed"
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="offMarket"
                name="Off-Market"
                fill="#a78bfa"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Quick Actions */}
        <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-5">
          <h3 className="text-sm font-semibold mb-4">Acquisition Criteria</h3>
          <div className="space-y-3">
            <CriteriaRow label="Revenue" value="$1M - $3M" met />
            <CriteriaRow label="EBITDA Margin" value="15% - 22%" met />
            <CriteriaRow label="Multiple" value="3.0x - 4.5x EBITDA" met />
            <CriteriaRow label="Geography" value="NY, NJ, CT" met />
            <CriteriaRow label="Recurring Rev %" value=">70%" met />
            <CriteriaRow label="Owner Age" value="55-70, transition ready" met />
            <CriteriaRow label="Employees" value="8-20 techs" met />
            <CriteriaRow label="Customer Base" value="800-2,500+ recurring" met />
          </div>
        </div>
      </div>

      {/* Top Scored Deals */}
      <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-5 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold">
            Top Scored Opportunities
          </h3>
          <Link
            href="/listings"
            className="text-xs text-[var(--accent)] flex items-center gap-1 hover:underline"
          >
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[var(--muted)] text-xs uppercase tracking-wider border-b border-[var(--border)]">
                <th className="text-left py-3 px-3 font-medium">Score</th>
                <th className="text-left py-3 px-3 font-medium">Business</th>
                <th className="text-left py-3 px-3 font-medium">Location</th>
                <th className="text-right py-3 px-3 font-medium">Revenue</th>
                <th className="text-right py-3 px-3 font-medium">Asking</th>
                <th className="text-right py-3 px-3 font-medium">Multiple</th>
                <th className="text-right py-3 px-3 font-medium">EBITDA %</th>
                <th className="text-right py-3 px-3 font-medium">Recurring %</th>
                <th className="text-left py-3 px-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {topDeals.map((deal) => (
                <tr
                  key={deal.id}
                  className="border-b border-[var(--border)] hover:bg-[var(--card-hover)] transition-colors"
                >
                  <td className="py-3 px-3">
                    <ScoreBadge score={deal.score} />
                  </td>
                  <td className="py-3 px-3 font-medium">{deal.name}</td>
                  <td className="py-3 px-3 text-[var(--muted)]">
                    {deal.location}
                  </td>
                  <td className="py-3 px-3 text-right">
                    {fmtDollar(deal.revenue)}
                  </td>
                  <td className="py-3 px-3 text-right">
                    {fmtDollar(deal.askingPrice)}
                  </td>
                  <td className="py-3 px-3 text-right">
                    {deal.multiple.toFixed(1)}x
                  </td>
                  <td className="py-3 px-3 text-right">{deal.ebitdaMargin}%</td>
                  <td className="py-3 px-3 text-right">
                    {deal.recurringRevenuePct}%
                  </td>
                  <td className="py-3 px-3">
                    <StatusBadge status={deal.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Off-Market Hot Leads */}
      <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold">
            Off-Market Hot Leads (Score 85+)
          </h3>
          <Link
            href="/off-market"
            className="text-xs text-[var(--accent)] flex items-center gap-1 hover:underline"
          >
            View pipeline <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {hotLeads.slice(0, 4).map((lead) => (
            <div
              key={lead.id}
              className="p-4 rounded-lg bg-[var(--background)] border border-[var(--border)]"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-sm">{lead.businessName}</p>
                  <p className="text-xs text-[var(--muted)]">
                    {lead.city}, {lead.state} | {lead.yearsInBusiness} yrs |{" "}
                    {lead.ownerAge}
                  </p>
                </div>
                <span className="text-xs font-bold text-[var(--accent-green)] bg-[var(--accent-green)]/10 px-2 py-0.5 rounded-full">
                  {lead.priorityScore}
                </span>
              </div>
              <p className="text-xs text-[var(--muted)] mt-2">{lead.estimatedRevenue} est. revenue</p>
              <div className="flex items-center gap-2 mt-2">
                <OutreachBadge status={lead.outreachStatus} />
                <span className="text-[10px] text-[var(--muted)]">
                  via {lead.source.replace("_", " ")}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function KPICard({
  label,
  value,
  sub,
  icon,
  color,
}: {
  label: string;
  value: string;
  sub: string;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-5">
      <div className="flex items-center gap-2 mb-3">
        <div
          className="w-7 h-7 rounded-md flex items-center justify-center"
          style={{ background: `color-mix(in srgb, ${color} 15%, transparent)`, color }}
        >
          {icon}
        </div>
        <span className="text-xs text-[var(--muted)] font-medium">{label}</span>
      </div>
      <p className="text-2xl font-bold tracking-tight">{value}</p>
      <p className="text-xs text-[var(--muted)] mt-1">{sub}</p>
    </div>
  );
}

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 85
      ? "var(--accent-green)"
      : score >= 70
      ? "var(--accent-amber)"
      : "var(--accent-red)";
  return (
    <span
      className="inline-flex items-center justify-center w-9 h-9 rounded-full text-xs font-bold"
      style={{
        background: `color-mix(in srgb, ${color} 15%, transparent)`,
        color,
      }}
    >
      {score}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
    new: { icon: <AlertCircle className="w-3 h-3" />, color: "var(--accent)", label: "New" },
    reviewing: { icon: <Clock className="w-3 h-3" />, color: "var(--accent-amber)", label: "Reviewing" },
    contacted: { icon: <CheckCircle2 className="w-3 h-3" />, color: "var(--accent-green)", label: "Contacted" },
    passed: { icon: <AlertCircle className="w-3 h-3" />, color: "var(--accent-red)", label: "Passed" },
    loi: { icon: <CheckCircle2 className="w-3 h-3" />, color: "var(--accent-purple)", label: "LOI" },
  };
  const c = config[status] || config.new;
  return (
    <span
      className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium"
      style={{
        background: `color-mix(in srgb, ${c.color} 15%, transparent)`,
        color: c.color,
      }}
    >
      {c.icon}
      {c.label}
    </span>
  );
}

function OutreachBadge({ status }: { status: string }) {
  const labels: Record<string, { label: string; color: string }> = {
    not_contacted: { label: "Not Contacted", color: "var(--muted)" },
    contacted: { label: "Contacted", color: "var(--accent-amber)" },
    responded: { label: "Responded", color: "var(--accent-green)" },
    meeting_set: { label: "Meeting Set", color: "var(--accent-purple)" },
    not_interested: { label: "Not Interested", color: "var(--accent-red)" },
  };
  const c = labels[status] || labels.not_contacted;
  return (
    <span
      className="text-[10px] px-1.5 py-0.5 rounded font-medium"
      style={{
        background: `color-mix(in srgb, ${c.color} 15%, transparent)`,
        color: c.color,
      }}
    >
      {c.label}
    </span>
  );
}

function CriteriaRow({
  label,
  value,
  met,
}: {
  label: string;
  value: string;
  met: boolean;
}) {
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="text-[var(--muted)]">{label}</span>
      <span className={met ? "text-[var(--accent-green)] font-medium" : "text-[var(--accent-red)]"}>
        {value}
      </span>
    </div>
  );
}
