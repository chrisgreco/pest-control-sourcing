"use client";

import { useState, useMemo } from "react";
import {
  Calculator,
  TrendingUp,
  DollarSign,
  Shield,
  AlertTriangle,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";

export default function AnalyzerPage() {
  const [askingPrice, setAskingPrice] = useState(2_000_000);
  const [revenue, setRevenue] = useState(1_500_000);
  const [ebitdaMargin, setEbitdaMargin] = useState(20);
  const [recurringPct, setRecurringPct] = useState(80);
  const [sbaRate, setSbaRate] = useState(11.5);
  const [sellerNotePct, setSellerNotePct] = useState(15);
  const [sellerNoteRate, setSellerNoteRate] = useState(7);
  const [revenueGrowth, setRevenueGrowth] = useState(8);
  const [exitMultiple, setExitMultiple] = useState(7);

  const metrics = useMemo(() => {
    const ebitda = revenue * (ebitdaMargin / 100);
    const multiple = askingPrice / ebitda;

    // Financing
    const equityPct = 0.10;
    const equity = askingPrice * equityPct;
    const sellerNote = askingPrice * (sellerNotePct / 100);
    const sbaLoan = askingPrice - equity - sellerNote;

    // SBA: 10yr amortization
    const sbaMonthlyRate = sbaRate / 100 / 12;
    const sbaPayments = 120;
    const sbaMonthly = sbaLoan * (sbaMonthlyRate * Math.pow(1 + sbaMonthlyRate, sbaPayments)) / (Math.pow(1 + sbaMonthlyRate, sbaPayments) - 1);
    const sbaAnnual = sbaMonthly * 12;

    // Seller note: 5yr amortization
    const snMonthlyRate = sellerNoteRate / 100 / 12;
    const snPayments = 60;
    const snMonthly = sellerNote > 0 ? sellerNote * (snMonthlyRate * Math.pow(1 + snMonthlyRate, snPayments)) / (Math.pow(1 + snMonthlyRate, snPayments) - 1) : 0;
    const snAnnual = snMonthly * 12;

    const totalDebtService = sbaAnnual + snAnnual;
    const fcf = ebitda - totalDebtService;
    const dscr = ebitda / totalDebtService;

    // 5-year projection
    const projections = [];
    let cumCashFlow = -equity;
    for (let yr = 1; yr <= 5; yr++) {
      const projRev = revenue * Math.pow(1 + revenueGrowth / 100, yr);
      const projMargin = Math.min(ebitdaMargin + yr * 1.5, 28); // margin improvement
      const projEbitda = projRev * (projMargin / 100);
      const projDebt = yr <= 5 ? sbaAnnual + (yr <= 5 ? snAnnual : 0) : sbaAnnual;
      const projFcf = projEbitda - projDebt;
      cumCashFlow += projFcf;
      const ev = projEbitda * (yr < 5 ? 4 + yr * 0.6 : exitMultiple);
      const netDebt = sbaLoan * (1 - yr / 10) + (yr <= 5 ? sellerNote * (1 - yr / 5) : 0);
      const equityValue = ev - netDebt;

      projections.push({
        year: `Year ${yr}`,
        revenue: Math.round(projRev),
        ebitda: Math.round(projEbitda),
        margin: projMargin,
        debtService: Math.round(projDebt),
        fcf: Math.round(projFcf),
        cumCashFlow: Math.round(cumCashFlow),
        ev: Math.round(ev),
        equityValue: Math.round(equityValue),
      });
    }

    const yr5 = projections[4];
    const equityMultiple = yr5.equityValue / equity;
    const irr = Math.pow(yr5.equityValue / equity, 1 / 5) - 1;

    return {
      ebitda,
      multiple,
      equity,
      sellerNote,
      sbaLoan,
      sbaAnnual,
      snAnnual,
      totalDebtService,
      fcf,
      dscr,
      projections,
      equityMultiple,
      irr,
    };
  }, [askingPrice, revenue, ebitdaMargin, sbaRate, sellerNotePct, sellerNoteRate, revenueGrowth, exitMultiple]);

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Deal Analyzer</h1>
        <p className="text-[var(--muted)] text-sm mt-1">
          Model any pest control acquisition with SBA 7(a) financing
        </p>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Inputs Panel */}
        <div className="col-span-4 space-y-4">
          <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-5">
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-[var(--accent)]" /> Deal Inputs
            </h3>
            <div className="space-y-4">
              <SliderInput label="Asking Price" value={askingPrice} onChange={setAskingPrice} min={500_000} max={6_000_000} step={50_000} format="dollar" />
              <SliderInput label="Revenue" value={revenue} onChange={setRevenue} min={300_000} max={5_000_000} step={50_000} format="dollar" />
              <SliderInput label="EBITDA Margin %" value={ebitdaMargin} onChange={setEbitdaMargin} min={5} max={35} step={0.5} format="pct" />
              <SliderInput label="Recurring Revenue %" value={recurringPct} onChange={setRecurringPct} min={0} max={100} step={5} format="pct" />
            </div>
          </div>

          <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-5">
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-[var(--accent-green)]" /> Financing
            </h3>
            <div className="space-y-4">
              <SliderInput label="SBA Rate %" value={sbaRate} onChange={setSbaRate} min={8} max={15} step={0.25} format="pct" />
              <SliderInput label="Seller Note % of Price" value={sellerNotePct} onChange={setSellerNotePct} min={0} max={30} step={5} format="pct" />
              <SliderInput label="Seller Note Rate %" value={sellerNoteRate} onChange={setSellerNoteRate} min={4} max={12} step={0.5} format="pct" />
            </div>
          </div>

          <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-5">
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[var(--accent-amber)]" /> Growth & Exit
            </h3>
            <div className="space-y-4">
              <SliderInput label="Annual Revenue Growth %" value={revenueGrowth} onChange={setRevenueGrowth} min={0} max={25} step={1} format="pct" />
              <SliderInput label="Exit Multiple (Yr 5)" value={exitMultiple} onChange={setExitMultiple} min={4} max={10} step={0.5} format="x" />
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="col-span-8 space-y-4">
          {/* Key Metrics */}
          <div className="grid grid-cols-4 gap-3">
            <MetricCard
              label="Entry Multiple"
              value={`${metrics.multiple.toFixed(1)}x`}
              good={metrics.multiple <= 4.5}
              warn={metrics.multiple > 4.5 && metrics.multiple <= 5}
            />
            <MetricCard
              label="DSCR"
              value={metrics.dscr.toFixed(2)}
              good={metrics.dscr >= 1.25}
              warn={metrics.dscr >= 1.0 && metrics.dscr < 1.25}
              sub="Min 1.25x for SBA"
            />
            <MetricCard
              label="5-Year IRR"
              value={`${(metrics.irr * 100).toFixed(0)}%`}
              good={metrics.irr >= 0.35}
              warn={metrics.irr >= 0.2 && metrics.irr < 0.35}
            />
            <MetricCard
              label="Equity Multiple"
              value={`${metrics.equityMultiple.toFixed(1)}x`}
              good={metrics.equityMultiple >= 8}
              warn={metrics.equityMultiple >= 4 && metrics.equityMultiple < 8}
              sub={`on $${(metrics.equity / 1000).toFixed(0)}K equity`}
            />
          </div>

          {/* Deal Structure */}
          <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-5">
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <Shield className="w-4 h-4" /> Deal Structure
            </h3>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="p-3 rounded-lg bg-[var(--background)]">
                <p className="text-[var(--muted)] text-xs">SBA 7(a) Loan</p>
                <p className="font-bold text-lg">${(metrics.sbaLoan / 1000).toFixed(0)}K</p>
                <p className="text-xs text-[var(--muted)]">${(metrics.sbaAnnual / 1000).toFixed(0)}K/yr debt service</p>
              </div>
              <div className="p-3 rounded-lg bg-[var(--background)]">
                <p className="text-[var(--muted)] text-xs">Seller Note</p>
                <p className="font-bold text-lg">${(metrics.sellerNote / 1000).toFixed(0)}K</p>
                <p className="text-xs text-[var(--muted)]">${(metrics.snAnnual / 1000).toFixed(0)}K/yr debt service</p>
              </div>
              <div className="p-3 rounded-lg bg-[var(--background)]">
                <p className="text-[var(--muted)] text-xs">Equity Required (10%)</p>
                <p className="font-bold text-lg">${(metrics.equity / 1000).toFixed(0)}K</p>
                <p className="text-xs text-[var(--muted)]">SBA minimum injection</p>
              </div>
            </div>
            <div className="mt-4 p-3 rounded-lg bg-[var(--background)] flex justify-between items-center">
              <div>
                <p className="text-xs text-[var(--muted)]">Year 1 Free Cash Flow (after all debt service)</p>
                <p className={`font-bold text-lg ${metrics.fcf > 0 ? "text-[var(--accent-green)]" : "text-[var(--accent-red)]"}`}>
                  ${(metrics.fcf / 1000).toFixed(0)}K
                </p>
              </div>
              {metrics.dscr < 1.25 && (
                <div className="flex items-center gap-1 text-[var(--accent-amber)] text-xs">
                  <AlertTriangle className="w-3 h-3" />
                  DSCR below 1.25x — SBA may not approve
                </div>
              )}
            </div>
          </div>

          {/* 5-Year Projection Chart */}
          <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-5">
            <h3 className="text-sm font-semibold mb-4">5-Year Revenue & EBITDA Projection</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={metrics.projections}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="year" tick={{ fill: "var(--muted)", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "var(--muted)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1_000_000).toFixed(1)}M`} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} formatter={(value) => `$${(Number(value) / 1000).toFixed(0)}K`} />
                <Bar dataKey="revenue" name="Revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="ebitda" name="EBITDA" fill="#22c55e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Equity Value Chart */}
          <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-5">
            <h3 className="text-sm font-semibold mb-4">Equity Value Growth</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={[{ year: "Entry", equityValue: metrics.equity, ev: askingPrice }, ...metrics.projections]}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="year" tick={{ fill: "var(--muted)", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "var(--muted)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1_000_000).toFixed(1)}M`} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} formatter={(value) => `$${(Number(value) / 1000).toFixed(0)}K`} />
                <Line type="monotone" dataKey="ev" name="Enterprise Value" stroke="#a78bfa" strokeWidth={2} dot={{ fill: "#a78bfa" }} />
                <Line type="monotone" dataKey="equityValue" name="Equity Value" stroke="#22c55e" strokeWidth={2} dot={{ fill: "#22c55e" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Projection Table */}
          <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[var(--muted)] text-xs uppercase tracking-wider border-b border-[var(--border)]">
                  <th className="text-left py-3 px-4 font-medium">Year</th>
                  <th className="text-right py-3 px-4 font-medium">Revenue</th>
                  <th className="text-right py-3 px-4 font-medium">EBITDA</th>
                  <th className="text-right py-3 px-4 font-medium">Margin</th>
                  <th className="text-right py-3 px-4 font-medium">Debt Service</th>
                  <th className="text-right py-3 px-4 font-medium">FCF</th>
                  <th className="text-right py-3 px-4 font-medium">EV</th>
                  <th className="text-right py-3 px-4 font-medium">Equity Value</th>
                </tr>
              </thead>
              <tbody>
                {metrics.projections.map((p) => (
                  <tr key={p.year} className="border-b border-[var(--border)]">
                    <td className="py-2.5 px-4 font-medium">{p.year}</td>
                    <td className="py-2.5 px-4 text-right font-mono">${(p.revenue / 1_000_000).toFixed(2)}M</td>
                    <td className="py-2.5 px-4 text-right font-mono">${(p.ebitda / 1000).toFixed(0)}K</td>
                    <td className="py-2.5 px-4 text-right">{p.margin.toFixed(1)}%</td>
                    <td className="py-2.5 px-4 text-right font-mono text-[var(--accent-red)]">${(p.debtService / 1000).toFixed(0)}K</td>
                    <td className={`py-2.5 px-4 text-right font-mono ${p.fcf > 0 ? "text-[var(--accent-green)]" : "text-[var(--accent-red)]"}`}>
                      ${(p.fcf / 1000).toFixed(0)}K
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono">${(p.ev / 1_000_000).toFixed(1)}M</td>
                    <td className="py-2.5 px-4 text-right font-mono text-[var(--accent-green)]">${(p.equityValue / 1_000_000).toFixed(1)}M</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function SliderInput({
  label,
  value,
  onChange,
  min,
  max,
  step,
  format,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
  format: "dollar" | "pct" | "x";
}) {
  const display =
    format === "dollar"
      ? value >= 1_000_000
        ? `$${(value / 1_000_000).toFixed(2)}M`
        : `$${(value / 1000).toFixed(0)}K`
      : format === "pct"
      ? `${value}%`
      : `${value}x`;

  return (
    <div>
      <div className="flex justify-between text-xs mb-1.5">
        <span className="text-[var(--muted)]">{label}</span>
        <span className="font-mono font-medium">{display}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 bg-[var(--border)] rounded-full appearance-none cursor-pointer accent-[var(--accent)]"
      />
    </div>
  );
}

function MetricCard({
  label,
  value,
  good,
  warn,
  sub,
}: {
  label: string;
  value: string;
  good: boolean;
  warn: boolean;
  sub?: string;
}) {
  const color = good ? "var(--accent-green)" : warn ? "var(--accent-amber)" : "var(--accent-red)";
  return (
    <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-4">
      <p className="text-xs text-[var(--muted)] mb-1">{label}</p>
      <p className="text-xl font-bold" style={{ color }}>
        {value}
      </p>
      {sub && <p className="text-[10px] text-[var(--muted)] mt-0.5">{sub}</p>}
    </div>
  );
}
