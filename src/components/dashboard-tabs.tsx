"use client";

import { useState } from "react";
import {
  Activity, ArrowUpRight, BookOpenCheck, CheckCircle2, ChevronRight,
  CircleDollarSign, Clock3, Database, FileCheck2, Gauge,
  GraduationCap, LayoutDashboard, Library, SearchCheck, Sparkles, Users,
} from "lucide-react";
import { TrainerNetwork } from "@/components/trainer-network";
import { WorkflowLauncher } from "@/components/workflow-launcher";

export type DashboardData = {
  courses: { id: string; title: string; status: string; freshness: number; sourceVersion: string }[];
  requests: { id: string; customer: string; topic: string; seats: number; pricePerSeat: string; deliveryMode: string; status: string }[];
  trainers: { id: string; name: string; role: string; skills: string[]; certifications: string[]; hourlyRate: number; utilization: number; availableFrom: string }[];
  runs: { id: string; agent: string; status: string; summary: string; durationMs: number }[];
  connected: boolean;
};

const tabs = [
  { id: "command-center", label: "Command center", Icon: LayoutDashboard },
  { id: "content-watchdog", label: "Content watchdog", Icon: SearchCheck },
  { id: "course-generator", label: "Course generator", Icon: Library },
  { id: "trainer-network", label: "Trainer network", Icon: Users },
  { id: "learner-portal", label: "Learner portal", Icon: GraduationCap },
  { id: "analytics", label: "Analytics", Icon: Gauge },
] as const;

type TabId = (typeof tabs)[number]["id"];

function Metrics({ data }: { data: DashboardData }) {
  const revenue = data.requests.reduce((sum, item) => sum + item.seats * Number(item.pricePerSeat), 0);
  const cards = [
    [BookOpenCheck, "Course readiness", "12 / 15", "80% launch-ready", "text-blue-600", "bg-blue-50"],
    [Activity, "Active demand", `${data.requests.length} requests`, `${data.requests.reduce((sum, request) => sum + request.seats, 0)} learner seats`, "text-violet-600", "bg-violet-50"],
    [CircleDollarSign, "Pipeline value", `$${(revenue / 1000).toFixed(1)}K`, "Across current requests", "text-emerald-600", "bg-emerald-50"],
    [Clock3, "Manual time saved", "46.5 hrs", "+18% this month", "text-orange-600", "bg-orange-50"],
  ] as const;

  return <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
    {cards.map(([Icon, label, value, sub, color, bg]) => <article key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between"><div className={`grid size-10 place-items-center rounded-xl ${bg} ${color}`}><Icon size={20} /></div><ArrowUpRight size={16} className="text-slate-300" /></div>
      <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</p><p className="mt-1 text-2xl font-bold">{value}</p><p className="mt-1 text-xs text-slate-500">{sub}</p>
    </article>)}
  </section>;
}

function PageHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return <div className="mb-6"><p className="text-xs font-bold uppercase tracking-[.16em] text-blue-600">{eyebrow}</p><h2 className="mt-2 text-2xl font-bold md:text-3xl">{title}</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">{description}</p></div>;
}

export function DashboardTabs({ data }: { data: DashboardData }) {
  const [activeTab, setActiveTab] = useState<TabId>("command-center");
  const [copilotQuestion, setCopilotQuestion] = useState("");
  const [copilotAnswer, setCopilotAnswer] = useState("Ask me about your current module, lab, or recommended next step.");
  const activeLabel = tabs.find((tab) => tab.id === activeTab)?.label ?? "Command center";

  function selectTab(tab: TabId) {
    setActiveTab(tab);
    window.history.replaceState(null, "", `#${tab}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return <main className="min-h-screen bg-[#f5f7fb] text-[#17233b]">
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-72 flex-col bg-[#111d35] px-6 py-8 text-white lg:flex">
      <div className="mb-10 flex items-center gap-3 px-2">
        <div className="grid size-11 place-items-center rounded-xl bg-[#ff5b49] shadow-lg shadow-red-950/30"><Sparkles size={21} /></div>
        <div><p className="text-lg font-bold tracking-tight">Cprime TaaS</p><p className="text-[10px] font-semibold uppercase tracking-[.2em] text-slate-400">Agent operations</p></div>
      </div>
      <nav aria-label="Dashboard sections" role="tablist" className="space-y-1.5">
        {tabs.map(({ id, label, Icon }) => <button key={id} type="button" role="tab" aria-selected={activeTab === id} aria-controls={`${id}-panel`} onClick={() => selectTab(id)} className={`flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-left text-sm font-medium transition ${activeTab === id ? "bg-white/10 text-white shadow-sm" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}><Icon size={18} />{label}</button>)}
      </nav>
      <div className="mt-auto rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="mb-3 flex items-center justify-between"><Database size={18} className="text-emerald-400" /><span className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase ${data.connected ? "bg-emerald-400/15 text-emerald-300" : "bg-amber-400/15 text-amber-300"}`}>{data.connected ? "Live" : "Demo data"}</span></div>
        <p className="text-sm font-semibold">Postgres + pgvector</p><p className="mt-1 text-xs leading-5 text-slate-400">Relational operations and semantic retrieval in one store.</p>
      </div>
    </aside>

    <section className="lg:pl-72">
      <header className="sticky top-0 z-10 flex h-20 items-center justify-between border-b border-slate-200 bg-white/95 px-5 backdrop-blur md:px-8">
        <div><p className="text-xs font-semibold uppercase tracking-[.16em] text-slate-400">Training operations</p><h1 className="text-xl font-bold">{activeLabel}</h1></div>
        <div className="flex items-center gap-3"><span className="hidden rounded-full bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 sm:block">● 6 agents healthy</span><div className="grid size-10 place-items-center rounded-full bg-[#17233b] text-sm font-bold text-white">BR</div></div>
      </header>

      <nav aria-label="Dashboard sections" role="tablist" className="sticky top-20 z-10 flex gap-2 overflow-x-auto border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
        {tabs.map(({ id, label, Icon }) => <button key={id} type="button" role="tab" aria-selected={activeTab === id} onClick={() => selectTab(id)} className={`flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold ${activeTab === id ? "bg-[#17233b] text-white" : "bg-slate-100 text-slate-600"}`}><Icon size={15} />{label}</button>)}
      </nav>

      <div id={`${activeTab}-panel`} role="tabpanel" className="mx-auto max-w-[1500px] p-5 md:p-8">
        {activeTab === "command-center" && <div className="space-y-6">
          <PageHeading eyebrow="Command center" title="Everything moving across training operations" description="Monitor live demand, commercial value, and the latest agent decisions from one place." />
          <Metrics data={data} />
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5"><h3 className="font-bold">End-to-end operating flow</h3><p className="mt-1 text-xs text-slate-500">One governed lifecycle from learning need to continuous improvement</p></div>
            <div className="grid gap-2 md:grid-cols-7">{["Define objective", "Generate course", "Validate sources", "Brand & publish", "Deliver learning", "Capture signals", "Continuously improve"].map((step, index) => <div key={step} className="relative flex items-center gap-2 rounded-xl bg-slate-50 p-3 md:block md:text-center"><span className={`grid size-6 shrink-0 place-items-center rounded-full text-[10px] font-bold text-white ${index < 2 ? "bg-emerald-500" : "bg-blue-600"}`}>{index + 1}</span><p className="text-[11px] font-semibold md:mt-2">{step}</p>{index < 6 && <ChevronRight size={14} className="ml-auto text-slate-300 md:absolute md:-right-2 md:top-5" />}</div>)}</div>
          </section>
          <section className="grid gap-6 xl:grid-cols-[1.35fr_.65fr]">
            <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between"><div><h3 className="font-bold">Demand pipeline</h3><p className="mt-1 text-xs text-slate-500">CRM requests enriched by agent recommendations</p></div><button className="text-xs font-bold text-blue-700">View all</button></div>
              <div className="overflow-x-auto"><table className="w-full min-w-[650px] text-left text-sm"><thead><tr className="border-b border-slate-100 text-[10px] uppercase tracking-wider text-slate-400"><th className="pb-3 font-semibold">Customer / topic</th><th className="pb-3 font-semibold">Mode</th><th className="pb-3 font-semibold">Seats</th><th className="pb-3 font-semibold">Value</th><th className="pb-3 font-semibold">Status</th></tr></thead><tbody>{data.requests.map((request) => <tr key={request.id} className="border-b border-slate-50 last:border-0"><td className="py-4"><p className="font-semibold">{request.customer}</p><p className="mt-0.5 text-xs text-slate-500">{request.topic}</p></td><td className="py-4 text-slate-600">{request.deliveryMode}</td><td className="py-4 font-semibold">{request.seats}</td><td className="py-4 font-semibold">${(request.seats * Number(request.pricePerSeat)).toLocaleString()}</td><td className="py-4"><span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold uppercase text-blue-700">{request.status}</span></td></tr>)}</tbody></table></div>
            </article>
            <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5"><h3 className="font-bold">Agent activity</h3><p className="mt-1 text-xs text-slate-500">Latest orchestration events</p></div>
              <div className="space-y-5">{data.runs.map((run, index) => <div key={run.id} className="flex gap-3"><div className={`mt-0.5 grid size-8 shrink-0 place-items-center rounded-full ${run.status === "attention" ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"}`}>{run.status === "attention" ? <SearchCheck size={15} /> : <CheckCircle2 size={15} />}</div><div className="min-w-0"><div className="flex items-center gap-2"><p className="truncate text-sm font-semibold">{run.agent}</p><span className="text-[10px] text-slate-400">{index * 13 + 4}m</span></div><p className="mt-1 text-xs leading-5 text-slate-500">{run.summary}</p></div></div>)}</div>
            </article>
          </section>
        </div>}

        {activeTab === "content-watchdog" && <div>
          <PageHeading eyebrow="Content watchdog" title="Keep every course current and approved" description="Compare repository assets against source certifications and focus review work where freshness has dropped." />
          <div className="space-y-6"><article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8"><div className="mb-7 flex items-center justify-between"><div><h3 className="text-lg font-bold">Content freshness</h3><p className="mt-1 text-sm text-slate-500">Approved repository assets versus source versions</p></div><div className="grid size-11 place-items-center rounded-xl bg-blue-50 text-blue-600"><FileCheck2 size={21} /></div></div><div className="grid gap-5 lg:grid-cols-2">{data.courses.map((course) => <div key={course.id} className="rounded-2xl border border-slate-100 p-5"><div className="mb-3 flex justify-between gap-3"><div><p className="font-semibold">{course.title}</p><p className="mt-1 text-xs text-slate-400">Source v{course.sourceVersion} · {course.status}</p></div><span className={`text-lg font-bold ${course.freshness < 80 ? "text-amber-600" : "text-emerald-600"}`}>{course.freshness}%</span></div><div className="h-2.5 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full ${course.freshness < 80 ? "bg-amber-400" : "bg-emerald-500"}`} style={{ width: `${course.freshness}%` }} /></div></div>)}</div></article>
          <section className="grid gap-4 md:grid-cols-3">{[["Approved sources", "SAFe · Scrum · GitLab", "4 sources monitored"], ["Repository sync", "Branding and metadata", "12 assets synchronized"], ["Review workflow", "Version and syllabus changes", "1 item needs approval"]].map(([title, detail, status], index) => <article key={title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className={`mb-4 grid size-9 place-items-center rounded-lg ${index === 2 ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"}`}>{index === 0 ? <SearchCheck size={18} /> : index === 1 ? <Database size={18} /> : <FileCheck2 size={18} />}</div><h3 className="text-sm font-bold">{title}</h3><p className="mt-1 text-xs text-slate-500">{detail}</p><p className="mt-4 text-[11px] font-bold text-blue-700">{status}</p></article>)}</section></div>
        </div>}

        {activeTab === "course-generator" && <div>
          <PageHeading eyebrow="Course generator" title="Turn a learning request into a launch-ready course" description="Coordinate curriculum, trainer fit, delivery format, and profitability through one governed agent workflow." />
          <section className="overflow-hidden rounded-3xl bg-[#17233b] text-white shadow-xl shadow-slate-200"><WorkflowLauncher /></section>
        </div>}

        {activeTab === "trainer-network" && <div>
          <PageHeading eyebrow="Trainer network" title="Find the right expert for every engagement" description="Review availability, specialist skills, rates, and current utilization across the trainer network." />
          <TrainerNetwork trainers={data.trainers} />
        </div>}

        {activeTab === "learner-portal" && <div>
          <PageHeading eyebrow="Learner portal" title="A focused home for every learner" description="Browse approved courses, track progress, and continue learning with grounded support." />
          <div className="grid gap-6 xl:grid-cols-[1.1fr_.9fr]"><section className="rounded-3xl bg-gradient-to-br from-[#17233b] to-[#263b63] p-7 text-white shadow-xl md:p-10"><div className="flex h-full flex-col justify-between gap-8"><div><span className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-blue-100"><GraduationCap size={14} /> Learning in progress</span><h3 className="text-2xl font-bold">Continue your learning journey</h3><p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">Your approved courses, progress, and learner copilot are ready whenever you are.</p></div><div className="rounded-2xl bg-white p-5 text-[#17233b] shadow-xl"><div className="flex items-center gap-4"><div className="grid size-12 place-items-center rounded-xl bg-blue-100 text-blue-700"><BookOpenCheck size={22} /></div><div className="flex-1"><p className="text-sm font-bold">ICAgile Foundations</p><p className="mt-1 text-xs text-slate-500">Next: Agile mindset</p></div></div><div className="mt-5 h-2 rounded-full bg-slate-200"><div className="h-2 w-2/3 rounded-full bg-blue-600" /></div><div className="mt-2 flex justify-between text-[11px] text-slate-500"><span>68% complete</span><span>4 modules left</span></div><button className="mt-5 w-full rounded-xl bg-[#17233b] px-4 py-3 text-sm font-bold text-white">Continue course</button></div></div></section>
          <section className="flex flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex items-center gap-3"><div className="grid size-10 place-items-center rounded-xl bg-violet-100 text-violet-700"><Sparkles size={19} /></div><div><h3 className="font-bold">Learner Copilot</h3><p className="text-xs text-slate-500">Grounded in approved course content</p></div></div><div className="mt-5 flex-1 rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">{copilotAnswer}</div><div className="mt-4 flex gap-2"><input value={copilotQuestion} onChange={(event) => setCopilotQuestion(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && copilotQuestion.trim()) { setCopilotAnswer(`Here is a guided explanation for “${copilotQuestion.trim()}”. Review the related module, then try the practical lab to reinforce the concept.`); setCopilotQuestion(""); } }} className="min-w-0 flex-1 rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500" placeholder="Ask about a concept or lab" /><button onClick={() => { if (copilotQuestion.trim()) { setCopilotAnswer(`Here is a guided explanation for “${copilotQuestion.trim()}”. Review the related module, then try the practical lab to reinforce the concept.`); setCopilotQuestion(""); } }} className="rounded-xl bg-blue-600 px-4 text-sm font-bold text-white">Ask</button></div><p className="mt-3 text-[10px] text-slate-400">Complex questions can be escalated to a trainer or SME.</p></section></div>
        </div>}

        {activeTab === "analytics" && <div className="space-y-6">
          <PageHeading eyebrow="Analytics" title="Measure operational impact" description="Track readiness, demand, pipeline value, and time returned to your team by automation." />
          <Metrics data={data} />
          <section className="grid gap-6 lg:grid-cols-2"><article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><h3 className="font-bold">Readiness by course</h3><p className="mt-1 text-xs text-slate-500">Current freshness and publishing confidence</p><div className="mt-6 space-y-5">{data.courses.map((course) => <div key={course.id}><div className="mb-2 flex justify-between text-sm"><span className="font-medium">{course.title}</span><span className="font-bold">{course.freshness}%</span></div><div className="h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-blue-600" style={{ width: `${course.freshness}%` }} /></div></div>)}</div></article><article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><h3 className="font-bold">Agent performance</h3><p className="mt-1 text-xs text-slate-500">Latest completed orchestration times</p><div className="mt-6 space-y-4">{data.runs.map((run) => <div key={run.id} className="flex items-center justify-between rounded-xl bg-slate-50 p-4"><div><p className="text-sm font-semibold">{run.agent}</p><p className="mt-1 text-xs text-slate-500">{run.status}</p></div><span className="text-sm font-bold text-blue-700">{(run.durationMs / 1000).toFixed(1)}s</span></div>)}</div></article></section>
        </div>}
      </div>
    </section>
  </main>;
}
