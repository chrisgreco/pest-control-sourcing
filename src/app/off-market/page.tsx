"use client";

import { useState } from "react";
import { offMarketLeads } from "@/lib/mock-data";
import {
  Search,
  MapPin,
  Star,
  Phone,
  Clock,
  Eye,
  MessageSquare,
  Calendar,
  UserCheck,
  XCircle,
  Filter,
} from "lucide-react";

export default function OffMarketPage() {
  const [search, setSearch] = useState("");
  const [stateFilter, setStateFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"priorityScore" | "yearsInBusiness" | "reviewCount">("priorityScore");

  const filtered = offMarketLeads
    .filter((l) => {
      if (search && !l.businessName.toLowerCase().includes(search.toLowerCase()) && !l.city.toLowerCase().includes(search.toLowerCase())) return false;
      if (stateFilter !== "all" && l.state !== stateFilter) return false;
      if (sourceFilter !== "all" && l.source !== sourceFilter) return false;
      if (statusFilter !== "all" && l.outreachStatus !== statusFilter) return false;
      return true;
    })
    .sort((a, b) => b[sortBy] - a[sortBy]);

  const stats = {
    total: offMarketLeads.length,
    notContacted: offMarketLeads.filter((l) => l.outreachStatus === "not_contacted").length,
    contacted: offMarketLeads.filter((l) => l.outreachStatus === "contacted").length,
    responded: offMarketLeads.filter((l) => l.outreachStatus === "responded").length,
    meetingSet: offMarketLeads.filter((l) => l.outreachStatus === "meeting_set").length,
    avgScore: Math.round(offMarketLeads.reduce((s, l) => s + l.priorityScore, 0) / offMarketLeads.length),
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Off-Market Pipeline</h1>
        <p className="text-[var(--muted)] text-sm mt-1">
          Proprietary deal flow from Google Maps scraping, license databases, associations, and referrals
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-6 gap-3 mb-6">
        <StatCard label="Total Leads" value={stats.total} />
        <StatCard label="Not Contacted" value={stats.notContacted} color="var(--muted)" />
        <StatCard label="Contacted" value={stats.contacted} color="var(--accent-amber)" />
        <StatCard label="Responded" value={stats.responded} color="var(--accent-green)" />
        <StatCard label="Meetings Set" value={stats.meetingSet} color="var(--accent-purple)" />
        <StatCard label="Avg Score" value={stats.avgScore} color="var(--accent)" />
      </div>

      {/* Source Methodology */}
      <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-5 mb-6">
        <h3 className="text-sm font-semibold mb-3">Sourcing Methodology</h3>
        <div className="grid grid-cols-4 gap-4">
          <MethodCard
            icon={<MapPin className="w-4 h-4" />}
            title="Google Maps Scrape"
            description="Automated scraping of pest control businesses in NY/NJ/CT. Cross-referenced with website age and owner signals."
            count={offMarketLeads.filter((l) => l.source === "google_maps").length}
          />
          <MethodCard
            icon={<Eye className="w-4 h-4" />}
            title="License Database"
            description="NJ DEP, NY DEC, CT DEEP pesticide applicator license databases. Filtered for operators with 15+ years of license history."
            count={offMarketLeads.filter((l) => l.source === "license_db").length}
          />
          <MethodCard
            icon={<UserCheck className="w-4 h-4" />}
            title="Association Directories"
            description="NPMA, NJPMA, NYPMA membership directories. Long-time members often have mature, acquirable businesses."
            count={offMarketLeads.filter((l) => l.source === "association").length}
          />
          <MethodCard
            icon={<MessageSquare className="w-4 h-4" />}
            title="Referral Network"
            description="SBA lender contacts, accountants, and industry contacts who surface retirement-ready operators."
            count={offMarketLeads.filter((l) => l.source === "referral").length}
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
          <input
            type="text"
            placeholder="Search businesses or cities..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-[var(--card)] border border-[var(--border)] text-sm focus:outline-none focus:border-[var(--accent)] text-[var(--foreground)]"
          />
        </div>
        <select value={stateFilter} onChange={(e) => setStateFilter(e.target.value)} className="px-3 py-2 rounded-lg bg-[var(--card)] border border-[var(--border)] text-sm text-[var(--foreground)] focus:outline-none cursor-pointer">
          <option value="all">All States</option>
          <option value="NY">New York</option>
          <option value="NJ">New Jersey</option>
          <option value="CT">Connecticut</option>
        </select>
        <select value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)} className="px-3 py-2 rounded-lg bg-[var(--card)] border border-[var(--border)] text-sm text-[var(--foreground)] focus:outline-none cursor-pointer">
          <option value="all">All Sources</option>
          <option value="google_maps">Google Maps</option>
          <option value="license_db">License DB</option>
          <option value="association">Association</option>
          <option value="referral">Referral</option>
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 rounded-lg bg-[var(--card)] border border-[var(--border)] text-sm text-[var(--foreground)] focus:outline-none cursor-pointer">
          <option value="all">All Statuses</option>
          <option value="not_contacted">Not Contacted</option>
          <option value="contacted">Contacted</option>
          <option value="responded">Responded</option>
          <option value="meeting_set">Meeting Set</option>
          <option value="not_interested">Not Interested</option>
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value as typeof sortBy)} className="px-3 py-2 rounded-lg bg-[var(--card)] border border-[var(--border)] text-sm text-[var(--foreground)] focus:outline-none cursor-pointer">
          <option value="priorityScore">Sort: Priority Score</option>
          <option value="yearsInBusiness">Sort: Years in Business</option>
          <option value="reviewCount">Sort: Review Count</option>
        </select>
        <span className="text-xs text-[var(--muted)]"><Filter className="w-3 h-3 inline mr-1" />{filtered.length} leads</span>
      </div>

      {/* Lead Cards */}
      <div className="grid grid-cols-2 gap-4">
        {filtered.map((lead) => (
          <div
            key={lead.id}
            className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-5 hover:border-[var(--accent)]/30 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-sm">{lead.businessName}</h3>
                <p className="text-xs text-[var(--muted)] flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3" /> {lead.city}, {lead.state}
                </p>
              </div>
              <div className="text-right">
                <span
                  className="inline-flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold"
                  style={{
                    background: lead.priorityScore >= 90
                      ? "color-mix(in srgb, var(--accent-green) 15%, transparent)"
                      : lead.priorityScore >= 75
                      ? "color-mix(in srgb, var(--accent-amber) 15%, transparent)"
                      : "color-mix(in srgb, var(--muted) 15%, transparent)",
                    color: lead.priorityScore >= 90
                      ? "var(--accent-green)"
                      : lead.priorityScore >= 75
                      ? "var(--accent-amber)"
                      : "var(--muted)",
                  }}
                >
                  {lead.priorityScore}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs mb-3">
              <InfoRow icon={<Star className="w-3 h-3 text-[var(--accent-amber)]" />} label={`${lead.rating} (${lead.reviewCount} reviews)`} />
              <InfoRow icon={<Clock className="w-3 h-3" />} label={`${lead.yearsInBusiness} years in business`} />
              <InfoRow icon={<Phone className="w-3 h-3" />} label={lead.phone} />
              <InfoRow icon={<Calendar className="w-3 h-3" />} label={`Owner: ${lead.ownerAge}`} />
            </div>

            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-medium text-[var(--accent)]">{lead.estimatedRevenue}</span>
              <span className="text-[10px] text-[var(--muted)]">est. revenue</span>
            </div>

            <p className="text-xs text-[var(--muted)] leading-relaxed mb-3">{lead.notes}</p>

            <div className="flex items-center justify-between">
              <OutreachBadge status={lead.outreachStatus} />
              <span className="text-[10px] text-[var(--muted)]">
                Source: {lead.source.replace(/_/g, " ")} | Updated {lead.lastUpdated}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color?: string }) {
  return (
    <div className="bg-[var(--card)] rounded-lg border border-[var(--border)] p-3 text-center">
      <p className="text-xl font-bold" style={{ color: color || "var(--foreground)" }}>{value}</p>
      <p className="text-[10px] text-[var(--muted)] mt-0.5">{label}</p>
    </div>
  );
}

function MethodCard({ icon, title, description, count }: { icon: React.ReactNode; title: string; description: string; count: number }) {
  return (
    <div className="p-3 rounded-lg bg-[var(--background)] border border-[var(--border)]">
      <div className="flex items-center gap-2 mb-2">
        <div className="text-[var(--accent)]">{icon}</div>
        <span className="text-xs font-semibold">{title}</span>
        <span className="ml-auto text-[10px] text-[var(--muted)]">{count} leads</span>
      </div>
      <p className="text-[11px] text-[var(--muted)] leading-relaxed">{description}</p>
    </div>
  );
}

function InfoRow({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-1.5 text-[var(--muted)]">
      {icon}
      <span>{label}</span>
    </div>
  );
}

function OutreachBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
    not_contacted: { label: "Not Contacted", color: "var(--muted)", icon: <Clock className="w-3 h-3" /> },
    contacted: { label: "Contacted", color: "var(--accent-amber)", icon: <MessageSquare className="w-3 h-3" /> },
    responded: { label: "Responded", color: "var(--accent-green)", icon: <UserCheck className="w-3 h-3" /> },
    meeting_set: { label: "Meeting Set", color: "var(--accent-purple)", icon: <Calendar className="w-3 h-3" /> },
    not_interested: { label: "Not Interested", color: "var(--accent-red)", icon: <XCircle className="w-3 h-3" /> },
  };
  const c = map[status] || map.not_contacted;
  return (
    <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: `color-mix(in srgb, ${c.color} 15%, transparent)`, color: c.color }}>
      {c.icon}
      {c.label}
    </span>
  );
}
