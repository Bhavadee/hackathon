"use client";

import { useMemo, useState } from "react";
import {
  Activity,
  ArrowUpRight,
  BadgeCheck,
  Banknote,
  Bell,
  BookOpenCheck,
  Bot,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  ClipboardCheck,
  Database,
  Gauge,
  GraduationCap,
  Library,
  LineChart,
  Network,
  Search,
  SearchCheck,
  Settings2,
  Sparkles,
  UserRoundCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { TrainerNetwork } from "@/components/trainer-network";
import { WorkflowLauncher } from "@/components/workflow-launcher";

export type DashboardData = {
  courses: { id: string; title: string; status: string; freshness: number; sourceVersion: string }[];
  requests: { id: string; customer: string; topic: string; seats: number; pricePerSeat: string; deliveryMode: string; status: string }[];
  trainers: { id: string; name: string; role: string; skills: string[]; certifications: string[]; hourlyRate: number; utilization: number; availableFrom: string }[];
  runs: { id: string; agent: string; status: string; summary: string; durationMs: number }[];
  connected: boolean;
};

type PersonaId = "admin" | "sales" | "trainer" | "learner" | "executive";
type TrainerView = "home" | "network" | "generator" | "content" | "prep";
type LearnerView = "discover" | "generator" | "learning" | "copilot";

const personas: { id: PersonaId; label: string; title: string; description: string; Icon: LucideIcon }[] = [
  { id: "admin", label: "Admin", title: "Governance and Operations Console", description: "Control content freshness, role access, catalog standards, and system integrations.", Icon: Settings2 },
  { id: "sales", label: "Sales", title: "Demand, Quoting, and Collections Portal", description: "Validate readiness, model margin, package offers, and track quote-to-cash.", Icon: Banknote },
  { id: "trainer", label: "Trainer", title: "Assignment and Delivery Portal", description: "Manage availability, assignments, current content, and course creation workflows.", Icon: UserRoundCheck },
  { id: "learner", label: "Learner", title: "Discovery, Learning, and Copilot Portal", description: "Generate a learning path, continue modules, and ask grounded learning questions.", Icon: GraduationCap },
  { id: "executive", label: "Executive", title: "Analytics and Orchestration Dashboard", description: "Track demand, margin, operating health, and agent impact across TaaS.", Icon: Gauge },
];

function money(value: number) {
  return `$${value.toLocaleString()}`;
}

function StatusPill({ tone = "blue", children }: { tone?: "blue" | "green" | "amber" | "red" | "slate"; children: React.ReactNode }) {
  const styles = {
    blue: "bg-blue-50 text-blue-700 border-blue-100",
    green: "bg-emerald-50 text-emerald-700 border-emerald-100",
    amber: "bg-amber-50 text-amber-700 border-amber-100",
    red: "bg-red-50 text-red-700 border-red-100",
    slate: "bg-slate-100 text-slate-600 border-slate-200",
  };
  return <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${styles[tone]}`}>{children}</span>;
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`rounded-lg border border-slate-200 bg-white p-5 shadow-sm ${className}`}>{children}</section>;
}

function MetricCard({ Icon, label, value, detail, tone }: { Icon: LucideIcon; label: string; value: string; detail: string; tone: string }) {
  return <Card>
    <div className="flex items-start justify-between">
      <div className={`grid size-10 place-items-center rounded-lg ${tone}`}><Icon size={19} /></div>
      <ArrowUpRight size={16} className="text-slate-300" />
    </div>
    <p className="mt-5 text-xs font-bold uppercase tracking-wider text-slate-400">{label}</p>
    <p className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">{value}</p>
    <p className="mt-1 text-xs leading-5 text-slate-500">{detail}</p>
  </Card>;
}

function PersonaHeader({ persona }: { persona: (typeof personas)[number] }) {
  return <div className="mb-7 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
    <div>
      <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-bold uppercase tracking-[.16em] text-blue-700">
        <persona.Icon size={15} />
        {persona.label}
      </div>
      <h1 className="max-w-4xl text-3xl font-semibold tracking-tight text-slate-950 md:text-5xl">{persona.title}</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">{persona.description}</p>
    </div>
    <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <Bell size={16} className="text-blue-600" />
      <span className="text-xs font-bold text-slate-600">6 agents healthy</span>
    </div>
  </div>;
}

function ConsoleCard({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  return <section className={`rounded-lg border border-slate-200 bg-[#f1f4f8] p-5 ${className}`}>
    <h2 className="text-sm font-extrabold uppercase tracking-wide text-slate-600">{title}</h2>
    <div className="mt-6">{children}</div>
  </section>;
}

function ConsoleShell({
  role,
  url,
  search,
  navItems,
  active,
  children,
}: {
  role: "admin" | "sales";
  url: string;
  search: string;
  navItems: { label: string; Icon: LucideIcon }[];
  active: string;
  children: React.ReactNode;
}) {
  return <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
    <div className="flex h-[88px] items-center gap-7 border-b border-slate-200 bg-[#e8ebf0] px-8">
      <div className="flex gap-3">
        {[0, 1, 2].map((dot) => <span key={dot} className="size-3.5 rounded-full bg-slate-300" />)}
      </div>
      <div className="rounded-md bg-white px-5 py-2 font-mono text-sm text-slate-600 shadow-sm">{url}</div>
    </div>

    <div className="grid min-h-[620px] lg:grid-cols-[300px_1fr]">
      <aside className="border-b border-slate-200 bg-[#eef1f5] p-4 lg:border-b-0 lg:border-r">
        <nav className="flex gap-2 overflow-x-auto lg:block lg:space-y-3">
          {navItems.map(({ label, Icon }) => {
            const selected = label === active;
            return <button key={label} type="button" className={`flex min-w-fit items-center gap-3 rounded-lg px-4 py-4 text-left text-sm font-medium transition lg:w-full ${selected ? "bg-[#e7ebff] text-blue-700" : "text-slate-600 hover:bg-white"}`}>
              <Icon size={17} />
              <span>{label}</span>
            </button>;
          })}
        </nav>
      </aside>

      <section className="min-w-0 overflow-hidden bg-white">
        <div className="flex items-center justify-between gap-4 p-7 pb-4">
          <div className="flex min-h-14 w-full max-w-[505px] items-center gap-3 rounded-lg border border-slate-200 bg-[#f1f3f6] px-5 text-slate-500">
            <Search size={20} className="text-blue-600" />
            <span className="truncate text-sm md:text-base">{search}</span>
          </div>
          <div className="grid size-12 shrink-0 place-items-center rounded-full border border-slate-200 bg-slate-50 text-orange-500">
            <Bell size={18} />
          </div>
        </div>
        <div className="px-7 pb-7">
          <p className="mb-6 text-xs font-bold uppercase tracking-[.16em] text-slate-500">{role === "admin" ? "Dashboard" : "Sales Dashboard"}</p>
          {children}
        </div>
      </section>
    </div>
  </div>;
}

function AdminPersona({ data }: { data: DashboardData }) {
  const avgFreshness = Math.round(data.courses.reduce((sum, course) => sum + course.freshness, 0) / data.courses.length);
  return <ConsoleShell
    role="admin"
    url="taas.cprime.com/admin/dashboard"
    search="Search courses, trainers, agents..."
    active="Dashboard"
    navItems={[
      { label: "Dashboard", Icon: Gauge },
      { label: "Content Review", Icon: Activity },
      { label: "Repository", Icon: Library },
      { label: "Trainer Network", Icon: Network },
      { label: "Branding Studio", Icon: BadgeCheck },
      { label: "Catalog Config", Icon: Settings2 },
      { label: "Access Control", Icon: ClipboardCheck },
    ]}
  >
    <div className="grid gap-5 xl:grid-cols-3">
      <ConsoleCard title="Content Review Queue">
        <div className="space-y-3">
          {[
            ["SAFe 6.2 syllabus diff", "Review", "amber"],
            ["Scrum Guide revision", "Review", "amber"],
            ["GitLab CI module", "Approved", "green"],
          ].map(([title, status, tone]) => <div key={title} className="flex items-center justify-between gap-3 border-b border-dashed border-slate-200 pb-3 last:border-0 last:pb-0">
            <span className="text-sm text-slate-950">{title}</span>
            <span className={`rounded-md px-3 py-1 text-xs font-extrabold ${tone === "green" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{status}</span>
          </div>)}
        </div>
        <p className="mt-5 text-sm text-slate-600">3 sources flagged today by monitoring agent</p>
      </ConsoleCard>

      <ConsoleCard title="Repository Health">
        <p className="text-4xl font-light text-slate-950">{avgFreshness}%</p>
        <p className="mt-3 text-sm text-slate-600">Content freshness score</p>
        <div className="mt-3 h-2 rounded-full bg-slate-200"><div className="h-full rounded-full bg-blue-600" style={{ width: `${avgFreshness}%` }} /></div>
        <p className="mt-5 text-sm text-slate-600">Last sync: 12 minutes ago</p>
      </ConsoleCard>

      <ConsoleCard title="Trainer Network">
        <div className="divide-y divide-dashed divide-slate-200 text-sm text-slate-950">
          <p className="pb-3">{data.trainers.length} active trainers</p>
          <p className="py-3">2 certs expiring &lt;30d</p>
          <p className="pt-3">6 regions covered</p>
        </div>
      </ConsoleCard>

      <ConsoleCard title="Branding Studio">
        <div className="space-y-3 text-sm text-slate-700">
          <p>Client templates: 14</p>
          <p>Default Cprime theme active</p>
          <p>Watermark policy enforced</p>
        </div>
      </ConsoleCard>

      <ConsoleCard title="Access & Roles">
        <div className="grid grid-cols-2 gap-3 text-sm">
          {["Admin", "Sales", "Trainer", "Learner"].map((role) => <div key={role} className="rounded-md bg-white px-3 py-2 font-semibold text-slate-700">{role}</div>)}
        </div>
        <p className="mt-5 text-sm text-slate-600">SSO policy: required</p>
      </ConsoleCard>

      <ConsoleCard title="System Integrations">
        <div className="space-y-3">
          {["Salesforce", "Repository Sync", "Finance Export"].map((item) => <div key={item} className="flex items-center justify-between text-sm">
            <span className="text-slate-700">{item}</span>
            <StatusPill tone={data.connected ? "green" : "amber"}>{data.connected ? "Live" : "Demo"}</StatusPill>
          </div>)}
        </div>
      </ConsoleCard>
    </div>
  </ConsoleShell>;
}

function SalesPersona({ data }: { data: DashboardData }) {
  const revenue = data.requests.reduce((sum, item) => sum + item.seats * Number(item.pricePerSeat), 0);
  const seats = data.requests.reduce((sum, item) => sum + item.seats, 0);
  return <ConsoleShell
    role="sales"
    url="taas.cprime.com/sales/dashboard"
    search="Search accounts, quotes, cohorts..."
    active="Dashboard"
    navItems={[
      { label: "Dashboard", Icon: Gauge },
      { label: "Demand Pipeline", Icon: Activity },
      { label: "Quote Builder", Icon: CircleDollarSign },
      { label: "Trainer Match", Icon: UserRoundCheck },
      { label: "Catalog Offers", Icon: BookOpenCheck },
      { label: "Collections", Icon: Banknote },
      { label: "CRM Sync", Icon: Database },
    ]}
  >
    <div className="grid gap-5 xl:grid-cols-3">
      <ConsoleCard title="Demand Pipeline">
        <div className="space-y-3">
          {data.requests.map((request) => <div key={request.id} className="flex items-center justify-between gap-3 border-b border-dashed border-slate-200 pb-3 last:border-0 last:pb-0">
            <div className="min-w-0">
              <p className="truncate text-sm text-slate-950">{request.customer}</p>
              <p className="mt-1 text-xs text-slate-500">{request.topic}</p>
            </div>
            <span className="shrink-0 rounded-md bg-blue-50 px-3 py-1 text-xs font-extrabold text-blue-700">{request.status}</span>
          </div>)}
        </div>
        <p className="mt-5 text-sm text-slate-600">{seats} learner seats in active pipeline</p>
      </ConsoleCard>

      <ConsoleCard title="Pipeline Value">
        <p className="text-4xl font-light text-slate-950">{money(revenue)}</p>
        <p className="mt-3 text-sm text-slate-600">Current quoted training value</p>
        <div className="mt-3 h-2 rounded-full bg-slate-200"><div className="h-full w-[78%] rounded-full bg-blue-600" /></div>
        <p className="mt-5 text-sm text-slate-600">Weighted forecast: 78%</p>
      </ConsoleCard>

      <ConsoleCard title="Quote Readiness">
        <div className="divide-y divide-dashed divide-slate-200 text-sm text-slate-950">
          <p className="pb-3">Content approved: 80%</p>
          <p className="py-3">Trainer holds: 2 pending</p>
          <p className="pt-3">Finance review: 1 account</p>
        </div>
      </ConsoleCard>

      <ConsoleCard title="Next Actions">
        <div className="space-y-3">
          {["Generate Northstar quote", "Confirm Acme trainer match", "Send Orbit renewal pack"].map((item, index) => <div key={item} className="flex items-center justify-between gap-3 rounded-md bg-white px-3 py-2 text-sm">
            <span className="text-slate-700">{item}</span>
            <StatusPill tone={index === 0 ? "amber" : "slate"}>{index === 0 ? "Due" : "Open"}</StatusPill>
          </div>)}
        </div>
      </ConsoleCard>

      <ConsoleCard title="Margin Guardrails">
        <p className="text-4xl font-light text-slate-950">34%</p>
        <p className="mt-3 text-sm text-slate-600">Projected blended margin</p>
        <div className="mt-3 h-2 rounded-full bg-slate-200"><div className="h-full w-[66%] rounded-full bg-emerald-500" /></div>
      </ConsoleCard>

      <ConsoleCard title="Collections">
        <div className="space-y-3 text-sm text-slate-700">
          <p>Open invoices: $4.2K</p>
          <p>Payment terms accepted: 6</p>
          <p>Renewals this month: 3</p>
        </div>
      </ConsoleCard>
    </div>
  </ConsoleShell>;
}

function TrainerShell({ activeView, onViewChange, children }: { activeView: TrainerView; onViewChange: (view: TrainerView) => void; children: React.ReactNode }) {
  const views: { id: TrainerView; label: string; Icon: LucideIcon }[] = [
    { id: "home", label: "My Profile", Icon: UserRoundCheck },
    { id: "network", label: "Trainer Feature", Icon: Network },
    { id: "generator", label: "Course Generator", Icon: Sparkles },
    { id: "content", label: "Content Library", Icon: Library },
    { id: "prep", label: "Session Prep", Icon: ClipboardCheck },
  ];
  return <div className="grid overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm xl:grid-cols-[240px_1fr]">
    <aside className="border-b border-slate-200 bg-slate-50 p-3 xl:border-b-0 xl:border-r">
      <nav className="flex gap-2 overflow-x-auto xl:block xl:space-y-1">
        {views.map(({ id, label, Icon }) => <button key={id} type="button" onClick={() => onViewChange(id)} className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold xl:w-full ${activeView === id ? "bg-slate-950 text-white" : "text-slate-600 hover:bg-white"}`}>
          <Icon size={16} />
          {label}
        </button>)}
      </nav>
    </aside>
    <div className="min-w-0 bg-[#f8fafc] p-4 md:p-6">{children}</div>
  </div>;
}

function TrainerHome({ data }: { data: DashboardData }) {
  const avgUtilization = Math.round(data.trainers.reduce((sum, trainer) => sum + trainer.utilization, 0) / data.trainers.length);
  return <div className="space-y-5">
    <div className="grid gap-4 md:grid-cols-3">
      <MetricCard Icon={BadgeCheck} label="My credentials" value="3 active" detail="SAFe SPC, CSP-SM, ICAgile" tone="bg-blue-50 text-blue-700" />
      <MetricCard Icon={CalendarDays} label="Availability" value="5 days" detail="Open across the next two delivery weeks" tone="bg-emerald-50 text-emerald-700" />
      <MetricCard Icon={LineChart} label="Network utilization" value={`${avgUtilization}%`} detail="Average utilization across trainer pool" tone="bg-amber-50 text-amber-700" />
    </div>
    <Card>
      <h2 className="font-semibold text-slate-950">Assignment Matches</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {data.requests.slice(0, 2).map((request, index) => <div key={request.id} className="rounded-lg border border-slate-100 bg-slate-50 p-4">
          <div className="flex items-start justify-between gap-3"><div><p className="text-sm font-semibold text-slate-900">{request.topic}</p><p className="mt-1 text-xs text-slate-500">{request.customer} - {request.deliveryMode}</p></div><StatusPill tone="green">{index === 0 ? "98% fit" : "91% fit"}</StatusPill></div>
          <div className="mt-4 flex gap-2"><button className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-bold text-white">Accept</button><button className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600">Decline</button></div>
        </div>)}
      </div>
    </Card>
  </div>;
}

function TrainerPersona({ data }: { data: DashboardData }) {
  const [view, setView] = useState<TrainerView>("home");
  return <TrainerShell activeView={view} onViewChange={setView}>
    {view === "home" && <TrainerHome data={data} />}
    {view === "network" && <div><SectionTitle eyebrow="Trainer feature" title="Trainer network and action management" description="This is the existing complete trainer feature, placed inside the Trainer persona." /><TrainerNetwork trainers={data.trainers} /></div>}
    {view === "generator" && <div><SectionTitle eyebrow="Course generator" title="Create or tailor a course for delivery" description="This is the existing complete course generator, available to trainers." /><section className="overflow-hidden rounded-lg bg-[#17233b] text-white shadow-xl"><WorkflowLauncher /></section></div>}
    {view === "content" && <TrainerContent data={data} />}
    {view === "prep" && <TrainerPrep />}
  </TrainerShell>;
}

function TrainerContent({ data }: { data: DashboardData }) {
  return <Card>
    <h2 className="font-semibold text-slate-950">Content Library</h2>
    <p className="mt-1 text-xs text-slate-500">Download the latest approved material for assigned sessions.</p>
    <div className="mt-5 space-y-3">
      {data.courses.map((course) => <div key={course.id} className="flex items-center justify-between gap-4 rounded-lg border border-slate-100 bg-slate-50 p-4">
        <div><p className="text-sm font-semibold text-slate-900">{course.title}</p><p className="mt-1 text-xs text-slate-500">Deck source v{course.sourceVersion} - freshness {course.freshness}%</p></div>
        <button className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-bold text-white">Download latest</button>
      </div>)}
    </div>
  </Card>;
}

function TrainerPrep() {
  return <Card>
    <h2 className="font-semibold text-slate-950">Session Prep Checklist</h2>
    <div className="mt-5 grid gap-3 md:grid-cols-2">
      {["Slides finalized", "Lab environment provisioned", "Roster confirmed", "Learner escalation route ready"].map((item, index) => <label key={item} className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50 p-4 text-sm font-semibold text-slate-700">
        <input type="checkbox" defaultChecked={index < 2} className="size-4 accent-blue-600" />
        {item}
      </label>)}
    </div>
  </Card>;
}

function LearnerPersona({ data }: { data: DashboardData }) {
  const [view, setView] = useState<LearnerView>("discover");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("Ask me about your current module, lab, or recommended next step.");
  const views: { id: LearnerView; label: string; Icon: LucideIcon }[] = [
    { id: "discover", label: "Discover", Icon: Search },
    { id: "generator", label: "Course Generator", Icon: Sparkles },
    { id: "learning", label: "My Learning", Icon: BookOpenCheck },
    { id: "copilot", label: "Copilot", Icon: Bot },
  ];
  function ask() {
    const trimmed = question.trim();
    if (!trimmed) return;
    setAnswer(`Here is a guided explanation for "${trimmed}". Review the related module, then try the practical lab to reinforce the concept.`);
    setQuestion("");
  }
  return <div className="grid overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm xl:grid-cols-[240px_1fr]">
    <aside className="border-b border-slate-200 bg-slate-50 p-3 xl:border-b-0 xl:border-r">
      <nav className="flex gap-2 overflow-x-auto xl:block xl:space-y-1">
        {views.map(({ id, label, Icon }) => <button key={id} type="button" onClick={() => setView(id)} className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold xl:w-full ${view === id ? "bg-slate-950 text-white" : "text-slate-600 hover:bg-white"}`}><Icon size={16} />{label}</button>)}
      </nav>
    </aside>
    <div className="min-w-0 bg-[#f8fafc] p-4 md:p-6">
      {view === "discover" && <LearnerDiscover data={data} onGenerate={() => setView("generator")} />}
      {view === "generator" && <div><SectionTitle eyebrow="Course generator" title="Generate your learning path" description="This is the existing complete course generator, available to learners." /><section className="overflow-hidden rounded-lg bg-[#17233b] text-white shadow-xl"><WorkflowLauncher /></section></div>}
      {view === "learning" && <LearnerLearning data={data} />}
      {view === "copilot" && <Card><div className="flex items-center gap-3"><div className="grid size-10 place-items-center rounded-lg bg-violet-100 text-violet-700"><Sparkles size={18} /></div><div><h2 className="font-semibold text-slate-950">Learner Copilot</h2><p className="text-xs text-slate-500">Grounded in approved course content.</p></div></div><div className="mt-5 min-h-32 rounded-lg bg-slate-50 p-4 text-sm leading-6 text-slate-600">{answer}</div><div className="mt-4 flex gap-2"><input value={question} onChange={(event) => setQuestion(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") ask(); }} className="min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500" placeholder="Ask about a concept or lab" /><button onClick={ask} className="rounded-lg bg-blue-600 px-4 text-sm font-bold text-white">Ask</button></div></Card>}
    </div>
  </div>;
}

function LearnerDiscover({ data, onGenerate }: { data: DashboardData; onGenerate: () => void }) {
  return <div className="space-y-5">
    <div className="grid gap-4 lg:grid-cols-[1fr_.8fr]">
      <Card>
        <div className="flex items-center gap-3"><div className="grid size-10 place-items-center rounded-lg bg-blue-50 text-blue-700"><Sparkles size={18} /></div><div><h2 className="font-semibold text-slate-950">Learning Objective Builder</h2><p className="text-xs text-slate-500">Tell us your goal and generate a structured path.</p></div></div>
        <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">I want to learn Scaled Agile for a Product Owner role...</div>
        <div className="mt-4 flex flex-wrap gap-2"><StatusPill>Self-paced</StatusPill><StatusPill tone="slate">Blended</StatusPill><StatusPill tone="slate">Instructor-led</StatusPill></div>
        <button onClick={onGenerate} className="mt-5 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-bold text-white">Generate my path</button>
      </Card>
      <Card>
        <h2 className="font-semibold text-slate-950">My Progress</h2>
        <div className="mt-5 space-y-4">
          {[["SAFe Fundamentals", 72], ["Scrum Master Prep", 34]].map(([title, progress]) => <div key={title}>
            <div className="flex justify-between text-sm"><span className="font-semibold text-slate-700">{title}</span><span className="font-bold text-slate-950">{progress}%</span></div>
            <div className="mt-2 h-2 rounded-full bg-slate-100"><div className="h-full rounded-full bg-blue-600" style={{ width: `${progress}%` }} /></div>
          </div>)}
        </div>
      </Card>
    </div>
    <div className="grid gap-4 md:grid-cols-3">
      {data.courses.map((course, index) => <Card key={course.id}>
        <h3 className="font-semibold text-slate-950">{course.title}</h3>
        <p className="mt-2 text-xs leading-5 text-slate-500">Self-paced - {index + 4} modules - source v{course.sourceVersion}</p>
        <div className="mt-4"><StatusPill tone={index === 0 ? "green" : "slate"}>{index === 0 ? "Recommended" : course.status}</StatusPill></div>
      </Card>)}
    </div>
  </div>;
}

function LearnerLearning({ data }: { data: DashboardData }) {
  return <Card>
    <h2 className="font-semibold text-slate-950">My Learning</h2>
    <div className="mt-5 space-y-3">
      {data.courses.slice(0, 3).map((course, index) => <div key={course.id} className="rounded-lg border border-slate-100 bg-slate-50 p-4">
        <div className="flex items-start justify-between gap-3"><div><p className="text-sm font-semibold text-slate-900">{course.title}</p><p className="mt-1 text-xs text-slate-500">{index === 0 ? "72" : index === 1 ? "34" : "12"}% complete</p></div><StatusPill tone={index < 2 ? "amber" : "slate"}>{index < 2 ? "In progress" : "Not started"}</StatusPill></div>
        <div className="mt-3 h-2 rounded-full bg-white"><div className="h-full rounded-full bg-blue-600" style={{ width: `${index === 0 ? 72 : index === 1 ? 34 : 12}%` }} /></div>
      </div>)}
    </div>
  </Card>;
}

function ExecutivePersona({ data }: { data: DashboardData }) {
  const revenue = data.requests.reduce((sum, item) => sum + item.seats * Number(item.pricePerSeat), 0);
  const avgFreshness = Math.round(data.courses.reduce((sum, course) => sum + course.freshness, 0) / data.courses.length);
  return <div className="space-y-6">
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <MetricCard Icon={LineChart} label="Demand forecast" value="+24%" detail="Scaled agile demand, quarter over quarter" tone="bg-blue-50 text-blue-700" />
      <MetricCard Icon={CircleDollarSign} label="Pipeline value" value={money(revenue)} detail="Current qualified learning requests" tone="bg-emerald-50 text-emerald-700" />
      <MetricCard Icon={Gauge} label="Readiness" value={`${avgFreshness}%`} detail="Average content freshness signal" tone="bg-violet-50 text-violet-700" />
      <MetricCard Icon={CheckCircle2} label="Time saved" value="46.5 hrs" detail="Manual operations returned this month" tone="bg-amber-50 text-amber-700" />
    </div>
    <div className="grid gap-6 xl:grid-cols-[1fr_.8fr]">
      <Card>
        <h2 className="font-semibold text-slate-950">Operating Flow</h2>
        <div className="mt-5 grid gap-2 md:grid-cols-7">
          {["Define", "Generate", "Validate", "Publish", "Deliver", "Measure", "Improve"].map((step, index) => <div key={step} className="rounded-lg bg-slate-50 p-3 text-center">
            <span className={`mx-auto grid size-7 place-items-center rounded-full text-xs font-bold text-white ${index < 4 ? "bg-blue-600" : "bg-emerald-500"}`}>{index + 1}</span>
            <p className="mt-2 text-[11px] font-bold text-slate-600">{step}</p>
          </div>)}
        </div>
      </Card>
      <Card>
        <h2 className="font-semibold text-slate-950">Latest Agent Activity</h2>
        <div className="mt-5 space-y-4">
          {data.runs.map((run) => <div key={run.id} className="flex gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3">
            <div className={`grid size-9 shrink-0 place-items-center rounded-lg ${run.status === "attention" ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"}`}>{run.status === "attention" ? <SearchCheck size={17} /> : <CheckCircle2 size={17} />}</div>
            <div><p className="text-sm font-semibold text-slate-900">{run.agent}</p><p className="mt-1 text-xs leading-5 text-slate-500">{run.summary}</p></div>
          </div>)}
        </div>
      </Card>
    </div>
  </div>;
}

function SectionTitle({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return <div className="mb-5">
    <p className="text-xs font-bold uppercase tracking-[.16em] text-blue-600">{eyebrow}</p>
    <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">{title}</h2>
    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">{description}</p>
  </div>;
}

export function DashboardTabs({ data }: { data: DashboardData }) {
  const [activePersona, setActivePersona] = useState<PersonaId>(() => {
    if (typeof window === "undefined") return "admin";
    const hash = window.location.hash.replace("#", "");
    return personas.some((persona) => persona.id === hash) ? hash as PersonaId : "admin";
  });
  const active = useMemo(() => personas.find((persona) => persona.id === activePersona) ?? personas[0], [activePersona]);

  function selectPersona(persona: PersonaId) {
    setActivePersona(persona);
    window.history.replaceState(null, "", `#${persona}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return <main className="min-h-screen bg-[#f5f7fb] text-[#17233b]">
    <section className="mx-auto max-w-[1520px] px-4 py-6 md:px-8 md:py-8">
      <div className="mb-6 flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="grid size-11 place-items-center rounded-lg bg-[#ff5b49] text-white"><Sparkles size={21} /></div>
          <div><p className="text-lg font-bold tracking-tight text-slate-950">Cprime TaaS</p><p className="text-[10px] font-bold uppercase tracking-[.2em] text-slate-400">Persona platform</p></div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`rounded-full px-3 py-2 text-xs font-bold ${data.connected ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{data.connected ? "Live data" : "Demo data"}</span>
          <span className="hidden rounded-full bg-slate-100 px-3 py-2 text-xs font-bold text-slate-600 sm:inline">Postgres + pgvector</span>
        </div>
      </div>

      <nav aria-label="Personas" className="sticky top-4 z-20 mb-10 rounded-full border border-slate-200 bg-white/95 p-2 shadow-lg shadow-slate-200/70 backdrop-blur">
        <div className="grid grid-cols-2 gap-2 md:grid-cols-5">
          {personas.map(({ id, label, Icon }) => <button key={id} type="button" onClick={() => selectPersona(id)} className={`flex items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-bold transition ${activePersona === id ? "bg-slate-950 text-white" : "text-slate-500 hover:bg-slate-100 hover:text-slate-950"}`}>
            <Icon size={16} />
            {label}
          </button>)}
        </div>
      </nav>

      {activePersona !== "admin" && activePersona !== "sales" && <PersonaHeader persona={active} />}
      {activePersona === "admin" && <AdminPersona data={data} />}
      {activePersona === "sales" && <SalesPersona data={data} />}
      {activePersona === "trainer" && <TrainerPersona data={data} />}
      {activePersona === "learner" && <LearnerPersona data={data} />}
      {activePersona === "executive" && <ExecutivePersona data={data} />}
    </section>
  </main>;
}
