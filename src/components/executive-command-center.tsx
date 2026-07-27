"use client";

import { useMemo, useState } from "react";

type ViewId = "overview" | "revenue" | "demand" | "health" | "trainers" | "alerts";
type RangeId = "t12" | "qtd" | "mtd";
type Delta = "up" | "down" | "flat";
type AlertClass = "critical" | "watch" | "opportunity";

type Kpi = {
  eyebrow: string;
  value: string;
  delta: Delta;
  dtext: string;
  caption: string;
};

type AlertItem = {
  id: string;
  cls: AlertClass;
  title: string;
  desc: string;
  meta: string;
  primary: string;
  ghost: string;
};

const COLORS = {
  navy: "#002348",
  deepNavy: "#1A385E",
  steel: "#084B72",
  white: "#FFFFFF",
  sand: "#FFFDF6",
  cream: "#FFF8F0",
  mist: "#E8F4F4",
  neon: "#C8DF00",
  tealDeep: "#005849",
  teal: "#00A48C",
  solar: "#FFC622",
  magentaDeep: "#731A42",
  magenta: "#C90C61",
};

const titles: Record<ViewId, { eyebrow: string; title: string }> = {
  overview: { eyebrow: "Training-as-a-Service", title: "Portfolio Overview" },
  revenue: { eyebrow: "Billing & Reconciliation Agent", title: "Revenue & Profitability" },
  demand: { eyebrow: "CRM Demand & Profitability Agent", title: "Demand & Pipeline" },
  health: { eyebrow: "Certification Content Monitoring Agent", title: "Content Governance" },
  trainers: { eyebrow: "Trainer Matching & Calendar Agent", title: "Trainer Capacity" },
  alerts: { eyebrow: "Analytics & Orchestration Layer", title: "Alerts & Decisions" },
};

const navItems: { id: ViewId; label: string }[] = [
  { id: "overview", label: "Portfolio Overview" },
  { id: "revenue", label: "Revenue & Profitability" },
  { id: "demand", label: "Demand & Pipeline" },
  { id: "health", label: "Content Governance" },
  { id: "trainers", label: "Trainer Capacity" },
  { id: "alerts", label: "Alerts & Decisions" },
];

const signals: Record<ViewId, { cls: AlertClass; text: string; strong: string }> = {
  overview: { cls: "critical", strong: "SAFe 6.0 SPC content is 38% stale", text: "and a major revision is awaiting your sign-off before republish." },
  revenue: { cls: "critical", strong: "Global Bank Corp", text: "is 52 days overdue on $186,400 and has disputed the amount. Finance needs a decision." },
  demand: { cls: "opportunity", strong: "GitLab DevOps demand is up 38%", text: "quarter over quarter. Current cohort capacity may not cover it." },
  health: { cls: "watch", strong: "1 course revision", text: "is waiting on your approval before the Repository Sync Agent can republish." },
  trainers: { cls: "watch", strong: "SAFe-certified trainers are running at 92% utilization", text: "with limited backup coverage if someone is unavailable." },
  alerts: { cls: "critical", strong: "3 items", text: "are waiting on an executive decision. Highest severity: content and billing disputes." },
};

const kpiData: Record<RangeId, Record<Exclude<ViewId, "alerts">, Kpi[]>> = {
  t12: {
    overview: [
      { eyebrow: "Active courses", value: "47", delta: "up", dtext: "+4 vs. last period", caption: "Across 6 certification tracks and 4 delivery models" },
      { eyebrow: "Revenue collected", value: "$4.82M", delta: "up", dtext: "94% of billed", caption: "Trailing 12 months, reconciled against Finance" },
      { eyebrow: "Portfolio margin", value: "34%", delta: "up", dtext: "+4 pts vs. target", caption: "Blended across all active offerings" },
      { eyebrow: "Time saved per launch", value: "63%", delta: "up", dtext: "vs. manual baseline", caption: "From objective to publish-ready, average" },
    ],
    revenue: [
      { eyebrow: "Collected", value: "$4.82M", delta: "up", dtext: "94% of billed", caption: "Reconciled through the Billing & Reconciliation Agent" },
      { eyebrow: "Billed", value: "$5.10M", delta: "flat", dtext: "vs. $5.35M projected", caption: "Invoices issued across all delivered sessions" },
      { eyebrow: "Outstanding", value: "$280K", delta: "down", dtext: "-8% vs. last period", caption: "Across 24 open invoices" },
      { eyebrow: "Disputed / mismatch", value: "$257K", delta: "down", dtext: "4 accounts flagged", caption: "Needs Finance + Learning team follow-up" },
    ],
    demand: [
      { eyebrow: "Open pipeline", value: "$1.02M", delta: "up", dtext: "+11% vs. last period", caption: "Across all certification tracks" },
      { eyebrow: "Registrations", value: "3,140", delta: "up", dtext: "+17% YoY", caption: "Self-paced + instructor-led combined" },
      { eyebrow: "Avg. time to launch", value: "9.5 days", delta: "up", dtext: "from 26 days", caption: "From approved objective to publish" },
      { eyebrow: "Registration to launch", value: "71%", delta: "up", dtext: "+6 pts", caption: "Conversion rate, trailing 12 months" },
    ],
    health: [
      { eyebrow: "Avg. freshness score", value: "82", delta: "flat", dtext: "out of 100", caption: "Weighted across all active courses" },
      { eyebrow: "Current", value: "34", delta: "up", dtext: "courses", caption: "No action needed" },
      { eyebrow: "Under review", value: "8", delta: "flat", dtext: "courses", caption: "Change detected, pending validation" },
      { eyebrow: "Revision needed", value: "5", delta: "down", dtext: "courses", caption: "Source content has materially changed" },
    ],
    trainers: [
      { eyebrow: "Active trainers", value: "86", delta: "up", dtext: "+5 this period", caption: "Across all specializations and regions" },
      { eyebrow: "Avg. utilization", value: "74%", delta: "flat", dtext: "within target band", caption: "Target band: 60-85%" },
      { eyebrow: "Backup coverage", value: "61%", delta: "down", dtext: "-7 pts", caption: "Sessions with a qualified backup on file" },
      { eyebrow: "At-risk specializations", value: "2", delta: "down", dtext: "over 85% utilization", caption: "SAFe and GitLab DevOps" },
    ],
  },
  qtd: {
    overview: [
      { eyebrow: "Active courses", value: "47", delta: "flat", dtext: "no change", caption: "Across 6 certification tracks and 4 delivery models" },
      { eyebrow: "Revenue collected", value: "$1.31M", delta: "up", dtext: "91% of billed", caption: "Quarter to date, reconciled against Finance" },
      { eyebrow: "Portfolio margin", value: "32%", delta: "flat", dtext: "+2 pts vs. target", caption: "Blended across all active offerings" },
      { eyebrow: "Time saved per launch", value: "61%", delta: "up", dtext: "vs. manual baseline", caption: "From objective to publish-ready, average" },
    ],
    revenue: [
      { eyebrow: "Collected", value: "$1.31M", delta: "up", dtext: "91% of billed", caption: "Reconciled through the Billing & Reconciliation Agent" },
      { eyebrow: "Billed", value: "$1.44M", delta: "flat", dtext: "vs. $1.52M projected", caption: "Invoices issued across all delivered sessions" },
      { eyebrow: "Outstanding", value: "$130K", delta: "down", dtext: "-5% vs. last period", caption: "Across 11 open invoices" },
      { eyebrow: "Disputed / mismatch", value: "$205K", delta: "flat", dtext: "2 accounts flagged", caption: "Needs Finance + Learning team follow-up" },
    ],
    demand: [
      { eyebrow: "Open pipeline", value: "$412K", delta: "up", dtext: "+9% vs. last period", caption: "Across all certification tracks" },
      { eyebrow: "Registrations", value: "820", delta: "up", dtext: "+14% QoQ", caption: "Self-paced + instructor-led combined" },
      { eyebrow: "Avg. time to launch", value: "8.9 days", delta: "up", dtext: "from 11 days", caption: "From approved objective to publish" },
      { eyebrow: "Registration to launch", value: "73%", delta: "up", dtext: "+2 pts", caption: "Conversion rate, this quarter" },
    ],
    health: [
      { eyebrow: "Avg. freshness score", value: "80", delta: "down", dtext: "out of 100", caption: "Weighted across all active courses" },
      { eyebrow: "Current", value: "34", delta: "flat", dtext: "courses", caption: "No action needed" },
      { eyebrow: "Under review", value: "8", delta: "flat", dtext: "courses", caption: "Change detected, pending validation" },
      { eyebrow: "Revision needed", value: "5", delta: "flat", dtext: "courses", caption: "Source content has materially changed" },
    ],
    trainers: [
      { eyebrow: "Active trainers", value: "86", delta: "flat", dtext: "no change", caption: "Across all specializations and regions" },
      { eyebrow: "Avg. utilization", value: "77%", delta: "up", dtext: "within target band", caption: "Target band: 60-85%" },
      { eyebrow: "Backup coverage", value: "58%", delta: "down", dtext: "-3 pts", caption: "Sessions with a qualified backup on file" },
      { eyebrow: "At-risk specializations", value: "2", delta: "flat", dtext: "over 85% utilization", caption: "SAFe and GitLab DevOps" },
    ],
  },
  mtd: {
    overview: [
      { eyebrow: "Active courses", value: "47", delta: "flat", dtext: "no change", caption: "Across 6 certification tracks and 4 delivery models" },
      { eyebrow: "Revenue collected", value: "$402K", delta: "up", dtext: "89% of billed", caption: "Month to date, reconciled against Finance" },
      { eyebrow: "Portfolio margin", value: "31%", delta: "down", dtext: "-1 pt vs. target", caption: "Blended across all active offerings" },
      { eyebrow: "Time saved per launch", value: "60%", delta: "flat", dtext: "vs. manual baseline", caption: "From objective to publish-ready, average" },
    ],
    revenue: [
      { eyebrow: "Collected", value: "$402K", delta: "up", dtext: "89% of billed", caption: "Reconciled through the Billing & Reconciliation Agent" },
      { eyebrow: "Billed", value: "$452K", delta: "flat", dtext: "vs. $478K projected", caption: "Invoices issued across all delivered sessions" },
      { eyebrow: "Outstanding", value: "$50K", delta: "flat", dtext: "vs. last period", caption: "Across 6 open invoices" },
      { eyebrow: "Disputed / mismatch", value: "$186K", delta: "flat", dtext: "1 account flagged", caption: "Needs Finance + Learning team follow-up" },
    ],
    demand: [
      { eyebrow: "Open pipeline", value: "$154K", delta: "up", dtext: "+6% vs. last period", caption: "Across all certification tracks" },
      { eyebrow: "Registrations", value: "268", delta: "up", dtext: "+9% MoM", caption: "Self-paced + instructor-led combined" },
      { eyebrow: "Avg. time to launch", value: "8.6 days", delta: "up", dtext: "from 9.5 days", caption: "From approved objective to publish" },
      { eyebrow: "Registration to launch", value: "74%", delta: "flat", dtext: "this month", caption: "Conversion rate, this month" },
    ],
    health: [
      { eyebrow: "Avg. freshness score", value: "79", delta: "down", dtext: "out of 100", caption: "Weighted across all active courses" },
      { eyebrow: "Current", value: "33", delta: "down", dtext: "courses", caption: "No action needed" },
      { eyebrow: "Under review", value: "9", delta: "up", dtext: "courses", caption: "Change detected, pending validation" },
      { eyebrow: "Revision needed", value: "5", delta: "flat", dtext: "courses", caption: "Source content has materially changed" },
    ],
    trainers: [
      { eyebrow: "Active trainers", value: "86", delta: "flat", dtext: "no change", caption: "Across all specializations and regions" },
      { eyebrow: "Avg. utilization", value: "79%", delta: "up", dtext: "within target band", caption: "Target band: 60-85%" },
      { eyebrow: "Backup coverage", value: "56%", delta: "down", dtext: "-2 pts", caption: "Sessions with a qualified backup on file" },
      { eyebrow: "At-risk specializations", value: "3", delta: "up", dtext: "over 85% utilization", caption: "SAFe, GitLab DevOps, and PMI ACP" },
    ],
  },
};

const months = ["Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];
const collectedM = [312, 338, 355, 401, 298, 362, 410, 388, 432, 455, 441, 470];
const billedM = [330, 352, 368, 415, 320, 378, 428, 405, 450, 470, 458, 485];
const projectedM = [345, 360, 375, 420, 335, 390, 435, 412, 458, 478, 465, 492];

const overviewAlerts = [
  { course: "SAFe 6.0 SPC - content revision", issue: "22% content diff detected, needs sign-off", sev: "High", tone: "revision", owner: "Content Monitoring" },
  { course: "Global Bank Corp - invoice #4471", issue: "52 days overdue, amount disputed", sev: "High", tone: "revision", owner: "Billing & Reconciliation" },
  { course: "Scrum Master Cert bundle", issue: "Margin dropped to 27%, below 30% threshold", sev: "Medium", tone: "review", owner: "CRM Demand & Profitability" },
];

const alertsData: AlertItem[] = [
  {
    id: "a1",
    cls: "critical",
    title: "SAFe 6.0 SPC - major content revision awaiting sign-off",
    desc: "The Certification Content Monitoring Agent detected a 22% content difference against the approved Scaled Agile source. This exceeds the auto-approval threshold and needs your sign-off before the Repository Sync Agent republishes.",
    meta: "Owner: Content Monitoring Agent - Detected 3 days ago",
    primary: "Approve republish",
    ghost: "View content diff",
  },
  {
    id: "a2",
    cls: "critical",
    title: "Global Bank Corp - disputed invoice, 52 days overdue",
    desc: "Invoice #4471 for $186,400 is under dispute over an amount mismatch between delivered sessions and billed line items. Finance is waiting on a decision on how to proceed.",
    meta: "Owner: Billing & Reconciliation Agent - Flagged 6 days ago",
    primary: "Approve write-off review",
    ghost: "Open reconciliation",
  },
  {
    id: "a3",
    cls: "watch",
    title: "Scrum Master Cert bundle - margin below threshold",
    desc: "Blended margin on this bundle has dropped to 27%, below the 30% profitability threshold. The CRM Demand & Profitability Agent recommends re-pricing or pausing new private-cohort bookings.",
    meta: "Owner: CRM Demand & Profitability Agent - Flagged 9 days ago",
    primary: "Approve re-pricing",
    ghost: "View margin detail",
  },
  {
    id: "a4",
    cls: "opportunity",
    title: "GitLab DevOps - demand up 38% quarter over quarter",
    desc: "Registration demand for GitLab DevOps Fundamentals is outpacing current instructor-led cohort capacity. Trainer Matching recommends opening one additional cohort next month.",
    meta: "Owner: Trainer Matching & Calendar Agent - Surfaced 2 days ago",
    primary: "Approve new cohort",
    ghost: "View trainer options",
  },
];

const pipelineRows = [
  ["SAFe 6.0 (SPC / POPM)", "$412,000", "+12%", "Blended", "Ready"],
  ["GitLab DevOps Fundamentals", "$268,500", "+38%", "Instructor-led", "Capacity watch"],
  ["Scrum Master Cert bundle", "$184,000", "-4%", "Private cohort", "Margin review"],
  ["PMI ACP Prep", "$96,500", "+8%", "Self-paced", "Ready"],
];

const contentRows = [
  ["SAFe 6.0 SPC", "62", "Revision needed", "38%", "Major source diff"],
  ["GitLab CI/CD Essentials", "91", "Current", "9%", "Minor module update"],
  ["ICAgile Foundations", "98", "Current", "2%", "No action"],
  ["Scrum Master Cert bundle", "76", "Under review", "18%", "Assessment wording changed"],
  ["PMI ACP Prep", "83", "Under review", "14%", "Exam guide refresh"],
];

const trainerSpecs = [
  { name: "SAFe (SPC / RTE)", pct: 92, color: COLORS.magenta },
  { name: "Scrum & Agile", pct: 71, color: COLORS.teal },
  { name: "GitLab DevOps", pct: 88, color: COLORS.solar },
  { name: "Enterprise PM", pct: 66, color: COLORS.teal },
  { name: "Leadership & EQ", pct: 49, color: COLORS.solar },
];

function statusTone(label: string) {
  const lower = label.toLowerCase();
  if (lower.includes("ready") || lower.includes("current") || lower.includes("approved")) return "current";
  if (lower.includes("review") || lower.includes("watch")) return "review";
  return "revision";
}

function niceMax(value: number) {
  return Math.ceil(value / 100) * 100;
}

function KpiGrid({ items }: { items: Kpi[] }) {
  return <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
    {items.map((kpi) => <div key={kpi.eyebrow} className="rounded-md border border-[#0023481f] bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#00234812]">
      <span className="text-[11px] font-semibold uppercase tracking-[.16em] text-[#084B72]">{kpi.eyebrow}</span>
      <div className="mt-2 flex flex-wrap items-baseline gap-2">
        <div className="font-serif text-[32px] font-bold leading-none text-[#002348]">{kpi.value}</div>
        <span className={`rounded-full px-2 py-1 text-xs font-bold ${kpi.delta === "up" ? "bg-[#00a48c21] text-[#005849]" : kpi.delta === "down" ? "bg-[#c90c611c] text-[#731A42]" : "bg-[#ffc6222e] text-[#7b5a00]"}`}>{kpi.dtext}</span>
      </div>
      <p className="mt-2 text-xs leading-5 text-[#084B72]">{kpi.caption}</p>
    </div>)}
  </div>;
}

function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`rounded-md border border-[#0023481f] bg-white p-5 ${className}`}>{children}</section>;
}

function SectionTitle({ title, sub }: { title: string; sub: string }) {
  return <div className="mt-8">
    <h2 className="font-serif text-xl font-bold text-[#002348]">{title}</h2>
    <p className="mt-1 text-sm text-[#084B72]">{sub}</p>
  </div>;
}

function Pill({ tone, children }: { tone: string; children: React.ReactNode }) {
  const classes = {
    current: "bg-[#00a48c21] text-[#005849]",
    review: "bg-[#ffc62233] text-[#7b5a00]",
    revision: "bg-[#c90c611c] text-[#731A42]",
  }[tone] ?? "bg-[#e8f4f4] text-[#084B72]";
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${classes}`}>{children}</span>;
}

function GroupedBarChart({
  labels,
  series,
  format = (value: number) => String(value),
}: {
  labels: string[];
  series: { label: string; color: string; data: number[] }[];
  format?: (value: number) => string;
}) {
  const width = 720;
  const height = 290;
  const pad = { left: 48, right: 16, top: 20, bottom: 42 };
  const chartW = width - pad.left - pad.right;
  const chartH = height - pad.top - pad.bottom;
  const max = niceMax(Math.max(...series.flatMap((item) => item.data)) * 1.15);
  const groupW = chartW / labels.length;
  const barW = Math.max(5, (groupW - 10) / series.length);

  return <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full">
    {[0, 0.25, 0.5, 0.75, 1].map((tick) => {
      const y = pad.top + chartH * (1 - tick);
      return <g key={tick}>
        <line x1={pad.left} x2={width - pad.right} y1={y} y2={y} stroke="#E8F4F4" />
        <text x={pad.left - 8} y={y + 4} textAnchor="end" fontSize="10" fill="#084B72">{format(max * tick)}</text>
      </g>;
    })}
    {labels.map((label, labelIndex) => <g key={label}>
      <text x={pad.left + labelIndex * groupW + groupW / 2} y={height - 16} textAnchor="middle" fontSize="10" fill="#084B72">{label}</text>
      {series.map((item, seriesIndex) => {
        const barH = chartH * (item.data[labelIndex] / max);
        const x = pad.left + labelIndex * groupW + 5 + seriesIndex * barW;
        const y = pad.top + chartH - barH;
        return <rect key={item.label} x={x} y={y} width={barW - 2} height={barH} rx="3" fill={item.color}>
          <title>{`${item.label}: ${format(item.data[labelIndex])}`}</title>
        </rect>;
      })}
    </g>)}
    <line x1={pad.left} x2={width - pad.right} y1={pad.top + chartH} y2={pad.top + chartH} stroke="#002348" opacity=".2" />
  </svg>;
}

function LineAreaChart({ labels, values, color }: { labels: string[]; values: number[]; color: string }) {
  const width = 720;
  const height = 270;
  const pad = { left: 44, right: 18, top: 18, bottom: 38 };
  const chartW = width - pad.left - pad.right;
  const chartH = height - pad.top - pad.bottom;
  const max = niceMax(Math.max(...values) * 1.15);
  const points = values.map((value, index) => {
    const x = pad.left + (chartW / (values.length - 1)) * index;
    const y = pad.top + chartH - chartH * (value / max);
    return [x, y] as const;
  });
  const line = points.map(([x, y]) => `${x},${y}`).join(" ");
  const area = `${pad.left},${pad.top + chartH} ${line} ${pad.left + chartW},${pad.top + chartH}`;

  return <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full">
    {[0, 0.25, 0.5, 0.75, 1].map((tick) => {
      const y = pad.top + chartH * (1 - tick);
      return <line key={tick} x1={pad.left} x2={width - pad.right} y1={y} y2={y} stroke="#E8F4F4" />;
    })}
    <polygon points={area} fill={color} opacity=".12" />
    <polyline points={line} fill="none" stroke={color} strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" />
    {points.map(([x, y], index) => <circle key={labels[index]} cx={x} cy={y} r="4" fill="#FFFFFF" stroke={color} strokeWidth="3" />)}
    {labels.map((label, index) => <text key={label} x={pad.left + (chartW / (labels.length - 1)) * index} y={height - 14} textAnchor="middle" fontSize="10" fill="#084B72">{label}</text>)}
  </svg>;
}

function HBarChart({ categories, values, colors, format }: { categories: string[]; values: number[]; colors: string[]; format: (value: number) => string }) {
  const width = 620;
  const height = 250;
  const padL = 92;
  const rowH = 44;
  const max = niceMax(Math.max(...values) * 1.2);
  return <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full">
    {categories.map((cat, index) => {
      const y = 24 + index * rowH;
      const barW = (width - padL - 70) * (values[index] / max);
      return <g key={cat}>
        <text x={padL - 10} y={y + 22} textAnchor="end" fontSize="11" fill="#002348">{cat}</text>
        <rect x={padL} y={y + 8} width={barW} height="22" rx="4" fill={colors[index]} />
        <text x={padL + barW + 8} y={y + 23} fontSize="11" fill="#084B72">{format(values[index])}</text>
      </g>;
    })}
  </svg>;
}

function DonutChart({ labels, values, colors }: { labels: string[]; values: number[]; colors: string[] }) {
  const total = values.reduce((sum, value) => sum + value, 0);
  const segments = values.map((value, index) => {
    const previous = values.slice(0, index).reduce((sum, current) => sum + current, 0);
    const dash = (value / total) * 452.4;
    const offset = 25 + (previous / total) * 452.4;
    return { dash, offset };
  });
  return <div className="grid gap-4 sm:grid-cols-[210px_1fr] sm:items-center">
    <svg viewBox="0 0 220 220" className="mx-auto size-52">
      <circle cx="110" cy="110" r="72" fill="none" stroke="#E8F4F4" strokeWidth="34" />
      {segments.map((segment, index) => <circle key={labels[index]} cx="110" cy="110" r="72" fill="none" stroke={colors[index]} strokeWidth="34" strokeDasharray={`${segment.dash} ${452.4 - segment.dash}`} strokeDashoffset={-segment.offset} transform="rotate(-90 110 110)" />)}
      <text x="110" y="106" textAnchor="middle" className="fill-[#002348] font-serif text-3xl font-bold">47</text>
      <text x="110" y="130" textAnchor="middle" className="fill-[#084B72] text-xs">courses</text>
    </svg>
    <div className="space-y-2">
      {labels.map((label, index) => <div key={label} className="flex items-center justify-between gap-3 text-sm text-[#084B72]">
        <span className="flex items-center gap-2"><span className="size-3 rounded-sm" style={{ background: colors[index] }} />{label}</span>
        <b className="text-[#002348]">{values[index]}%</b>
      </div>)}
    </div>
  </div>;
}

function ChartLegend({ series }: { series: { label: string; color: string }[] }) {
  return <div className="mt-3 flex flex-wrap gap-4">
    {series.map((item) => <span key={item.label} className="flex items-center gap-2 text-xs font-semibold text-[#084B72]"><span className="size-3 rounded-sm" style={{ background: item.color }} />{item.label}</span>)}
  </div>;
}

function ExecutiveTable({ children }: { children: React.ReactNode }) {
  return <div className="overflow-x-auto">
    <table className="w-full min-w-[720px] text-left text-sm">
      {children}
    </table>
  </div>;
}

function TableHead({ labels }: { labels: string[] }) {
  return <thead><tr className="border-b border-[#0023481f] text-[11px] uppercase tracking-[.14em] text-[#084B72]">
    {labels.map((label) => <th key={label} className="pb-3 pr-4 font-bold">{label}</th>)}
  </tr></thead>;
}

export function ExecutiveCommandCenter({ connected }: { connected: boolean }) {
  const [view, setView] = useState<ViewId>("overview");
  const [range, setRange] = useState<RangeId>("t12");
  const [revenueMode, setRevenueMode] = useState<"all" | "collected" | "billed">("all");
  const [resolved, setResolved] = useState<string[]>([]);
  const [toast, setToast] = useState("");
  const activeTitle = titles[view];
  const activeSignal = signals[view];
  const openAlerts = alertsData.length - resolved.length;

  const revenueSeries = useMemo(() => {
    const allSeries = [
      { label: "Collected", color: COLORS.teal, data: [1080, 1190, 1240, 1310] },
      { label: "Billed", color: COLORS.navy, data: [1150, 1260, 1330, 1440] },
      { label: "Projected", color: COLORS.solar, data: [1190, 1290, 1360, 1470] },
    ];
    if (revenueMode === "collected") return [allSeries[0]];
    if (revenueMode === "billed") return [allSeries[1]];
    return allSeries;
  }, [revenueMode]);

  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  }

  function approveAlert(id: string) {
    if (resolved.includes(id)) return;
    setResolved((current) => [...current, id]);
    showToast("Decision recorded and routed back to the owning agent");
  }

  return <div className="overflow-hidden rounded-lg border border-[#0023481f] bg-[#FFFDF6] text-[#002348] shadow-sm">
    <div className="flex min-h-[780px] flex-col lg:flex-row" style={{ fontFamily: "Barlow, Arial, sans-serif" }}>
      <aside className="shrink-0 bg-[#002348] text-[#E8F4F4] lg:w-[248px]">
        <div className="border-b border-white/10 px-6 pb-6 pt-7">
          <div className="flex items-center gap-2">
            <span className="size-3 rotate-45 bg-[#C8DF00]" />
            <span className="font-serif text-xl font-bold text-white">TaaS</span>
          </div>
          <p className="ml-5 mt-1 text-[11px] font-semibold uppercase tracking-[.18em] text-white/55">Executive Command Center</p>
        </div>
        <nav className="flex gap-2 overflow-x-auto p-3 lg:block lg:space-y-1">
          {navItems.map((item) => {
            const selected = item.id === view;
            return <button key={item.id} type="button" onClick={() => setView(item.id)} className={`flex min-w-fit items-center justify-between gap-3 rounded-md border-l-4 px-3 py-3 text-left text-sm font-semibold transition lg:w-full ${selected ? "border-[#C8DF00] bg-white/10 text-white" : "border-transparent text-white/70 hover:bg-white/5 hover:text-white"}`}>
              <span className="flex items-center gap-3"><span className={`size-1.5 rounded-full ${selected ? "bg-[#C8DF00]" : "bg-white/35"}`} />{item.label}</span>
              {item.id === "alerts" && openAlerts > 0 && <span className="rounded-full bg-[#C90C61] px-2 py-0.5 text-xs text-white">{openAlerts}</span>}
            </button>;
          })}
        </nav>
        <div className="border-t border-white/10 px-6 py-5 text-[11px] leading-5 text-white/45">
          Fed by the Analytics & Orchestration Layer<br />Data refreshed hourly across all agents
        </div>
      </aside>

      <main className="min-w-0 flex-1">
        <header className="flex flex-col gap-4 border-b border-[#0023481f] bg-[#FFFDF6] px-5 py-6 md:flex-row md:items-end md:justify-between lg:px-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-[.2em] text-[#084B72]">{activeTitle.eyebrow}</span>
            <h1 className="mt-1 font-serif text-3xl font-bold text-[#002348]">{activeTitle.title}</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-[#0023481f] bg-[#E8F4F4] px-3 py-2 text-xs font-bold">Prototype - {connected ? "live shell" : "sample data"}</span>
            <span className="rounded-full border border-[#0023481f] bg-[#E8F4F4] px-3 py-2 text-xs font-bold">Executive view</span>
            <select value={range} onChange={(event) => { setRange(event.target.value as RangeId); showToast(`View updated to ${event.target.selectedOptions[0].textContent?.toLowerCase()}`); }} className="rounded-md border border-[#0023481f] bg-white px-3 py-2 text-sm font-semibold text-[#002348]">
              <option value="t12">Trailing 12 months</option>
              <option value="qtd">Quarter to date</option>
              <option value="mtd">Month to date</option>
            </select>
          </div>
        </header>

        <div className={`mx-5 mt-5 flex items-center gap-3 rounded border border-[#0023481f] bg-[#FFF8F0] p-4 lg:mx-10 ${activeSignal.cls === "critical" ? "border-l-4 border-l-[#C90C61]" : activeSignal.cls === "watch" ? "border-l-4 border-l-[#FFC622]" : "border-l-4 border-l-[#00A48C]"}`}>
          <span className={`block size-0 border-x-[7px] border-b-[12px] border-x-transparent ${activeSignal.cls === "critical" ? "border-b-[#C90C61]" : activeSignal.cls === "watch" ? "border-b-[#FFC622]" : "border-b-[#00A48C]"}`} />
          <p className="min-w-0 flex-1 text-sm leading-6 text-[#1A385E]"><strong className="text-[#002348]">{activeSignal.strong}</strong> {activeSignal.text}</p>
          <button type="button" onClick={() => setView("alerts")} className="hidden shrink-0 text-sm font-bold text-[#084B72] hover:underline sm:block">View detail</button>
        </div>

        <div className="px-5 py-6 lg:px-10 lg:pb-12">
          {view === "overview" && <>
            <KpiGrid items={kpiData[range].overview} />
            <SectionTitle title="Portfolio at a glance" sub="Across all active certification tracks and delivery models, trailing 12 months." />
            <div className="mt-4 grid gap-4 xl:grid-cols-[1.3fr_1fr]">
              <Panel>
                <h3 className="font-bold text-[#002348]">Revenue: collected vs. billed vs. projected</h3>
                <p className="mb-3 text-xs text-[#084B72]">Monthly, from the Billing & Reconciliation Agent</p>
                <GroupedBarChart labels={months} series={[{ label: "Collected", color: COLORS.teal, data: collectedM }, { label: "Billed", color: COLORS.navy, data: billedM }, { label: "Projected", color: COLORS.solar, data: projectedM }]} format={(value) => `$${Math.round(value)}K`} />
                <ChartLegend series={[{ label: "Collected", color: COLORS.teal }, { label: "Billed", color: COLORS.navy }, { label: "Projected", color: COLORS.solar }]} />
              </Panel>
              <Panel>
                <h3 className="font-bold text-[#002348]">Where launches are going</h3>
                <p className="mb-3 text-xs text-[#084B72]">Delivery model mix, active + pipeline courses</p>
                <DonutChart labels={["Self-paced", "Instructor-led", "Blended", "Private cohort"]} values={[34, 26, 28, 12]} colors={[COLORS.teal, COLORS.navy, COLORS.solar, COLORS.magenta]} />
              </Panel>
            </div>
            <SectionTitle title="Courses needing an executive decision" sub="Pulled from Alerts & Decisions - highest severity first." />
            <Panel className="mt-4">
              <ExecutiveTable>
                <TableHead labels={["Course / account", "Issue", "Severity", "Owner agent"]} />
                <tbody>{overviewAlerts.map((item) => <tr key={item.course} onClick={() => setView("alerts")} className="cursor-pointer border-b border-[#00234812] text-[#1A385E] hover:bg-[#E8F4F4]">
                  <td className="py-3 pr-4">{item.course}</td><td className="py-3 pr-4">{item.issue}</td><td className="py-3 pr-4"><Pill tone={item.tone}>{item.sev}</Pill></td><td className="py-3 pr-4"><span className="rounded bg-[#E8F4F4] px-2 py-1 text-[11px] font-bold uppercase tracking-wide text-[#084B72]">{item.owner}</span></td>
                </tr>)}</tbody>
              </ExecutiveTable>
            </Panel>
          </>}

          {view === "revenue" && <>
            <KpiGrid items={kpiData[range].revenue} />
            <SectionTitle title="Collected vs. billed vs. projected" sub="Quarterly view. Projected profitability is only as good as what has actually been collected." />
            <Panel className="mt-4">
              <div className="mb-4 flex flex-wrap gap-2">
                {[["all", "All three"], ["collected", "Collected only"], ["billed", "Billed only"]].map(([id, label]) => <button key={id} type="button" onClick={() => setRevenueMode(id as "all" | "collected" | "billed")} className={`rounded-full border px-3 py-2 text-xs font-bold ${revenueMode === id ? "border-[#002348] bg-[#002348] text-white" : "border-[#0023481f] bg-white text-[#084B72]"}`}>{label}</button>)}
              </div>
              <GroupedBarChart labels={["Q3 FY25", "Q4 FY25", "Q1 FY26", "Q2 FY26"]} series={revenueSeries} format={(value) => `$${Math.round(value)}K`} />
              <ChartLegend series={revenueSeries.map(({ label, color }) => ({ label, color }))} />
            </Panel>
            <SectionTitle title="Invoice aging" sub="Outstanding balances by days overdue, across all delivered sessions." />
            <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_1fr]">
              <Panel><HBarChart categories={["0-15 days", "16-30 days", "31-45 days", "45+ days"]} values={[98, 74, 52, 56]} colors={[COLORS.teal, COLORS.solar, "#e88a00", COLORS.magenta]} format={(value) => `$${value}K`} /></Panel>
              <Panel>
                <h3 className="font-bold text-[#002348]">Flagged for dispute or mismatch</h3>
                <p className="mb-3 text-xs text-[#084B72]">Needs Finance + Learning team follow-up</p>
                <ExecutiveTable><TableHead labels={["Client", "Amount", "Days overdue", "Status"]} /><tbody>
                  {[["Global Bank Corp", "$186,400", "52", "Disputed"], ["Meridian Health Systems", "$42,900", "38", "Pending reply"], ["Anchor Logistics Group", "$19,250", "21", "Pending reply"], ["Falcon Retail Holdings", "$8,700", "17", "Resolving"]].map(([client, amount, days, status]) => <tr key={client} className="border-b border-[#00234812] text-[#1A385E]"><td className="py-3 pr-4">{client}</td><td className="py-3 pr-4">{amount}</td><td className="py-3 pr-4">{days}</td><td className="py-3 pr-4"><Pill tone={statusTone(status)}>{status}</Pill></td></tr>)}
                </tbody></ExecutiveTable>
              </Panel>
            </div>
          </>}

          {view === "demand" && <>
            <KpiGrid items={kpiData[range].demand} />
            <SectionTitle title="Registration trend" sub="Monthly registrations across all certification tracks, trailing 12 months." />
            <Panel className="mt-4"><LineAreaChart labels={months} values={[210, 225, 240, 268, 205, 255, 290, 270, 310, 335, 318, 352]} color={COLORS.navy} /></Panel>
            <SectionTitle title="Pipeline by certification track" sub="Forecasted demand and recommended delivery model, from the CRM Demand & Profitability Agent." />
            <Panel className="mt-4"><ExecutiveTable><TableHead labels={["Track", "Open pipeline", "QoQ demand", "Recommended model", "Launch readiness"]} /><tbody>
              {pipelineRows.map(([track, pipeline, demand, model, readiness]) => <tr key={track} className="border-b border-[#00234812] text-[#1A385E]"><td className="py-3 pr-4">{track}</td><td className="py-3 pr-4">{pipeline}</td><td className="py-3 pr-4"><span className={demand.startsWith("+") ? "text-[#005849]" : "text-[#731A42]"}>{demand}</span></td><td className="py-3 pr-4"><span className="rounded border border-[#0023481f] px-2 py-1 text-xs font-bold">{model}</span></td><td className="py-3 pr-4"><Pill tone={statusTone(readiness)}>{readiness}</Pill></td></tr>)}
            </tbody></ExecutiveTable></Panel>
          </>}

          {view === "health" && <>
            <KpiGrid items={kpiData[range].health} />
            <SectionTitle title="Content freshness by certification track" sub="Monitored against vendor source changes, release notes, and repository state." />
            <Panel className="mt-4"><ExecutiveTable><TableHead labels={["Course", "Freshness", "Status", "Source diff", "Action"]} /><tbody>
              {contentRows.map(([course, freshness, status, diff, action]) => <tr key={course} className="border-b border-[#00234812] text-[#1A385E]"><td className="py-3 pr-4">{course}</td><td className="py-3 pr-4"><span className="mr-2 inline-block h-1.5 w-16 overflow-hidden rounded bg-[#E8F4F4] align-middle"><span className="block h-full bg-[#00A48C]" style={{ width: `${freshness}%` }} /></span>{freshness}</td><td className="py-3 pr-4"><Pill tone={statusTone(status)}>{status}</Pill></td><td className="py-3 pr-4">{diff}</td><td className="py-3 pr-4">{action}</td></tr>)}
            </tbody></ExecutiveTable></Panel>
            <SectionTitle title="Repository sync posture" sub="Approval state across generated, reviewed, and published learning assets." />
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {[["Approved packages", "39", COLORS.teal], ["Awaiting review", "8", COLORS.solar], ["Blocked revisions", "5", COLORS.magenta]].map(([label, value, color]) => <Panel key={label}><p className="text-xs font-bold uppercase tracking-[.16em] text-[#084B72]">{label}</p><p className="mt-2 font-serif text-4xl font-bold text-[#002348]">{value}</p><div className="mt-3 h-2 rounded-full bg-[#E8F4F4]"><div className="h-full rounded-full" style={{ width: `${Number(value) * 2}%`, background: color }} /></div></Panel>)}
            </div>
          </>}

          {view === "trainers" && <>
            <KpiGrid items={kpiData[range].trainers} />
            <SectionTitle title="Utilization by specialization" sub="Trainer capacity and coverage constraints from Trainer Matching & Calendar." />
            <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_.9fr]">
              <Panel>
                {trainerSpecs.map((trainer) => <div key={trainer.name} className="flex items-center gap-4 border-b border-[#00234812] py-3 last:border-0">
                  <div className="w-40 shrink-0 text-sm font-semibold text-[#002348]">{trainer.name}</div>
                  <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-[#E8F4F4]"><div className="h-full rounded-full" style={{ width: `${trainer.pct}%`, background: trainer.color }} /></div>
                  <div className="w-12 text-right text-sm font-bold text-[#002348]">{trainer.pct}%</div>
                </div>)}
              </Panel>
              <Panel>
                <h3 className="font-bold text-[#002348]">Trainer geography</h3>
                <p className="mb-3 text-xs text-[#084B72]">Active trainers by region</p>
                <GroupedBarChart labels={["North America", "EMEA", "APAC", "LATAM"]} series={[{ label: "Active trainers", color: COLORS.steel, data: [34, 22, 24, 6] }]} />
              </Panel>
            </div>
            <SectionTitle title="Capacity decisions" sub="Specializations requiring backup coverage or additional cohort approval." />
            <Panel className="mt-4"><ExecutiveTable><TableHead labels={["Specialization", "Utilization", "Risk", "Recommended decision"]} /><tbody>
              {[["SAFe (SPC / RTE)", "92%", "High", "Approve backup trainer bench"], ["GitLab DevOps", "88%", "Medium", "Open one additional cohort"], ["Leadership & EQ", "49%", "Low", "Shift demand to underused trainers"]].map(([spec, util, risk, decision]) => <tr key={spec} className="border-b border-[#00234812] text-[#1A385E]"><td className="py-3 pr-4">{spec}</td><td className="py-3 pr-4">{util}</td><td className="py-3 pr-4"><Pill tone={risk === "High" ? "revision" : risk === "Medium" ? "review" : "current"}>{risk}</Pill></td><td className="py-3 pr-4">{decision}</td></tr>)}
            </tbody></ExecutiveTable></Panel>
          </>}

          {view === "alerts" && <>
            <KpiGrid items={[
              { eyebrow: "Open decisions", value: String(openAlerts), delta: openAlerts ? "down" : "up", dtext: openAlerts ? "action needed" : "clear", caption: "Executive approvals waiting on owner agents" },
              { eyebrow: "High severity", value: String(alertsData.filter((alert) => alert.cls === "critical" && !resolved.includes(alert.id)).length), delta: "down", dtext: "content + billing", caption: "Requires explicit approval or review" },
              { eyebrow: "Watch items", value: String(alertsData.filter((alert) => alert.cls === "watch" && !resolved.includes(alert.id)).length), delta: "flat", dtext: "monitor", caption: "Can proceed after executive guidance" },
              { eyebrow: "Opportunities", value: String(alertsData.filter((alert) => alert.cls === "opportunity" && !resolved.includes(alert.id)).length), delta: "up", dtext: "growth signal", caption: "Demand upside surfaced by agents" },
            ]} />
            <SectionTitle title="Alerts & Decisions" sub="Approve, review, or open detail for items routed by the Analytics & Orchestration Layer." />
            <div className="mt-4 space-y-3">
              {alertsData.map((alert) => {
                const done = resolved.includes(alert.id);
                return <div key={alert.id} className={`rounded-md border border-[#0023481f] bg-white p-5 transition ${alert.cls === "critical" ? "border-l-4 border-l-[#C90C61]" : alert.cls === "watch" ? "border-l-4 border-l-[#FFC622]" : "border-l-4 border-l-[#00A48C]"} ${done ? "opacity-50" : ""}`}>
                  <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                    <div>
                      <p className="font-bold text-[#002348]">{alert.title}</p>
                      <p className="mt-1 max-w-3xl text-sm leading-6 text-[#1A385E]">{alert.desc}</p>
                      <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-[#084B72]">{alert.meta}</p>
                    </div>
                    <div className="flex shrink-0 flex-wrap gap-2">
                      <button type="button" disabled={done} onClick={() => showToast("Opening detail view for this item")} className="rounded-md border border-[#0023481f] bg-white px-3 py-2 text-xs font-bold text-[#002348] disabled:cursor-default disabled:opacity-50">{alert.ghost}</button>
                      <button type="button" disabled={done} onClick={() => approveAlert(alert.id)} className="rounded-md bg-[#002348] px-3 py-2 text-xs font-bold text-white disabled:cursor-default disabled:opacity-50">{done ? "Approved" : alert.primary}</button>
                    </div>
                  </div>
                </div>;
              })}
            </div>
          </>}
        </div>
      </main>
    </div>
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-md bg-[#002348] px-5 py-3 text-sm text-white shadow-xl transition ${toast ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"}`}>
      <span className="size-2 rounded-full bg-[#C8DF00]" />
      {toast}
    </div>
  </div>;
}
