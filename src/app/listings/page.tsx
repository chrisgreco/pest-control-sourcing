"use client";

import { useState } from "react";
import { listings } from "@/lib/mock-data";
import { Listing } from "@/lib/types";
import {
  Search,
  SlidersHorizontal,
  ExternalLink,
  MapPin,
  Calendar,
  Users,
  RefreshCw,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

type SortKey = "score" | "revenue" | "askingPrice" | "multiple" | "revenueMultiple" | "ebitdaMargin" | "recurringRevenuePct";

export default function ListingsPage() {
  const [search, setSearch] = useState("");
  const [stateFilter, setStateFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortKey, setSortKey] = useState<SortKey>("score");
  const [sortAsc, setSortAsc] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = listings
    .filter((l) => {
      if (search && !l.name.toLowerCase().includes(search.toLowerCase()) && !l.location.toLowerCase().includes(search.toLowerCase())) return false;
      if (stateFilter !== "all" && l.state !== stateFilter) return false;
      if (sourceFilter !== "all" && l.source !== sourceFilter) return false;
      if (statusFilter !== "all" && l.status !== statusFilter) return false;
      return true;
    })
    .sort((a, b) => {
      const mult = sortAsc ? 1 : -1;
      return (a[sortKey] - b[sortKey]) * mult;
    });

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(false); }
  }

  const SortIcon = ({ col }: { col: SortKey }) =>
    sortKey === col ? (sortAsc ? <ChevronUp className="w-3 h-3 inline" /> : <ChevronDown className="w-3 h-3 inline" />) : null;

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Market Listings</h1>
        <p className="text-[var(--muted)] text-sm mt-1">
          Aggregated from BizBuySell, Transworld, Sunbelt Network, and LoopNet
        </p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
          <input
            type="text"
            placeholder="Search by name or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-[var(--card)] border border-[var(--border)] text-sm focus:outline-none focus:border-[var(--accent)] text-[var(--foreground)]"
          />
        </div>
        <FilterSelect label="State" value={stateFilter} onChange={setStateFilter} options={[
          { value: "all", label: "All States" },
          { value: "NY", label: "New York" },
          { value: "NJ", label: "New Jersey" },
          { value: "CT", label: "Connecticut" },
        ]} />
        <FilterSelect label="Source" value={sourceFilter} onChange={setSourceFilter} options={[
          { value: "all", label: "All Sources" },
          { value: "bizbuysell", label: "BizBuySell" },
          { value: "transworld", label: "Transworld" },
          { value: "sunbelt", label: "Sunbelt" },
          { value: "loopnet", label: "LoopNet" },
        ]} />
        <FilterSelect label="Status" value={statusFilter} onChange={setStatusFilter} options={[
          { value: "all", label: "All Statuses" },
          { value: "new", label: "New" },
          { value: "reviewing", label: "Reviewing" },
          { value: "contacted", label: "Contacted" },
          { value: "passed", label: "Passed" },
          { value: "loi", label: "LOI" },
        ]} />
        <div className="text-xs text-[var(--muted)]">
          <SlidersHorizontal className="w-3 h-3 inline mr-1" />
          {filtered.length} results
        </div>
      </div>

      {/* Table */}
      <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[var(--muted)] text-xs uppercase tracking-wider border-b border-[var(--border)] bg-[var(--background)]">
                <th className="text-left py-3 px-4 font-medium cursor-pointer select-none" onClick={() => toggleSort("score")}>
                  Score <SortIcon col="score" />
                </th>
                <th className="text-left py-3 px-4 font-medium">Business</th>
                <th className="text-left py-3 px-4 font-medium">Source</th>
                <th className="text-right py-3 px-4 font-medium cursor-pointer select-none" onClick={() => toggleSort("revenue")}>
                  Revenue <SortIcon col="revenue" />
                </th>
                <th className="text-right py-3 px-4 font-medium cursor-pointer select-none" onClick={() => toggleSort("askingPrice")}>
                  Asking <SortIcon col="askingPrice" />
                </th>
                <th className="text-right py-3 px-4 font-medium cursor-pointer select-none" onClick={() => toggleSort("revenueMultiple")}>
                  Rev Mult <SortIcon col="revenueMultiple" />
                </th>
                <th className="text-right py-3 px-4 font-medium cursor-pointer select-none" onClick={() => toggleSort("multiple")}>
                  EBITDA Mult <SortIcon col="multiple" />
                </th>
                <th className="text-right py-3 px-4 font-medium cursor-pointer select-none" onClick={() => toggleSort("ebitdaMargin")}>
                  EBITDA % <SortIcon col="ebitdaMargin" />
                </th>
                <th className="text-right py-3 px-4 font-medium cursor-pointer select-none" onClick={() => toggleSort("recurringRevenuePct")}>
                  Recurring % <SortIcon col="recurringRevenuePct" />
                </th>
                <th className="text-left py-3 px-4 font-medium">Status</th>
                <th className="text-center py-3 px-4 font-medium">Link</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((deal) => (
                <>
                  <tr
                    key={deal.id}
                    className="border-b border-[var(--border)] hover:bg-[var(--card-hover)] transition-colors cursor-pointer"
                    onClick={() => setExpanded(expanded === deal.id ? null : deal.id)}
                  >
                    <td className="py-3 px-4">
                      <ScoreBadge score={deal.score} />
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium">{deal.name}</div>
                      <div className="text-xs text-[var(--muted)] flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" /> {deal.location}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <SourceBadge source={deal.source} />
                    </td>
                    <td className="py-3 px-4 text-right font-mono">
                      ${(deal.revenue / 1_000_000).toFixed(2)}M
                    </td>
                    <td className="py-3 px-4 text-right font-mono">
                      ${(deal.askingPrice / 1_000_000).toFixed(2)}M
                    </td>
                    <td className="py-3 px-4 text-right font-mono">
                      {deal.revenueMultiple.toFixed(2)}x
                    </td>
                    <td className="py-3 px-4 text-right font-mono">
                      <MultipleColor val={deal.multiple} />
                    </td>
                    <td className="py-3 px-4 text-right font-mono">
                      <MarginColor val={deal.ebitdaMargin} />
                    </td>
                    <td className="py-3 px-4 text-right font-mono">
                      {deal.recurringRevenuePct}%
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={deal.status} />
                    </td>
                    <td className="py-3 px-4 text-center">
                      <a
                        href={deal.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg hover:bg-[var(--accent)]/10 text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
                        title={`View on ${deal.source === "bizbuysell" ? "BizBuySell" : deal.source === "transworld" ? "Transworld" : deal.source === "sunbelt" ? "Sunbelt" : deal.source === "loopnet" ? "LoopNet" : "Source"}`}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </td>
                  </tr>
                  {expanded === deal.id && (
                    <tr key={`${deal.id}-detail`} className="bg-[var(--background)]">
                      <td colSpan={11} className="p-6">
                        <DealDetail deal={deal} />
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function DealDetail({ deal }: { deal: Listing }) {
  const b = deal.scoreBreakdown;
  return (
    <div className="grid grid-cols-3 gap-6">
      <div>
        <h4 className="text-xs font-semibold text-[var(--muted)] uppercase mb-2">Description</h4>
        <p className="text-sm text-[var(--foreground)]/80 leading-relaxed">{deal.description}</p>
        <div className="flex flex-wrap gap-1.5 mt-3">
          {deal.tags.map((t) => (
            <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] font-medium">
              {t}
            </span>
          ))}
        </div>
      </div>
      <div>
        <h4 className="text-xs font-semibold text-[var(--muted)] uppercase mb-2">Details</h4>
        <div className="space-y-2 text-sm">
          <Row icon={<Calendar className="w-3 h-3" />} label="Established" value={deal.yearEstablished.toString()} />
          <Row icon={<Users className="w-3 h-3" />} label="Employees" value={deal.employees.toString()} />
          <Row icon={<RefreshCw className="w-3 h-3" />} label="Cash Flow" value={`$${(deal.cashFlow / 1000).toFixed(0)}K`} />
          <Row icon={<MapPin className="w-3 h-3" />} label="State" value={deal.state} />
          <Row icon={<ExternalLink className="w-3 h-3" />} label="Found" value={deal.dateFound} />
        </div>
      </div>
      <div>
        <h4 className="text-xs font-semibold text-[var(--muted)] uppercase mb-2">Score Breakdown (max 100)</h4>
        <div className="space-y-2">
          <ScoreBar label="Revenue Fit" value={b.revenueScore} max={25} />
          <ScoreBar label="EBITDA Margin" value={b.marginScore} max={20} />
          <ScoreBar label="Multiple" value={b.multipleScore} max={20} />
          <ScoreBar label="Location" value={b.locationScore} max={15} />
          <ScoreBar label="Recurring Rev" value={b.recurringScore} max={10} />
          <ScoreBar label="Maturity" value={b.ageScore} max={10} />
        </div>
      </div>
    </div>
  );
}

function ScoreBar({ label, value, max }: { label: string; value: number; max: number }) {
  const pct = (value / max) * 100;
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-[var(--muted)]">{label}</span>
        <span className="font-mono">{value}/{max}</span>
      </div>
      <div className="h-1.5 bg-[var(--border)] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${pct}%`,
            background: pct >= 80 ? "var(--accent-green)" : pct >= 50 ? "var(--accent-amber)" : "var(--accent-red)",
          }}
        />
      </div>
    </div>
  );
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[var(--muted)] flex items-center gap-1.5">{icon} {label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 85 ? "var(--accent-green)" : score >= 70 ? "var(--accent-amber)" : "var(--accent-red)";
  return (
    <span className="inline-flex items-center justify-center w-9 h-9 rounded-full text-xs font-bold" style={{ background: `color-mix(in srgb, ${color} 15%, transparent)`, color }}>
      {score}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; color: string }> = {
    new: { label: "New", color: "var(--accent)" },
    reviewing: { label: "Reviewing", color: "var(--accent-amber)" },
    contacted: { label: "Contacted", color: "var(--accent-green)" },
    passed: { label: "Passed", color: "var(--accent-red)" },
    loi: { label: "LOI", color: "var(--accent-purple)" },
  };
  const c = map[status] || map.new;
  return (
    <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: `color-mix(in srgb, ${c.color} 15%, transparent)`, color: c.color }}>
      {c.label}
    </span>
  );
}

function SourceBadge({ source }: { source: string }) {
  const labels: Record<string, string> = { bizbuysell: "BizBuySell", transworld: "Transworld", sunbelt: "Sunbelt", loopnet: "LoopNet", direct: "Direct" };
  return <span className="text-xs text-[var(--muted)]">{labels[source] || source}</span>;
}

function MultipleColor({ val }: { val: number }) {
  const color = val <= 4.0 ? "var(--accent-green)" : val <= 4.5 ? "var(--accent-amber)" : "var(--accent-red)";
  return <span style={{ color }}>{val.toFixed(1)}x</span>;
}

function MarginColor({ val }: { val: number }) {
  const color = val >= 20 ? "var(--accent-green)" : val >= 15 ? "var(--accent-amber)" : "var(--accent-red)";
  return <span style={{ color }}>{val}%</span>;
}

function FilterSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="px-3 py-2 rounded-lg bg-[var(--card)] border border-[var(--border)] text-sm text-[var(--foreground)] focus:outline-none focus:border-[var(--accent)] cursor-pointer"
      aria-label={label}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}
