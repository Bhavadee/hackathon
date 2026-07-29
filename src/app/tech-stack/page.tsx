import type { Metadata } from "next";
import {
  Bot,
  Boxes,
  BrainCircuit,
  BookOpenCheck,
  Briefcase,
  CalendarDays,
  Cloud,
  Code2,
  Container,
  Cpu,
  Database,
  FileCheck2,
  GitBranch,
  GraduationCap,
  Layers3,
  LockKeyhole,
  MonitorSmartphone,
  Network,
  Route,
  ServerCog,
  ShieldCheck,
  Sparkles,
  UserRoundCheck,
  Users,
  Workflow,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "Tech Stack | Cprime TaaS",
  description: "Technology stack and architecture view for the Cprime TaaS prototype.",
};

type StackItem = {
  title: string;
  detail: string;
  Icon: LucideIcon;
  tone: string;
};

const stackGroups: { title: string; eyebrow: string; items: StackItem[] }[] = [
  {
    eyebrow: "Experience layer",
    title: "Role-based training operations UI",
    items: [
      {
        title: "Next.js 16 App Router",
        detail: "Server-rendered pages, route handlers, metadata, and standalone production output.",
        Icon: Route,
        tone: "bg-blue-50 text-blue-700 border-blue-100",
      },
      {
        title: "React 19 + TypeScript",
        detail: "Typed components for admin, sales, trainer, learner, and executive workflows.",
        Icon: Code2,
        tone: "bg-emerald-50 text-emerald-700 border-emerald-100",
      },
      {
        title: "Tailwind CSS 4",
        detail: "Responsive command-center layouts, dashboard cards, roadmaps, and operational views.",
        Icon: Layers3,
        tone: "bg-amber-50 text-amber-700 border-amber-100",
      },
      {
        title: "Lucide React",
        detail: "Consistent iconography for dashboards, workflow controls, and status indicators.",
        Icon: Sparkles,
        tone: "bg-rose-50 text-rose-700 border-rose-100",
      },
    ],
  },
  {
    eyebrow: "Application intelligence",
    title: "AI orchestration and validation",
    items: [
      {
        title: "OpenAI Responses API",
        detail: "Generates course blueprints, curator packs, teaching notes, and learning roadmaps.",
        Icon: BrainCircuit,
        tone: "bg-violet-50 text-violet-700 border-violet-100",
      },
      {
        title: "Zod schemas",
        detail: "Validates structured AI output before it reaches trainer and learner workflows.",
        Icon: FileCheck2,
        tone: "bg-cyan-50 text-cyan-700 border-cyan-100",
      },
      {
        title: "Local fallback engine",
        detail: "Keeps demos usable when OpenAI credentials or network access are unavailable.",
        Icon: Bot,
        tone: "bg-slate-100 text-slate-700 border-slate-200",
      },
      {
        title: "Agent workflows",
        detail: "Certification watch, trainer matching, repository sync, and content curation flows.",
        Icon: Workflow,
        tone: "bg-orange-50 text-orange-700 border-orange-100",
      },
    ],
  },
  {
    eyebrow: "Data foundation",
    title: "Operational data and semantic retrieval",
    items: [
      {
        title: "PostgreSQL 17",
        detail: "Stores courses, requests, trainers, agent runs, and seeded hackathon records.",
        Icon: Database,
        tone: "bg-indigo-50 text-indigo-700 border-indigo-100",
      },
      {
        title: "pgvector",
        detail: "Supports cosine similarity search over knowledge chunks and trainer profiles.",
        Icon: Network,
        tone: "bg-lime-50 text-lime-700 border-lime-100",
      },
      {
        title: "Parameterized SQL",
        detail: "Uses the pg driver with placeholders and shared query helpers.",
        Icon: ShieldCheck,
        tone: "bg-teal-50 text-teal-700 border-teal-100",
      },
      {
        title: "Environment controls",
        detail: "Server-only database, model, embedding, and API-key configuration.",
        Icon: LockKeyhole,
        tone: "bg-red-50 text-red-700 border-red-100",
      },
    ],
  },
  {
    eyebrow: "Delivery layer",
    title: "Containerized local and demo deployment",
    items: [
      {
        title: "Docker Compose",
        detail: "Runs the web app and pgvector database as a repeatable local stack.",
        Icon: Container,
        tone: "bg-sky-50 text-sky-700 border-sky-100",
      },
      {
        title: "Standalone Next build",
        detail: "Packages the production server with Next.js standalone output.",
        Icon: ServerCog,
        tone: "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-100",
      },
      {
        title: "Seed SQL",
        detail: "Initializes schema, vector columns, indexes, and demonstration data.",
        Icon: Boxes,
        tone: "bg-yellow-50 text-yellow-800 border-yellow-100",
      },
      {
        title: "Git-ready source",
        detail: "Keeps the prototype portable for review, demos, and future deployment.",
        Icon: GitBranch,
        tone: "bg-stone-100 text-stone-700 border-stone-200",
      },
    ],
  },
];

const flow = [
  "Persona user",
  "Next.js page",
  "Route handler",
  "AI + Zod",
  "PostgreSQL + pgvector",
  "Validated output",
];

const personaNodes = [
  { label: "Admin", Icon: ShieldCheck, color: "bg-blue-50 text-blue-700 border-blue-100" },
  { label: "Sales", Icon: Users, color: "bg-emerald-50 text-emerald-700 border-emerald-100" },
  { label: "Trainer", Icon: UserRoundCheck, color: "bg-amber-50 text-amber-700 border-amber-100" },
  { label: "Learner", Icon: GraduationCap, color: "bg-violet-50 text-violet-700 border-violet-100" },
];

const coreTechNodes = [
  { label: "OpenAI", Icon: BrainCircuit, color: "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-100" },
  { label: "PostgreSQL", Icon: Database, color: "bg-indigo-50 text-indigo-700 border-indigo-100" },
  { label: "pgvector", Icon: Network, color: "bg-lime-50 text-lime-700 border-lime-100" },
];

const platformNodes = [
  { label: "Next.js App Router", Icon: Route },
  { label: "React dashboards", Icon: MonitorSmartphone },
  { label: "API route handlers", Icon: ServerCog },
  { label: "Typed validation", Icon: FileCheck2 },
];

const engineNodes = [
  { label: "Salesforce Training Cloud", detail: "Training catalog, learners, users, orders and bookings are the system of record", Icon: Briefcase, color: "border-blue-100 bg-blue-50 text-blue-700" },
  { label: "SharePoint Cprime Academy", detail: "Course files, syllabi, decks and update detection for automation workflows", Icon: Boxes, color: "border-cyan-100 bg-cyan-50 text-cyan-700" },
  { label: "Microsoft 365", detail: "Teams channels, Outlook calendar, mail notifications and meeting links", Icon: CalendarDays, color: "border-amber-100 bg-amber-50 text-amber-700" },
  { label: "Cprime Instructor Platform", detail: "Instructor roster, delivery notes, past sessions and trainer documentation", Icon: UserRoundCheck, color: "border-emerald-100 bg-emerald-50 text-emerald-700" },
  { label: "Cprime Training API", detail: "Course catalog, session, booking and learner feedback endpoints for platform services", Icon: ServerCog, color: "border-rose-100 bg-rose-50 text-rose-700" },
  { label: "Course Update Webhooks", detail: "SharePoint course changes trigger admin/trainer alerts and automation mailer drafts", Icon: Workflow, color: "border-orange-100 bg-orange-50 text-orange-700" },
  { label: "OpenAI", detail: "Course generation, summaries, curation, learning copilot", Icon: BrainCircuit, color: "border-fuchsia-100 bg-fuchsia-50 text-fuchsia-700" },
  { label: "PostgreSQL + pgvector", detail: "TaaS operational store and semantic retrieval index", Icon: Database, color: "border-indigo-100 bg-indigo-50 text-indigo-700" },
];

const integrationFlows = [
  { initials: "SF", system: "Salesforce Training Cloud", summary: "Training catalog, learners, users, orders and bookings are the system of record", sends: "Training catalog, learners, users, orders and bookings", receives: "Readiness score, trainer match, margin signal and booking status" },
  { initials: "SP", system: "SharePoint Cprime Academy", summary: "Course files, syllabi, decks and update detection for automation workflows", sends: "Course files, syllabi, decks and content change events", receives: "Generated packs, review notes and versioned course outputs" },
  { initials: "MS", system: "Microsoft 365", summary: "Teams channels, class collaboration spaces, Outlook calendar, mail notifications and meeting links", sends: "Trainer channels, collaboration spaces, availability, booking holds and mailbox signals", receives: "Class rooms, kickoff links, calendar holds, trainer alerts and admin mailer drafts" },
  { initials: "IP", system: "Cprime Instructor Platform", summary: "Instructor roster, delivery notes, past sessions and trainer documentation", sends: "Instructor roster, delivery notes, past sessions and documentation", receives: "Assignments, prep notes, utilization updates and delivery records" },
  { initials: "API", system: "Cprime Training API", summary: "Course catalog, session, booking and learner feedback endpoints for platform services", sends: "Course, session, booking and learner feedback endpoints", receives: "Generated module metadata, session updates and feedback summaries" },
  { initials: "WH", system: "Course Update Webhooks", summary: "SharePoint course changes trigger admin/trainer alerts and automation mailer drafts", sends: "SharePoint course-change triggers", receives: "Admin/trainer alerts and automation mailer drafts" },
];

function StackCard({ item }: { item: StackItem }) {
  return (
    <div className={`rounded-lg border p-4 shadow-sm ${item.tone}`}>
      <div className="flex items-start gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-white/75">
          <item.Icon size={19} />
        </span>
        <div>
          <h3 className="text-sm font-bold text-slate-950">{item.title}</h3>
          <p className="mt-1 text-xs leading-5 text-slate-600">{item.detail}</p>
        </div>
      </div>
    </div>
  );
}

function VisualArchitectureDiagram() {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm md:p-6">
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[.16em] text-blue-600">Architecture diagram</p>
          <h2 className="mt-1 text-2xl font-semibold text-slate-950">How TaaS connects with enterprise systems</h2>
        </div>
        <div className="flex flex-wrap gap-2 text-[11px] font-bold text-slate-600">
          <span className="rounded-md bg-blue-50 px-2.5 py-1.5 text-blue-700">UI</span>
          <span className="rounded-md bg-violet-50 px-2.5 py-1.5 text-violet-700">AI</span>
          <span className="rounded-md bg-emerald-50 px-2.5 py-1.5 text-emerald-700">Data</span>
          <span className="rounded-md bg-sky-50 px-2.5 py-1.5 text-sky-700">Integrations</span>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[.88fr_1.1fr_1fr]">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-2">
            <Users size={18} className="text-slate-700" />
            <h3 className="text-sm font-black uppercase tracking-[.12em] text-slate-700">Users</h3>
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
            {personaNodes.map(({ label, Icon, color }) => (
              <div key={label} className={`flex items-center gap-3 rounded-lg border px-3 py-3 ${color}`}>
                <span className="grid size-9 place-items-center rounded-lg bg-white/80">
                  <Icon size={17} />
                </span>
                <span className="text-sm font-bold text-slate-950">{label} portal</span>
              </div>
            ))}
          </div>
          <div className="mt-5 border-t border-slate-200 pt-4">
            <div className="flex items-center gap-2">
              <Cpu size={16} className="text-slate-600" />
              <h4 className="text-xs font-black uppercase tracking-[.14em] text-slate-500">Core tech used</h4>
            </div>
            <div className="mt-3 grid gap-2">
              {coreTechNodes.map(({ label, Icon, color }) => (
                <div key={label} className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 ${color}`}>
                  <span className="grid size-8 place-items-center rounded-lg bg-white/80">
                    <Icon size={15} />
                  </span>
                  <span className="text-xs font-bold text-slate-950">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative rounded-lg border-2 border-slate-900 bg-[#17233b] p-4 text-white shadow-[6px_6px_0_#cbd5e1]">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[.16em] text-blue-100">Core platform</p>
              <h3 className="mt-1 text-2xl font-semibold">Cprime TaaS Web App</h3>
            </div>
            <span className="grid size-12 place-items-center rounded-lg bg-white text-slate-950">
              <Cloud size={22} />
            </span>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {platformNodes.map(({ label, Icon }) => (
              <div key={label} className="rounded-lg border border-white/10 bg-white/[.08] p-3">
                <Icon size={18} className="text-[#ff8b7e]" />
                <p className="mt-2 text-sm font-bold">{label}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-lg border border-white/10 bg-white/[.08] p-4">
            <div className="flex items-center gap-2 text-sm font-bold">
              <BookOpenCheck size={18} className="text-emerald-300" />
              TaaS outputs
            </div>
            <p className="mt-2 text-xs leading-5 text-slate-200">
              Sales readiness, trainer matches, course packs, learning paths, certification watch alerts, and executive insights.
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-2">
            <Cpu size={18} className="text-slate-700" />
            <h3 className="text-sm font-black uppercase tracking-[.12em] text-slate-700">Connected systems</h3>
          </div>
          <div className="mt-4 grid max-h-[520px] gap-3 overflow-y-auto pr-1">
            {engineNodes.map(({ label, detail, Icon, color }) => (
              <div key={label} className={`rounded-lg border p-3 ${color}`}>
                <div className="flex items-center gap-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-white/80">
                    <Icon size={17} />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-slate-950">{label}</p>
                    <p className="mt-0.5 text-xs font-semibold text-slate-600">{detail}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-5">
        {["Request", "Route handler", "AI or data call", "Validated response", "Dashboard result"].map((step, index) => (
          <div key={step} className="relative rounded-lg border border-slate-200 bg-slate-50 p-3 text-center">
            <span className="mx-auto grid size-7 place-items-center rounded-full bg-slate-950 text-xs font-black text-white">{index + 1}</span>
            <p className="mt-2 text-xs font-bold text-slate-700">{step}</p>
            {index < 4 && <div className="hidden md:block absolute left-full top-1/2 h-0.5 w-3 bg-slate-300" />}
          </div>
        ))}
      </div>
    </section>
  );
}

function IntegrationMap() {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm md:p-6">
      <div className="mb-5">
        <p className="text-xs font-black uppercase tracking-[.16em] text-blue-600">Integration tech stack</p>
        <h2 className="mt-1 text-2xl font-semibold text-slate-950">System integrations</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
          TaaS sits in the middle as the orchestration layer. It pulls business, content, learner, trainer, and calendar signals from enterprise systems, then pushes back generated actions and decisions.
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200">
        {integrationFlows.map((flowItem) => (
          <div key={flowItem.system} className="grid gap-3 border-b border-slate-200 bg-white p-4 last:border-b-0 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,.9fr)_minmax(0,.9fr)_90px] lg:items-center">
            <div className="flex min-w-0 items-center gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-lg border border-slate-200 bg-slate-50 text-sm font-bold text-slate-950">
                {flowItem.initials}
              </span>
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-slate-950">{flowItem.system}</h3>
                <p className="mt-1 text-xs leading-5 text-slate-500">{flowItem.summary}</p>
              </div>
            </div>
            <div className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-2">
              <p className="text-[10px] font-black uppercase tracking-[.14em] text-blue-700">Sends</p>
              <p className="mt-1 text-xs font-semibold leading-5 text-slate-700">{flowItem.sends}</p>
            </div>
            <div className="rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-2">
              <p className="text-[10px] font-black uppercase tracking-[.14em] text-emerald-700">Returns</p>
              <p className="mt-1 text-xs font-semibold leading-5 text-slate-700">{flowItem.receives}</p>
            </div>
            <div className="justify-self-start rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 lg:justify-self-end">
              Connected
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ArchitectureBand({
  label,
  summary,
  items,
  accent,
}: {
  label: string;
  summary: string;
  items: string[];
  accent: string;
}) {
  return (
    <div className="relative rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className={`absolute left-0 top-4 h-12 w-1 rounded-r ${accent}`} />
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[.16em] text-slate-400">{label}</p>
          <h3 className="mt-1 text-base font-bold text-slate-950">{summary}</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {items.map((item) => (
            <span key={item} className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-[11px] font-bold text-slate-600">
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function TechStackPage() {
  return (
    <main className="min-h-screen bg-[#f5f7fb] text-[#17233b]">
      <section className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:py-10">
        <div className="grid gap-6 border-b border-slate-200 pb-8 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[.18em] text-blue-600">Cprime TaaS prototype</p>
            <h1 className="mt-3 max-w-4xl text-4xl font-semibold text-slate-950 md:text-5xl">
              Tech stack for AI-powered training operations
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-600">
              The solution combines a role-based Next.js experience, OpenAI-powered course generation, structured validation, PostgreSQL operations data, pgvector search, and a Dockerized demo environment.
            </p>
          </div>
          <div className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-2">
            <div className="rounded-lg bg-blue-50 p-4">
              <p className="text-xs font-black uppercase tracking-[.14em] text-blue-700">What is tech stack?</p>
              <p className="mt-2 text-sm font-semibold leading-6 text-slate-800">
                The tools, frameworks, services, and database used to build and run the solution.
              </p>
            </div>
            <div className="rounded-lg bg-emerald-50 p-4">
              <p className="text-xs font-black uppercase tracking-[.14em] text-emerald-700">What is architecture?</p>
              <p className="mt-2 text-sm font-semibold leading-6 text-slate-800">
                The way users, UI, APIs, AI, data, and deployment pieces connect together.
              </p>
            </div>
          </div>
        </div>

        <section className="py-8">
          <VisualArchitectureDiagram />
        </section>

        <section className="pb-8">
          <IntegrationMap />
        </section>

        <section className="py-8">
          <div className="mb-5 flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-lg bg-slate-950 text-white">
              <Cloud size={20} />
            </span>
            <div>
              <p className="text-xs font-black uppercase tracking-[.16em] text-slate-400">Pictorial representation</p>
              <h2 className="text-2xl font-semibold text-slate-950">Layered architecture</h2>
            </div>
          </div>

          <div className="grid gap-4">
            <ArchitectureBand
              label="01. User experience"
              summary="Persona dashboards and learning journeys"
              items={["Admin", "Sales", "Trainer", "Learner", "Executive"]}
              accent="bg-blue-500"
            />
            <ArchitectureBand
              label="02. Web application"
              summary="Next.js App Router with React components and route handlers"
              items={["Server pages", "Client dashboards", "API routes", "Tailwind UI"]}
              accent="bg-emerald-500"
            />
            <ArchitectureBand
              label="03. AI orchestration"
              summary="Structured generation for courses, curation packs, and roadmap outputs"
              items={["OpenAI Responses", "Zod validation", "Fallback AI", "Agent workflows"]}
              accent="bg-violet-500"
            />
            <ArchitectureBand
              label="04. Data and search"
              summary="Relational operations store plus semantic retrieval"
              items={["PostgreSQL", "pgvector", "HNSW indexes", "Parameterized SQL"]}
              accent="bg-amber-500"
            />
            <ArchitectureBand
              label="05. Runtime"
              summary="Repeatable local demo and production packaging"
              items={["Dockerfile", "Compose", "Seed SQL", "Standalone build"]}
              accent="bg-rose-500"
            />
          </div>
        </section>

        <section className="grid gap-6 py-4 lg:grid-cols-[.95fr_1.05fr]">
          <div>
            <p className="text-xs font-black uppercase tracking-[.16em] text-blue-600">End-to-end flow</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950">How a request moves through the stack</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              A persona action starts in the browser, moves through Next.js route handlers, calls AI services when configured, validates structured output, reads or writes operational data, and returns a ready-to-use training asset.
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <div className="grid gap-3 md:grid-cols-6">
              {flow.map((item, index) => (
                <div key={item} className="relative">
                  <div className="grid min-h-24 place-items-center rounded-lg border border-slate-200 bg-slate-50 p-3 text-center text-xs font-black text-slate-700">
                    {item}
                  </div>
                  {index < flow.length - 1 && (
                    <div className="hidden md:block absolute left-[calc(100%-1px)] top-1/2 h-0.5 w-3 bg-slate-300" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-6 py-8">
          {stackGroups.map((group) => (
            <div key={group.title}>
              <div className="mb-3">
                <p className="text-xs font-black uppercase tracking-[.16em] text-slate-400">{group.eyebrow}</p>
                <h2 className="mt-1 text-xl font-semibold text-slate-950">{group.title}</h2>
              </div>
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                {group.items.map((item) => (
                  <StackCard key={item.title} item={item} />
                ))}
              </div>
            </div>
          ))}
        </section>
      </section>
    </main>
  );
}
