"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Search,
  Calculator,
  Eye,
  BarChart3,
  Bug,
} from "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/listings", label: "Market Listings", icon: Search },
  { href: "/analyzer", label: "Deal Analyzer", icon: Calculator },
  { href: "/off-market", label: "Off-Market Pipeline", icon: Eye },
  { href: "/intelligence", label: "Market Intel", icon: BarChart3 },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-[var(--card)] border-r border-[var(--border)] flex flex-col z-50">
      <div className="p-6 border-b border-[var(--border)]">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[var(--accent)] flex items-center justify-center">
            <Bug className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight">PestAcquire</h1>
            <p className="text-[11px] text-[var(--muted)]">
              NYC Metro Deal Sourcing
            </p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-[var(--accent)]/10 text-[var(--accent)]"
                  : "text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--card-hover)]"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[var(--border)]">
        <div className="px-3 py-2 rounded-lg bg-[var(--accent)]/5 border border-[var(--accent)]/20">
          <p className="text-xs font-semibold text-[var(--accent)]">
            Target Criteria
          </p>
          <p className="text-[11px] text-[var(--muted)] mt-1">
            Rev: $1M-$3M | EBITDA: 15-22%
          </p>
          <p className="text-[11px] text-[var(--muted)]">
            Multiple: 3.0-4.5x | NYC Metro
          </p>
        </div>
      </div>
    </aside>
  );
}
