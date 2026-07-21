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
  Download,
  FileText,
  Gauge,
  Globe2,
  GraduationCap,
  Library,
  LineChart,
  Map,
  MessageCircle,
  Network,
  Search,
  SearchCheck,
  Send,
  Settings2,
  Sparkles,
  Upload,
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
type LearnerView = "discover" | "catalogue" | "generator" | "learning";
type AdminView = "dashboard" | "content" | "repository" | "trainers" | "map" | "system";
type SalesView = "dashboard" | "pipeline" | "quotes" | "crm" | "trainer" | "catalog" | "collections";

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
  return <section className={`min-h-[212px] rounded-lg border border-slate-200 bg-[#f1f4f8] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] ${className}`}>
    <h2 className="text-sm font-extrabold uppercase tracking-wide text-slate-600">{title}</h2>
    <div className="mt-5">{children}</div>
  </section>;
}

function ConsoleRow({ label, value, tone = "slate" }: { label: string; value?: string; tone?: "blue" | "green" | "amber" | "slate" }) {
  const toneClass = {
    blue: "bg-blue-50 text-blue-700",
    green: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
    slate: "bg-white text-slate-700",
  };
  return <div className="flex min-h-10 items-center justify-between gap-3 border-b border-dashed border-slate-200 py-2.5 last:border-0">
    <span className="min-w-0 truncate text-sm text-slate-950">{label}</span>
    {value && <span className={`shrink-0 rounded-md px-3 py-1 text-xs font-extrabold ${toneClass[tone]}`}>{value}</span>}
  </div>;
}

function ConsoleShell({
  role,
  url,
  search,
  navItems,
  active,
  onSelect,
  children,
}: {
  role: "admin" | "sales";
  url: string;
  search: string;
  navItems: { id: string; label: string; Icon: LucideIcon }[];
  active: string;
  onSelect?: (id: string) => void;
  children: React.ReactNode;
}) {
  return <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
    <div className="flex h-[74px] items-center gap-4 border-b border-slate-200 bg-[#e8ebf0] px-4 md:h-[88px] md:gap-7 md:px-8">
      <div className="flex gap-2 md:gap-3">
        {[0, 1, 2].map((dot) => <span key={dot} className="size-3 rounded-full bg-slate-300 md:size-3.5" />)}
      </div>
      <div className="min-w-0 truncate rounded-md bg-white px-4 py-2 font-mono text-xs text-slate-600 shadow-sm md:px-5 md:text-sm">{url}</div>
    </div>

    <div className="grid min-h-[620px] lg:grid-cols-[300px_1fr]">
      <aside className="border-b border-slate-200 bg-[#eef1f5] p-3 md:p-4 lg:border-b-0 lg:border-r">
        <nav className="flex gap-2 overflow-x-auto lg:block lg:space-y-3">
          {navItems.map(({ id, label, Icon }) => {
            const selected = id === active;
            return <button key={id} type="button" onClick={() => onSelect?.(id)} className={`flex min-w-fit items-center gap-3 rounded-lg px-4 py-3.5 text-left text-sm font-medium transition lg:w-full ${selected ? "bg-[#e7ebff] font-semibold text-blue-700 shadow-sm" : "text-slate-600 hover:bg-white"}`}>
              <Icon size={17} />
              <span>{label}</span>
            </button>;
          })}
        </nav>
      </aside>

      <section className="min-w-0 overflow-hidden bg-white">
        <div className="flex items-center justify-between gap-4 p-4 pb-3 md:p-7 md:pb-4">
          <div className="flex min-h-14 w-full max-w-[505px] items-center gap-3 rounded-lg border border-slate-200 bg-[#f1f3f6] px-5 text-slate-500">
            <Search size={20} className="text-blue-600" />
            <span className="truncate text-sm md:text-base">{search}</span>
          </div>
          <div className="grid size-12 shrink-0 place-items-center rounded-full border border-slate-200 bg-slate-50 text-orange-500 shadow-sm">
            <Bell size={18} />
          </div>
        </div>
        <div className="px-4 pb-4 md:px-7 md:pb-7">
          <p className="mb-6 text-xs font-bold uppercase tracking-[.16em] text-slate-500">{role === "admin" ? "Admin Console" : "Sales Console"}</p>
          {children}
        </div>
      </section>
    </div>
  </div>;
}

function AdminPersona({ data }: { data: DashboardData }) {
  const [view, setView] = useState<AdminView>("dashboard");
  const avgFreshness = Math.round(data.courses.reduce((sum, course) => sum + course.freshness, 0) / data.courses.length);
  return <ConsoleShell
    role="admin"
    url="taas.cprime.com/admin/dashboard"
    search="Search courses, trainers, agents..."
    active={view}
    onSelect={(id) => setView(id as AdminView)}
    navItems={[
      { id: "dashboard", label: "Dashboard", Icon: Gauge },
      { id: "content", label: "Content Review", Icon: Activity },
      { id: "repository", label: "Repository", Icon: Library },
      { id: "trainers", label: "Trainer Network", Icon: Network },
      { id: "map", label: "Global Map", Icon: Map },
      { id: "system", label: "System Config", Icon: Settings2 },
    ]}
  >
    {view === "dashboard" && <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
      <ConsoleCard title="Content Review Queue"><ConsoleRow label="SAFe 6.2 syllabus diff" value="Review" tone="amber" /><ConsoleRow label="Scrum Guide revision" value="Review" tone="amber" /><ConsoleRow label="GitLab CI module" value="Approved" tone="green" /><p className="mt-5 text-sm text-slate-600">Vendor schedule monitor flagged 3 updates today</p></ConsoleCard>
      <ConsoleCard title="Repository Health"><p className="text-5xl font-light leading-none text-slate-950">{avgFreshness}%</p><p className="mt-3 text-sm text-slate-600">Content freshness score</p><div className="mt-3 h-2 rounded-full bg-slate-200"><div className="h-full rounded-full bg-blue-600" style={{ width: `${avgFreshness}%` }} /></div><p className="mt-5 text-sm text-slate-600">Last sync: 12 minutes ago</p></ConsoleCard>
      <ConsoleCard title="Course Readiness"><ConsoleRow label="Launch-ready courses" value="12/15" tone="green" /><ConsoleRow label="Needs admin review" value="3" tone="amber" /><ConsoleRow label="PDF exports pending" value="4" tone="blue" /><p className="mt-5 text-sm text-slate-600">Moved from sales into admin governance</p></ConsoleCard>
      <ConsoleCard title="Trainer Network"><ConsoleRow label="Active trainers" value={`${data.trainers.length}`} tone="blue" /><ConsoleRow label="Certs expiring <30d" value="2" tone="amber" /><ConsoleRow label="Regions covered" value="6" tone="green" /><p className="mt-5 text-sm text-slate-600">Availability refreshed from trainer profiles</p></ConsoleCard>
      <ConsoleCard title="Branding Studio"><ConsoleRow label="Client templates" value="14" tone="blue" /><ConsoleRow label="Cprime theme" value="Active" tone="green" /><ConsoleRow label="Watermark policy" value="On" tone="green" /><p className="mt-5 text-sm text-slate-600">Brand assets ready for catalog publishing</p></ConsoleCard>
      <ConsoleCard title="Content Exports"><ConsoleRow label="PDF packages generated" value="18" tone="green" /><ConsoleRow label="SCORM bundles" value="7" tone="blue" /><ConsoleRow label="Watermarked decks" value="24" tone="green" /><p className="mt-5 text-sm text-slate-600">Approved courses can be exported as PDFs</p></ConsoleCard>
    </div>}
    {view === "content" && <AdminContentReview data={data} />}
    {view === "repository" && <AdminRepository data={data} />}
    {view === "trainers" && <div><SectionTitle eyebrow="Bhavadeep version retained" title="Trainer network and action management" description="Existing trainer feature remains available for filtering, profile review, and action completion." /><TrainerNetwork trainers={data.trainers} /></div>}
    {view === "map" && <AdminTrainerMap data={data} />}
    {view === "system" && <AdminSystemConfig connected={data.connected} />}
  </ConsoleShell>;
}

function AdminContentReview({ data }: { data: DashboardData }) {
  return <div className="grid gap-5 xl:grid-cols-[1fr_.85fr]">
    <ConsoleCard title="Vendor Update Notifications" className="min-h-0">
      <ConsoleRow label="Scaled Agile update window" value="Monthly" tone="blue" />
      <ConsoleRow label="Scrum.org guide monitor" value="Quarterly" tone="blue" />
      <ConsoleRow label="GitLab release notes" value="Weekly" tone="amber" />
      <p className="mt-5 text-sm text-slate-600">Notifications are created from vendor course update schedules and source feeds.</p>
    </ConsoleCard>
    <ConsoleCard title="Review Source Options" className="min-h-0">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-4"><div className="flex items-center gap-2 font-semibold text-slate-900"><BadgeCheck size={17} className="text-emerald-600" />Vendor login</div><p className="mt-2 text-xs leading-5 text-slate-500">Use shared credentials when the vendor allows authenticated course checks.</p></div>
        <div className="rounded-lg border border-dashed border-blue-200 bg-blue-50 p-4"><div className="flex items-center gap-2 font-semibold text-blue-900"><Upload size={17} />PDF diff upload</div><p className="mt-2 text-xs leading-5 text-blue-700">Upload old and new PDFs when credentials are not available.</p></div>
      </div>
    </ConsoleCard>
    <Card className="xl:col-span-2">
      <h2 className="font-semibold text-slate-950">Old vs New PDF Diff Queue</h2>
      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {data.courses.map((course, index) => <div key={course.id} className="rounded-lg border border-slate-100 bg-slate-50 p-4">
          <div className="flex items-start justify-between gap-3"><div><p className="text-sm font-semibold text-slate-900">{course.title}</p><p className="mt-1 text-xs text-slate-500">Old v{course.sourceVersion} vs vendor update {index + 1}</p></div><StatusPill tone={index === 0 ? "amber" : "green"}>{index === 0 ? "Diff found" : "Clear"}</StatusPill></div>
          <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-slate-950 px-3 py-2 text-xs font-bold text-white"><FileText size={15} />Review diff</button>
        </div>)}
      </div>
    </Card>
  </div>;
}

function AdminRepository({ data }: { data: DashboardData }) {
  return <Card>
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between"><div><h2 className="font-semibold text-slate-950">Course Repository Exports</h2><p className="mt-1 text-xs text-slate-500">Export approved content as branded PDFs for delivery or client review.</p></div><button className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-bold text-white"><Download size={16} />Export selected PDFs</button></div>
    <div className="mt-5 space-y-3">{data.courses.map((course) => <div key={course.id} className="flex flex-col gap-3 rounded-lg border border-slate-100 bg-slate-50 p-4 md:flex-row md:items-center md:justify-between"><div><p className="text-sm font-semibold text-slate-900">{course.title}</p><p className="mt-1 text-xs text-slate-500">Source v{course.sourceVersion} - freshness {course.freshness}%</p></div><div className="flex gap-2"><button className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600">Preview</button><button className="rounded-lg bg-slate-950 px-3 py-2 text-xs font-bold text-white">PDF</button></div></div>)}</div>
  </Card>;
}

function AdminTrainerMap({ data }: { data: DashboardData }) {
  const locations = ["Austin", "Bengaluru", "Madrid", "Toronto", "London", "Singapore"];
  return <div className="grid gap-5 xl:grid-cols-[1fr_.9fr]">
    <Card><div className="flex items-center justify-between"><div><h2 className="font-semibold text-slate-950">Global Trainer Availability</h2><p className="mt-1 text-xs text-slate-500">Map view of trainers by region and next available delivery date.</p></div><Globe2 className="text-blue-600" size={22} /></div><div className="mt-5 grid min-h-[320px] place-items-center rounded-lg border border-slate-200 bg-[#eef4ff] p-5"><div className="grid w-full max-w-xl grid-cols-2 gap-4 md:grid-cols-3">{locations.map((location, index) => <div key={location} className="rounded-lg border border-blue-100 bg-white p-3 shadow-sm"><p className="text-sm font-bold text-slate-900">{location}</p><p className="mt-1 text-xs text-slate-500">{index + 1} trainer{index ? "s" : ""} available</p><StatusPill tone={index % 2 ? "amber" : "green"}>{index % 2 ? "This week" : "Now"}</StatusPill></div>)}</div></div></Card>
    <Card><h2 className="font-semibold text-slate-950">Assign Training Session</h2><div className="mt-5 space-y-3">{data.trainers.slice(0, 5).map((trainer, index) => <div key={trainer.id} className="rounded-lg border border-slate-100 bg-slate-50 p-4"><div className="flex items-start justify-between gap-3"><div><p className="text-sm font-semibold text-slate-900">{trainer.name}</p><p className="mt-1 text-xs text-slate-500">{trainer.role} - calendar open {new Date(trainer.availableFrom).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</p></div><StatusPill tone={trainer.utilization > 80 ? "amber" : "green"}>{trainer.utilization}% used</StatusPill></div><button className="mt-3 rounded-lg bg-blue-600 px-3 py-2 text-xs font-bold text-white">Check calendar & assign {index === 0 ? "SAFe" : "course"}</button></div>)}</div></Card>
  </div>;
}

function AdminSystemConfig({ connected }: { connected: boolean }) {
  return <div className="grid gap-5 md:grid-cols-2">
    <ConsoleCard title="Access & Roles"><div className="grid grid-cols-2 gap-3 text-sm text-slate-700">{["Admin", "Sales", "Trainer", "Learner"].map((role) => <div key={role} className="rounded-md border border-slate-100 bg-white px-3 py-2 font-semibold shadow-sm">{role}</div>)}</div><p className="mt-5 text-sm text-slate-600">SSO policy required for all internal users</p></ConsoleCard>
    <ConsoleCard title="System Integrations"><ConsoleRow label="Salesforce" value={connected ? "Live" : "Demo"} tone={connected ? "green" : "amber"} /><ConsoleRow label="Repository Sync" value={connected ? "Live" : "Demo"} tone={connected ? "green" : "amber"} /><ConsoleRow label="Finance Export" value={connected ? "Live" : "Demo"} tone={connected ? "green" : "amber"} /><p className="mt-5 text-sm text-slate-600">Moved from dashboard into system config</p></ConsoleCard>
  </div>;
}

function SalesPersona({ data }: { data: DashboardData }) {
  const [view, setView] = useState<SalesView>("dashboard");
  const revenue = data.requests.reduce((sum, item) => sum + item.seats * Number(item.pricePerSeat), 0);
  const seats = data.requests.reduce((sum, item) => sum + item.seats, 0);
  return <ConsoleShell
    role="sales"
    url="taas.cprime.com/sales/dashboard"
    search="Search accounts, quotes, cohorts..."
    active={view}
    onSelect={(id) => setView(id as SalesView)}
    navItems={[
      { id: "dashboard", label: "Dashboard", Icon: Gauge },
      { id: "pipeline", label: "Demand Pipeline", Icon: Activity },
      { id: "quotes", label: "Quote Builder", Icon: CircleDollarSign },
      { id: "crm", label: "CRM", Icon: Database },
      { id: "trainer", label: "Trainer Match", Icon: UserRoundCheck },
      { id: "catalog", label: "Catalog Offers", Icon: BookOpenCheck },
      { id: "collections", label: "Collections", Icon: Banknote },
    ]}
  >
    {view === "dashboard" && <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
      <ConsoleCard title="Demand Pipeline">
        <div>
          {data.requests.map((request) => <div key={request.id} className="flex min-h-10 items-center justify-between gap-3 border-b border-dashed border-slate-200 py-2.5 last:border-0">
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
        <p className="text-5xl font-light leading-none text-slate-950">{money(revenue)}</p>
        <p className="mt-3 text-sm text-slate-600">Current quoted training value</p>
        <div className="mt-3 h-2 rounded-full bg-slate-200"><div className="h-full w-[78%] rounded-full bg-blue-600" /></div>
        <p className="mt-5 text-sm text-slate-600">Weighted forecast: 78%</p>
      </ConsoleCard>

      <ConsoleCard title="CRM">
        <ConsoleRow label="Qualified opportunities" value={`${data.requests.length}`} tone="blue" />
        <ConsoleRow label="Salesforce sync" value={data.connected ? "Live" : "Demo"} tone={data.connected ? "green" : "amber"} />
        <ConsoleRow label="Accounts needing follow-up" value="2" tone="amber" />
        <p className="mt-5 text-sm text-slate-600">CRM owns demand, account notes, and quote stage</p>
      </ConsoleCard>

      <ConsoleCard title="Next Actions">
        <ConsoleRow label="Generate Northstar quote" value="Due" tone="amber" />
        <ConsoleRow label="Confirm Acme trainer match" value="Open" />
        <ConsoleRow label="Send Orbit renewal pack" value="Open" />
        <p className="mt-5 text-sm text-slate-600">Sales agent sorted by customer urgency</p>
      </ConsoleCard>

      <ConsoleCard title="Margin Guardrails">
        <p className="text-5xl font-light leading-none text-slate-950">34%</p>
        <p className="mt-3 text-sm text-slate-600">Projected blended margin</p>
        <div className="mt-3 h-2 rounded-full bg-slate-200"><div className="h-full w-[66%] rounded-full bg-emerald-500" /></div>
        <p className="mt-5 text-sm text-slate-600">Within approved discount guardrail</p>
      </ConsoleCard>

      <ConsoleCard title="Collections">
        <ConsoleRow label="Open invoices" value="$4.2K" tone="amber" />
        <ConsoleRow label="Payment terms accepted" value="6" tone="green" />
        <ConsoleRow label="Renewals this month" value="3" tone="blue" />
        <p className="mt-5 text-sm text-slate-600">One finance follow-up is overdue</p>
      </ConsoleCard>
    </div>}
    {view === "pipeline" && <SalesPipeline data={data} />}
    {view === "quotes" && <SalesQuotes data={data} />}
    {view === "crm" && <SalesCrm data={data} connected={data.connected} />}
    {view === "trainer" && <Card><h2 className="font-semibold text-slate-950">Trainer Match</h2><div className="mt-5 grid gap-3 md:grid-cols-2">{data.trainers.slice(0, 4).map((trainer, index) => <div key={trainer.id} className="rounded-lg border border-slate-100 bg-slate-50 p-4"><div className="flex items-start justify-between gap-3"><div><p className="text-sm font-semibold text-slate-900">{trainer.name}</p><p className="mt-1 text-xs text-slate-500">{trainer.skills.slice(0, 2).join(", ")}</p></div><StatusPill tone={index < 2 ? "green" : "blue"}>{index < 2 ? "Best fit" : "Backup"}</StatusPill></div></div>)}</div></Card>}
    {view === "catalog" && <Card><h2 className="font-semibold text-slate-950">Catalog Offers</h2><div className="mt-5 grid gap-3 md:grid-cols-3">{data.courses.map((course) => <div key={course.id} className="rounded-lg border border-slate-100 bg-slate-50 p-4"><p className="text-sm font-semibold text-slate-900">{course.title}</p><p className="mt-1 text-xs text-slate-500">Package-ready offer - v{course.sourceVersion}</p><button className="mt-4 rounded-lg bg-blue-600 px-3 py-2 text-xs font-bold text-white">Add to quote</button></div>)}</div></Card>}
    {view === "collections" && <Card><h2 className="font-semibold text-slate-950">Collections</h2><div className="mt-5 grid gap-3 md:grid-cols-3"><MetricCard Icon={Banknote} label="Open invoices" value="$4.2K" detail="One invoice needs finance follow-up" tone="bg-amber-50 text-amber-700" /><MetricCard Icon={CheckCircle2} label="Terms accepted" value="6" detail="Approved customer payment terms" tone="bg-emerald-50 text-emerald-700" /><MetricCard Icon={LineChart} label="Renewals" value="3" detail="Accounts renewing this month" tone="bg-blue-50 text-blue-700" /></div></Card>}
  </ConsoleShell>;
}

function SalesPipeline({ data }: { data: DashboardData }) {
  return <Card><h2 className="font-semibold text-slate-950">Demand Pipeline</h2><div className="mt-5 overflow-x-auto"><table className="w-full min-w-[680px] text-left text-sm"><thead><tr className="border-b border-slate-100 text-[10px] uppercase tracking-wider text-slate-400"><th className="pb-3">Customer / Topic</th><th className="pb-3">Mode</th><th className="pb-3">Seats</th><th className="pb-3">Value</th><th className="pb-3">Status</th></tr></thead><tbody>{data.requests.map((request) => <tr key={request.id} className="border-b border-slate-50 last:border-0"><td className="py-4"><p className="font-semibold text-slate-900">{request.customer}</p><p className="mt-1 text-xs text-slate-500">{request.topic}</p></td><td className="py-4 text-slate-600">{request.deliveryMode}</td><td className="py-4 font-semibold">{request.seats}</td><td className="py-4 font-semibold">{money(request.seats * Number(request.pricePerSeat))}</td><td className="py-4"><StatusPill>{request.status}</StatusPill></td></tr>)}</tbody></table></div></Card>;
}

function SalesQuotes({ data }: { data: DashboardData }) {
  return <div className="grid gap-5 md:grid-cols-2"><ConsoleCard title="Quote Builder"><ConsoleRow label="Northstar Financial" value="Ready" tone="green" /><ConsoleRow label="Acme Health" value="Trainer hold" tone="amber" /><ConsoleRow label="Orbit Retail" value="Draft" tone="blue" /><p className="mt-5 text-sm text-slate-600">Content readiness is governed in admin before quote packaging.</p></ConsoleCard><Card><h2 className="font-semibold text-slate-950">Package Options</h2><div className="mt-5 space-y-3">{data.courses.map((course) => <div key={course.id} className="flex items-center justify-between rounded-lg bg-slate-50 p-3"><span className="text-sm font-semibold text-slate-700">{course.title}</span><button className="rounded-lg bg-slate-950 px-3 py-2 text-xs font-bold text-white">Add</button></div>)}</div></Card></div>;
}

function SalesCrm({ data, connected }: { data: DashboardData; connected: boolean }) {
  return <div className="grid gap-5 xl:grid-cols-[.85fr_1fr]"><ConsoleCard title="CRM Health"><ConsoleRow label="Salesforce connection" value={connected ? "Live" : "Demo"} tone={connected ? "green" : "amber"} /><ConsoleRow label="Open opportunities" value={`${data.requests.length}`} tone="blue" /><ConsoleRow label="Stale account notes" value="2" tone="amber" /><p className="mt-5 text-sm text-slate-600">CRM is the sales system of record for request status.</p></ConsoleCard><Card><h2 className="font-semibold text-slate-950">Account Activity</h2><div className="mt-5 space-y-3">{data.requests.map((request, index) => <div key={request.id} className="rounded-lg border border-slate-100 bg-slate-50 p-4"><div className="flex items-start justify-between gap-3"><div><p className="text-sm font-semibold text-slate-900">{request.customer}</p><p className="mt-1 text-xs text-slate-500">{request.topic} - last CRM update {index + 1}d ago</p></div><StatusPill tone={index === 0 ? "amber" : "blue"}>{index === 0 ? "Follow up" : "Synced"}</StatusPill></div></div>)}</div></Card></div>;
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
  const [acceptedId, setAcceptedId] = useState<string | null>(null);
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
        {data.requests.slice(0, 2).map((request, index) => {
          const accepted = acceptedId === request.id;
          return <div key={request.id} className="rounded-lg border border-slate-100 bg-slate-50 p-4">
          <div className="flex items-start justify-between gap-3"><div><p className="text-sm font-semibold text-slate-900">{request.topic}</p><p className="mt-1 text-xs text-slate-500">{request.customer} - {request.deliveryMode}</p></div><StatusPill tone="green">{index === 0 ? "98% fit" : "91% fit"}</StatusPill></div>
          {accepted ? <div className="mt-4 rounded-lg border border-emerald-100 bg-emerald-50 p-3 text-sm text-emerald-800"><p className="font-bold">Accepted - calendar call scheduled</p><p className="mt-1 text-xs leading-5">Outlook invite: kickoff call on Jul 24, 2026 at 10:00 AM with sales, admin, and trainer.</p></div> : <div className="mt-4 flex gap-2"><button onClick={() => setAcceptedId(request.id)} className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-bold text-white">Accept & setup call</button><button className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600">Decline</button></div>}
        </div>;
        })}
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
  const views: { id: LearnerView; label: string; Icon: LucideIcon }[] = [
    { id: "discover", label: "Discover", Icon: Search },
    { id: "catalogue", label: "Catalogue", Icon: Library },
    { id: "generator", label: "Course Generator", Icon: Sparkles },
    { id: "learning", label: "My Learning", Icon: BookOpenCheck },
  ];
  return <div className="relative">
    <div className="grid overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm xl:grid-cols-[240px_1fr]">
      <aside className="border-b border-slate-200 bg-slate-50 p-3 xl:border-b-0 xl:border-r">
        <nav className="flex gap-2 overflow-x-auto xl:block xl:space-y-1">
          {views.map(({ id, label, Icon }) => <button key={id} type="button" onClick={() => setView(id)} className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold xl:w-full ${view === id ? "bg-slate-950 text-white" : "text-slate-600 hover:bg-white"}`}><Icon size={16} />{label}</button>)}
        </nav>
      </aside>
      <div className="min-w-0 bg-[#f8fafc] p-4 md:p-6">
        {view === "discover" && <LearnerDiscover data={data} onGenerate={() => setView("generator")} />}
        {view === "catalogue" && <LearnerCatalogue data={data} />}
        {view === "generator" && <div><SectionTitle eyebrow="Course generator" title="Generate your learning path" description="This is the existing complete course generator, available to learners." /><section className="overflow-hidden rounded-lg bg-[#17233b] text-white shadow-xl"><WorkflowLauncher /></section></div>}
        {view === "learning" && <LearnerLearning data={data} />}
      </div>
    </div>
    <LearnerCopilot />
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
    <div className="mt-4 rounded-lg border border-amber-100 bg-amber-50 p-4 text-sm text-amber-800">
      <p className="font-bold">Nudge: continue in-progress courses</p>
      <p className="mt-1 text-xs leading-5">You have 2 active courses. Complete one module this week to stay on track for your learning goal.</p>
    </div>
    <div className="mt-5 space-y-3">
      {data.courses.slice(0, 3).map((course, index) => <div key={course.id} className="rounded-lg border border-slate-100 bg-slate-50 p-4">
        <div className="flex items-start justify-between gap-3"><div><p className="text-sm font-semibold text-slate-900">{course.title}</p><p className="mt-1 text-xs text-slate-500">{index === 0 ? "72" : index === 1 ? "34" : "12"}% complete</p></div><StatusPill tone={index < 2 ? "amber" : "slate"}>{index < 2 ? "In progress" : "Not started"}</StatusPill></div>
        <div className="mt-3 h-2 rounded-full bg-white"><div className="h-full rounded-full bg-blue-600" style={{ width: `${index === 0 ? 72 : index === 1 ? 34 : 12}%` }} /></div>
      </div>)}
    </div>
  </Card>;
}

function LearnerCatalogue({ data }: { data: DashboardData }) {
  return <div className="space-y-5">
    <SectionTitle eyebrow="Catalogue" title="All courses and recommendations" description="Browse the full catalogue with recommendations based on skills, courses taken, and stated interests." />
    <div className="grid gap-4 md:grid-cols-3">
      {data.courses.map((course, index) => <Card key={course.id}>
        <div className="flex items-start justify-between gap-3"><h3 className="font-semibold text-slate-950">{course.title}</h3><StatusPill tone={index === 0 ? "green" : "blue"}>{index === 0 ? "Recommended" : "Catalogue"}</StatusPill></div>
        <p className="mt-2 text-xs leading-5 text-slate-500">Recommended from your agile interest profile, completed modules, and target role.</p>
        <button className="mt-4 rounded-lg bg-blue-600 px-3 py-2 text-xs font-bold text-white">View course</button>
      </Card>)}
    </div>
  </div>;
}

function LearnerCopilot() {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("Ask me about your current module, lab, or recommended next step.");
  function ask() {
    const trimmed = question.trim();
    if (!trimmed) return;
    setAnswer(`Here is a guided explanation for "${trimmed}". Review the related module, then try the practical lab to reinforce the concept.`);
    setQuestion("");
  }
  return <div className="fixed bottom-5 right-5 z-40">
    {open && <div className="mb-3 w-[min(360px,calc(100vw-2rem))] rounded-lg border border-slate-200 bg-white p-4 shadow-2xl">
      <div className="flex items-center justify-between"><div className="flex items-center gap-2"><div className="grid size-9 place-items-center rounded-lg bg-violet-100 text-violet-700"><Bot size={17} /></div><div><p className="text-sm font-bold text-slate-950">Learner Copilot</p><p className="text-xs text-slate-500">Grounded in approved content</p></div></div><button onClick={() => setOpen(false)} className="text-slate-400">X</button></div>
      <div className="mt-4 min-h-28 rounded-lg bg-slate-50 p-3 text-sm leading-6 text-slate-600">{answer}</div>
      <div className="mt-3 flex gap-2"><input value={question} onChange={(event) => setQuestion(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") ask(); }} className="min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500" placeholder="Ask copilot" /><button onClick={ask} className="grid size-10 place-items-center rounded-lg bg-blue-600 text-white"><Send size={16} /></button></div>
    </div>}
    <button onClick={() => setOpen(!open)} className="flex items-center gap-2 rounded-full bg-slate-950 px-4 py-3 text-sm font-bold text-white shadow-xl"><MessageCircle size={18} />Copilot</button>
  </div>;
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
        <h2 className="font-semibold text-slate-950">Overview: Channel Mix</h2>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {[["Direct enterprise", "54%", "Strategic accounts"], ["Partner channel", "28%", "Resellers and alliances"], ["Marketplace", "18%", "Self-service demand"]].map(([label, value, detail], index) => <div key={label} className="rounded-lg bg-slate-50 p-4"><p className="text-2xl font-semibold text-slate-950">{value}</p><p className="mt-1 text-sm font-semibold text-slate-700">{label}</p><p className="mt-1 text-xs text-slate-500">{detail}</p><div className="mt-3 h-2 rounded-full bg-white"><div className={`h-full rounded-full ${index === 0 ? "w-[54%] bg-blue-600" : index === 1 ? "w-[28%] bg-emerald-500" : "w-[18%] bg-amber-500"}`} /></div></div>)}
        </div>
      </Card>
      <Card>
        <h2 className="font-semibold text-slate-950">Demand & Forecast</h2>
        <div className="mt-5 space-y-3">
          {[["Financial services", "+31%", "SAFe and DevOps modernization"], ["Healthcare", "+18%", "Compliance-ready agile delivery"], ["Retail", "+22%", "Private cohorts and blended learning"], ["Technology", "+27%", "Platform engineering enablement"]].map(([industry, forecast, detail]) => <div key={industry} className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 p-3"><div><p className="text-sm font-semibold text-slate-900">{industry}</p><p className="mt-1 text-xs text-slate-500">{detail}</p></div><span className="rounded-md bg-blue-50 px-3 py-1 text-xs font-extrabold text-blue-700">{forecast}</span></div>)}
        </div>
      </Card>
    </div>
    <div className="grid gap-6 xl:grid-cols-[.9fr_1fr]">
      <Card>
        <h2 className="font-semibold text-slate-950">Market Position</h2>
        <div className="mt-5 space-y-3">
          {[["Cprime TaaS", "Integrated AI + trainer delivery", "Strong"], ["Coursera Business", "Broad catalogue marketplace", "Monitor"], ["Udemy Business", "Low-cost content scale", "Price pressure"], ["Pluralsight", "Technical skill depth", "Compete by vertical solution"]].map(([name, detail, position], index) => <div key={name} className="rounded-lg border border-slate-100 bg-slate-50 p-4"><div className="flex items-start justify-between gap-3"><div><p className="text-sm font-semibold text-slate-900">{name}</p><p className="mt-1 text-xs text-slate-500">{detail}</p></div><StatusPill tone={index === 0 ? "green" : index === 2 ? "amber" : "blue"}>{position}</StatusPill></div></div>)}
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
