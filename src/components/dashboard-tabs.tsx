"use client";

import { useState } from "react";
import {
  ArrowUpRight,
  BadgeCheck,
  Banknote,
  CalendarDays,
  Gauge,
  GraduationCap,
  Library,
  LineChart,
  Network,
  Settings2,
  Sparkles,
  UserRoundCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { TrainerNetwork } from "@/components/trainer-network";

export type DashboardData = {
  courses: { id: string; title: string; status: string; freshness: number; sourceVersion: string }[];
  requests: { id: string; customer: string; topic: string; seats: number; pricePerSeat: string; deliveryMode: string; status: string }[];
  trainers: { id: string; name: string; role: string; skills: string[]; certifications: string[]; hourlyRate: number; utilization: number; availableFrom: string }[];
  runs: { id: string; agent: string; status: string; summary: string; durationMs: number }[];
  connected: boolean;
};

type CuratorPack = {
  readinessSummary: string;
  aiInputs: string[];
  teachingStructure: { step: string; purpose: string; trainerAction: string; duration: string }[];
  trainerNotes: string[];
  classroomPrompts: string[];
  materials: { name: string; use: string }[];
  riskChecks: string[];
  smeReviewNotice: string;
};

type CuratorResponse = {
  mode: "openai" | "taas";
  model: string;
  notice?: string;
  pack: CuratorPack;
};

type PersonaId = "admin" | "sales" | "trainer" | "learner" | "executive";
type TrainerView = "home" | "network" | "curator" | "content";

const personas: { id: PersonaId; label: string; title: string; description: string; Icon: LucideIcon }[] = [
  { id: "admin", label: "Admin", title: "Governance and Operations Console", description: "Control content freshness, role access, catalog standards, and system integrations.", Icon: Settings2 },
  { id: "sales", label: "Sales", title: "Demand, Quoting, and Collections Portal", description: "Validate readiness, model margin, package offers, and track quote-to-cash.", Icon: Banknote },
  { id: "trainer", label: "Trainer", title: "Assignment and Delivery Portal", description: "Manage availability, assignments, current content, and course creation workflows.", Icon: UserRoundCheck },
  { id: "learner", label: "Learner", title: "Discovery, Learning, and Copilot Portal", description: "Generate a learning path, continue modules, and ask grounded learning questions.", Icon: GraduationCap },
  { id: "executive", label: "Executive", title: "Analytics and Orchestration Dashboard", description: "Track demand, margin, operating health, and agent impact across TaaS.", Icon: Gauge },
];

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

function PrototypeFrame({ src, title }: { src: string; title: string }) {
  return <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
    <iframe
      title={title}
      src={src}
      className="block h-[calc(100vh-168px)] min-h-[760px] w-full border-0 bg-white"
    />
  </section>;
}

function AdminPersona({ data }: { data: DashboardData }) {
  void data;
  return <PrototypeFrame src="/personas/taas_admin_view.html?v=20260727-reference-global-map" title="Admin console" />;
}

function SalesPersona({ data }: { data: DashboardData }) {
  void data;
  return <PrototypeFrame src="/personas/taas_sales_view.html" title="Sales console" />;
}

function TrainerAvailabilityCard() {
  type SlotStatus = "class" | "full" | "hold" | "open" | "off";
  const slots: { day: number; weekday: string; status: SlotStatus; label: string; detail: string }[] = [
    { day: 1, weekday: "Sat", status: "full", label: "Full", detail: "Private Agile cohort is fully booked." },
    { day: 2, weekday: "Sun", status: "class", label: "Class", detail: "Northstar SAFe DevOps class at 10:00 AM." },
    { day: 3, weekday: "Mon", status: "open", label: "Open", detail: "Best day to accept a remote class." },
    { day: 4, weekday: "Tue", status: "full", label: "Full", detail: "Two delivery blocks and prep time are already booked." },
    { day: 5, weekday: "Wed", status: "full", label: "Full", detail: "No more teaching capacity available." },
    { day: 6, weekday: "Thu", status: "open", label: "Open", detail: "Available for instructor-led or blended delivery." },
    { day: 7, weekday: "Fri", status: "hold", label: "Hold", detail: "Admin hold pending for Acme Health." },
    { day: 8, weekday: "Sat", status: "open", label: "Open", detail: "Available for a half-day workshop." },
    { day: 9, weekday: "Sun", status: "off", label: "Off", detail: "No class scheduled." },
    { day: 10, weekday: "Mon", status: "class", label: "Class", detail: "GitLab CI/CD private cohort at 2:00 PM." },
    { day: 11, weekday: "Tue", status: "open", label: "Open", detail: "Recommended date for a new class." },
    { day: 12, weekday: "Wed", status: "full", label: "Full", detail: "Certification workshop and office hours booked." },
    { day: 13, weekday: "Thu", status: "open", label: "Open", detail: "Available for a client kickoff or delivery." },
    { day: 14, weekday: "Fri", status: "hold", label: "Hold", detail: "Tentative calendar hold for Orbit Retail." },
  ];
  const [selectedDay, setSelectedDay] = useState(2);
  const selected = slots.find((slot) => slot.day === selectedDay) ?? slots[0];
  const styles = {
    class: "border-blue-200 bg-blue-50 text-blue-800",
    full: "border-red-200 bg-red-50 text-red-700",
    hold: "border-amber-200 bg-amber-50 text-amber-800",
    open: "border-emerald-200 bg-emerald-50 text-emerald-800",
    off: "border-slate-200 bg-slate-50 text-slate-400",
  } satisfies Record<SlotStatus, string>;

  return <Card>
    <div className="flex items-start justify-between">
      <div className="grid size-10 place-items-center rounded-lg bg-emerald-50 text-emerald-700"><CalendarDays size={19} /></div>
      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-700">5 open days</span>
    </div>
    <p className="mt-5 text-xs font-bold uppercase tracking-wider text-slate-400">Availability</p>
    <div className="mt-1 flex items-end justify-between gap-3">
      <p className="text-2xl font-semibold tracking-tight text-slate-950">Calendar</p>
      <p className="text-xs font-semibold text-slate-500">Aug 1-14</p>
    </div>
    <div className="mt-4 grid grid-cols-7 gap-1.5">
      {slots.map((slot) => (
        <button
          key={slot.day}
          type="button"
          onClick={() => setSelectedDay(slot.day)}
          aria-label={`Aug ${slot.day}, ${slot.label}: ${slot.detail}`}
          className={`grid h-14 min-w-0 place-items-center rounded-md border text-center transition ${styles[slot.status]} ${selectedDay === slot.day ? "ring-2 ring-slate-900 ring-offset-1" : ""}`}
        >
          <span className="text-[9px] font-bold uppercase leading-none">{slot.weekday}</span>
          <span className="text-sm font-extrabold leading-none">{slot.day}</span>
        </button>
      ))}
    </div>
    <div className="mt-4 flex flex-wrap gap-1.5 text-[10px] font-bold uppercase tracking-wide">
      <span className="rounded-full bg-blue-50 px-2 py-1 text-blue-700">Class</span>
      <span className="rounded-full bg-red-50 px-2 py-1 text-red-700">Full</span>
      <span className="rounded-full bg-emerald-50 px-2 py-1 text-emerald-700">Open</span>
      <span className="rounded-full bg-amber-50 px-2 py-1 text-amber-700">Hold</span>
    </div>
    <div className="mt-3 rounded-md bg-slate-50 px-3 py-2 text-xs leading-5 text-slate-600">
      <span className="font-bold text-slate-900">Aug {selected.day}: {selected.label}.</span> {selected.detail}
    </div>
  </Card>;
}

function TrainerShell({ activeView, onViewChange, children }: { activeView: TrainerView; onViewChange: (view: TrainerView) => void; children: React.ReactNode }) {
  const views: { id: TrainerView; label: string; Icon: LucideIcon }[] = [
    { id: "home", label: "My Profile", Icon: UserRoundCheck },
    { id: "network", label: "Trainer Feature", Icon: Network },
    { id: "curator", label: "Course Curator", Icon: Sparkles },
    { id: "content", label: "Content Library", Icon: Library },
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
  const [prepGenerated, setPrepGenerated] = useState(false);
  const avgUtilization = Math.round(data.trainers.reduce((sum, trainer) => sum + trainer.utilization, 0) / data.trainers.length);
  return <div className="space-y-5">
    <Card className="border-blue-100 bg-blue-50/70">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.16em] text-blue-700">Trainer scenario</p>
          <h2 className="mt-2 text-lg font-semibold text-slate-950">Accept Northstar assignment and prepare the kickoff session.</h2>
          <p className="mt-1 text-sm text-slate-600">Trainer sees fit score, delivery date, calendar setup, latest approved content, and AI prep notes.</p>
        </div>
        <button onClick={() => setPrepGenerated(true)} className="rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-bold text-white">{prepGenerated ? "Prep notes ready" : "Generate prep notes"}</button>
      </div>
      {prepGenerated && <div className="mt-4 rounded-lg bg-white p-3 text-sm text-blue-900"><b>AI prep:</b> Focus on SAFe DevOps value stream mapping, include GitLab CI lab, and reserve 15 minutes for learner Q&A.</div>}
    </Card>
    <div className="grid gap-4 md:grid-cols-3">
      <MetricCard Icon={BadgeCheck} label="My credentials" value="3 active" detail="SAFe SPC, CSP-SM, ICAgile" tone="bg-blue-50 text-blue-700" />
      <TrainerAvailabilityCard />
      <MetricCard Icon={LineChart} label="Network utilization" value={`${avgUtilization}%`} detail="Average utilization across trainer pool" tone="bg-amber-50 text-amber-700" />
    </div>
    <Card>
      <h2 className="font-semibold text-slate-950">Assignment Matches</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {data.requests.slice(0, 2).map((request, index) => {
          const accepted = acceptedId === request.id;
          return <div key={request.id} className="rounded-lg border border-slate-100 bg-slate-50 p-4">
          <div className="flex items-start justify-between gap-3"><div><p className="text-sm font-semibold text-slate-900">{request.topic}</p><p className="mt-1 text-xs text-slate-500">{request.customer} - {request.deliveryMode}</p></div><StatusPill tone="green">{index === 0 ? "98% fit" : "91% fit"}</StatusPill></div>
          <div className="mt-4 grid gap-2 text-xs text-slate-600 sm:grid-cols-3"><span className="rounded-md bg-white px-2 py-1">Aug {index + 2}, 10:00 AM</span><span className="rounded-md bg-white px-2 py-1">{request.seats} learners</span><span className="rounded-md bg-white px-2 py-1">{index === 0 ? "Remote" : "Hybrid"}</span></div>
          <p className="mt-3 text-xs leading-5 text-slate-500">AI fit reason: skills match {request.topic}, calendar is open, and utilization stays within delivery guardrail.</p>
          {accepted ? <div className="mt-4 rounded-lg border border-emerald-100 bg-emerald-50 p-3 text-sm text-emerald-800"><p className="font-bold">Accepted - calendar call scheduled</p><p className="mt-1 text-xs leading-5">Outlook invite: kickoff call on Jul 24, 2026 at 10:00 AM with sales, admin, and trainer.</p><button className="mt-3 rounded-lg bg-emerald-700 px-3 py-2 text-xs font-bold text-white">Open calendar invite</button></div> : <div className="mt-4 flex gap-2"><button onClick={() => setAcceptedId(request.id)} className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-bold text-white">Accept & setup call</button><button className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600">Decline</button></div>}
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
    {view === "curator" && <TrainerCourseCurator data={data} />}
    {view === "content" && <TrainerContent data={data} />}
  </TrainerShell>;
}

function TrainerCourseCurator({ data }: { data: DashboardData }) {
  const [selectedCourseId, setSelectedCourseId] = useState(data.courses[0]?.id ?? "");
  const [isCurating, setIsCurating] = useState(false);
  const [curatorResult, setCuratorResult] = useState<CuratorResponse | null>(null);
  const [curatorError, setCuratorError] = useState("");
  const selectedCourse = data.courses.find((course) => course.id === selectedCourseId) ?? data.courses[0];
  const defaultInputs = selectedCourse ? [
    `Approved course: ${selectedCourse.title}`,
    `Source version: ${selectedCourse.sourceVersion}`,
    `Freshness score: ${selectedCourse.freshness}%`,
    "Assignment context: Northstar private cohort",
    "Learner profile: product and platform leads",
    "Delivery mode: blended instructor-led class",
  ] : [];
  const pack = curatorResult?.pack;
  const [trainerPrompt, setTrainerPrompt] = useState("Create a blended instructor-led course that helps product owners and platform leads apply SAFe DevOps practices using a realistic value stream and CI/CD lab.");
  const [courseGoal, setCourseGoal] = useState("Learners can map a delivery value stream, identify bottlenecks, and plan one improvement experiment.");
  const [draftDuration, setDraftDuration] = useState("2 hours");
  const [draftSyllabus, setDraftSyllabus] = useState("1. Outcomes and learner baseline\n2. Value stream mapping walkthrough\n3. CI/CD improvement lab\n4. Team debrief and action plan\n5. Assessment and follow-up resources");
  const [savedDraft, setSavedDraft] = useState(false);

  async function generateCuratorPack() {
    if (!selectedCourse) return;
    setIsCurating(true);
    setCuratorError("");
    try {
      const response = await fetch("/api/curate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          course: selectedCourse,
          assignmentContext: "Northstar private cohort preparing for an applied delivery session",
          learnerProfile: "Product owners, platform leads, and delivery managers with mixed agile experience",
          deliveryMode: "Blended instructor-led",
          classLength: draftDuration,
          trainerPrompt,
          courseGoal,
          syllabusDraft: draftSyllabus,
        }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? "Unable to generate curator pack.");
      setCuratorResult(payload as CuratorResponse);
    } catch (error) {
      setCuratorError(error instanceof Error ? error.message : "Unable to generate curator pack.");
    } finally {
      setIsCurating(false);
    }
  }

  return <div className="space-y-5">
    <SectionTitle
      eyebrow="AI course curator"
      title="Create a course from a trainer prompt"
      description="Trainer enters the course idea, goal, draft syllabus, audience, and duration. AI turns that into a teachable course pack with timings, activities, materials, and trainer notes."
    />
    <Card className="border-violet-100 bg-violet-50/60">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.16em] text-violet-700">Prompt-based course creator</p>
          <h2 className="mt-2 text-lg font-semibold text-slate-950">Tell the curator what you want to teach.</h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">The trainer prompt becomes the source for the generated syllabus, session flow, facilitator notes, exercises, and material checklist.</p>
        </div>
        <button onClick={() => setSavedDraft(true)} className="rounded-lg bg-violet-700 px-4 py-2.5 text-sm font-bold text-white">{savedDraft ? "Prompt saved" : "Save prompt"}</button>
      </div>
      <div className="mt-4 grid gap-3 lg:grid-cols-[1.25fr_.75fr]">
        <label className="block">
          <span className="text-xs font-bold uppercase tracking-wide text-violet-700">Trainer prompt</span>
          <textarea value={trainerPrompt} onChange={(e) => setTrainerPrompt(e.target.value)} className="mt-2 h-32 w-full rounded-lg border border-violet-100 bg-white p-3 text-sm leading-6 outline-none focus:border-violet-500" placeholder="Example: Create a two-hour instructor-led course for product owners..." />
        </label>
        <div className="grid gap-3">
          <label className="block">
            <span className="text-xs font-bold uppercase tracking-wide text-violet-700">Course goal</span>
            <textarea value={courseGoal} onChange={(e) => setCourseGoal(e.target.value)} className="mt-2 h-20 w-full rounded-lg border border-violet-100 bg-white p-3 text-sm leading-6 outline-none focus:border-violet-500" />
          </label>
          <label className="block">
            <span className="text-xs font-bold uppercase tracking-wide text-violet-700">Duration</span>
            <select value={draftDuration} onChange={(e) => setDraftDuration(e.target.value)} className="mt-2 w-full rounded-lg border border-violet-100 bg-white px-3 py-2.5 text-sm outline-none focus:border-violet-500">
              <option>90 minutes</option><option>2 hours</option><option>Half day</option><option>1 day</option><option>2 days</option><option>3 days</option><option>Custom duration</option>
            </select>
          </label>
        </div>
        <label className="block lg:col-span-2">
          <span className="text-xs font-bold uppercase tracking-wide text-violet-700">Draft syllabus or topics</span>
          <textarea value={draftSyllabus} onChange={(e) => setDraftSyllabus(e.target.value)} className="mt-2 h-28 w-full rounded-lg border border-violet-100 bg-white p-3 text-sm leading-6 outline-none focus:border-violet-500" />
        </label>
      </div>
    </Card>
    <Card className="border-blue-100 bg-blue-50/70">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <label className="block min-w-0 flex-1">
          <span className="text-xs font-bold uppercase tracking-wide text-blue-700">Course</span>
          <select value={selectedCourseId} onChange={(event) => { setSelectedCourseId(event.target.value); setCuratorResult(null); setCuratorError(""); }} className="mt-2 w-full rounded-lg border border-blue-100 bg-white px-4 py-3 text-sm font-semibold text-slate-950 outline-none focus:border-blue-500">
            {data.courses.map((course) => <option key={course.id} value={course.id}>{course.title}</option>)}
          </select>
        </label>
        <button onClick={generateCuratorPack} disabled={isCurating || !selectedCourse || !trainerPrompt.trim()} className="rounded-lg bg-slate-950 px-4 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:bg-slate-400">{isCurating ? "Generating..." : pack ? "Regenerate course pack" : "Generate course pack"}</button>
      </div>
      {selectedCourse && <p className="mt-3 text-sm leading-6 text-blue-900">Selected course: <b>{selectedCourse.title}</b>. Source v{selectedCourse.sourceVersion}, freshness {selectedCourse.freshness}%.</p>}
      {curatorResult && <div className="mt-3 rounded-lg border border-blue-100 bg-white p-3 text-xs font-semibold text-blue-900">Generated by {curatorResult.mode === "openai" ? "OpenAI" : "TaaS fallback AI"} using {curatorResult.model}. {curatorResult.notice}</div>}
      {curatorError && <div className="mt-3 rounded-lg border border-red-100 bg-red-50 p-3 text-sm font-semibold text-red-700">{curatorError}</div>}
    </Card>

    <Card>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div><h2 className="font-semibold text-slate-950">AI Inputs Used</h2><p className="mt-1 text-xs text-slate-500">Signals used to produce the trainer output.</p></div>
        <StatusPill tone={pack ? "green" : "amber"}>{pack ? "Generated" : "Ready"}</StatusPill>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {(pack?.aiInputs ?? defaultInputs).map((input) => <div key={input} className="rounded-lg border border-slate-100 bg-slate-50 p-4 text-sm font-semibold leading-6 text-slate-700">{input}</div>)}
      </div>
    </Card>

    {pack?.readinessSummary && <Card className="border-emerald-100 bg-emerald-50/70">
      <p className="text-xs font-bold uppercase tracking-[.16em] text-emerald-700">AI output summary</p>
      <p className="mt-2 text-sm leading-6 text-emerald-900">{pack.readinessSummary}</p>
    </Card>}

    <div className="grid gap-5 xl:grid-cols-[1.05fr_.95fr]">
      <Card>
        <h2 className="font-semibold text-slate-950">AI Teaching Structure</h2>
        <div className="mt-5 space-y-3">
          {(pack?.teachingStructure ?? []).length ? pack?.teachingStructure.map((item, index) => <div key={`${item.step}-${index}`} className="grid gap-3 rounded-lg border border-slate-100 bg-slate-50 p-4 sm:grid-cols-[76px_1fr_82px] sm:items-center">
            <div className="text-xs font-bold uppercase tracking-wide text-blue-700">Step {index + 1}</div>
            <div><p className="text-sm font-semibold text-slate-900">{item.step}</p><p className="mt-1 text-xs leading-5 text-slate-500">{item.purpose}</p><p className="mt-1 text-xs leading-5 text-slate-600">{item.trainerAction}</p></div>
            <div className="rounded-md bg-white px-3 py-2 text-center text-xs font-bold text-slate-600">{item.duration}</div>
          </div>) : <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 p-5 text-sm leading-6 text-slate-500">Generate the AI curator pack to create the class sequence, timing, and trainer actions.</div>}
        </div>
      </Card>

      <Card>
        <h2 className="font-semibold text-slate-950">AI Trainer Notes</h2>
        <div className="mt-5 space-y-3">
          {(pack?.trainerNotes ?? []).length ? pack?.trainerNotes.map((note, index) => <div key={note} className="rounded-lg border border-emerald-100 bg-emerald-50 p-3 text-sm leading-6 text-emerald-900">
            <span className="mr-2 font-bold">{index + 1}.</span>{note}
          </div>) : <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 p-5 text-sm leading-6 text-slate-500">AI-generated teaching notes will appear here.</div>}
        </div>
      </Card>
    </div>

    {pack && <div className="grid gap-5 xl:grid-cols-2">
      <Card>
        <h2 className="font-semibold text-slate-950">Classroom Prompts</h2>
        <div className="mt-5 space-y-3">
          {pack.classroomPrompts.map((prompt) => <div key={prompt} className="rounded-lg border border-slate-100 bg-slate-50 p-3 text-sm leading-6 text-slate-700">{prompt}</div>)}
        </div>
      </Card>
      <Card>
        <h2 className="font-semibold text-slate-950">Risk Checks</h2>
        <div className="mt-5 space-y-3">
          {pack.riskChecks.map((risk) => <div key={risk} className="rounded-lg border border-amber-100 bg-amber-50 p-3 text-sm leading-6 text-amber-900">{risk}</div>)}
        </div>
      </Card>
    </div>}

    <Card>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div><h2 className="font-semibold text-slate-950">AI Output Materials</h2><p className="mt-1 text-xs text-slate-500">Everything the trainer prepares before the class starts.</p></div>
        <StatusPill tone={pack ? "green" : "amber"}>{pack ? "Ready to teach" : "Draft"}</StatusPill>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {(pack?.materials ?? [
          { name: "Facilitator guide", use: "Generated after AI curation." },
          { name: "Slide plan", use: "Generated after AI curation." },
          { name: "Lab guide", use: "Generated after AI curation." },
        ]).map((item) => <div key={item.name} className={`rounded-lg border p-4 text-sm leading-6 ${pack ? "border-emerald-100 bg-emerald-50 text-emerald-800" : "border-slate-100 bg-slate-50 text-slate-700"}`}><p className="font-bold">{item.name}</p><p className="mt-1 text-xs">{item.use}</p></div>)}
      </div>
      {pack?.smeReviewNotice && <p className="mt-4 rounded-lg bg-slate-50 p-3 text-xs leading-5 text-slate-500">{pack.smeReviewNotice}</p>}
    </Card>
  </div>;
}

function TrainerContent({ data }: { data: DashboardData }) {
  const [downloaded, setDownloaded] = useState<string[]>([]);
  const [logSaved, setLogSaved] = useState(false);
  return <div className="space-y-5"><Card>
    <h2 className="font-semibold text-slate-950">Content Library</h2>
    <p className="mt-1 text-xs text-slate-500">Download the latest approved material for assigned sessions.</p>
    <div className="mt-5 space-y-3">
      {data.courses.map((course) => {
        const ready = downloaded.includes(course.id);
        return <div key={course.id} className={`flex flex-col gap-4 rounded-lg border p-4 md:flex-row md:items-center md:justify-between ${ready ? "border-emerald-200 bg-emerald-50" : "border-slate-100 bg-slate-50"}`}>
          <div><p className="text-sm font-semibold text-slate-900">{course.title}</p><p className="mt-1 text-xs text-slate-500">Deck v{course.sourceVersion} - lab guide - facilitator notes - freshness {course.freshness}%</p></div>
          <div className="flex gap-2"><button className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600">Preview</button><button onClick={() => setDownloaded(ready ? downloaded : [...downloaded, course.id])} className={`rounded-lg px-3 py-2 text-xs font-bold text-white ${ready ? "bg-emerald-600" : "bg-blue-600"}`}>{ready ? "Downloaded" : "Download latest"}</button></div>
        </div>;
      })}
    </div>
  </Card><Card>
    <div className="flex items-center justify-between"><div><h2 className="font-semibold text-slate-950">Delivery documentation</h2><p className="mt-1 text-xs text-slate-500">Record past outcomes and prepare upcoming sessions for the shared Salesforce training record.</p></div><StatusPill tone={logSaved ? "green" : "amber"}>{logSaved ? "Saved" : "Draft"}</StatusPill></div>
    <div className="mt-4 grid gap-3 md:grid-cols-2"><select className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm"><option>Upcoming — Northstar SAFe DevOps cohort</option><option>Past — Acme Health private cohort</option></select><input className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm" placeholder="Attendance, outcomes, risks or follow-ups" /></div>
    <textarea className="mt-3 h-20 w-full rounded-lg border border-slate-200 bg-white p-3 text-sm" placeholder="Session notes and learner/user updates..." /><button onClick={() => setLogSaved(true)} className="mt-3 rounded-lg bg-slate-950 px-4 py-2.5 text-xs font-bold text-white">Save session record</button>
  </Card></div>;
}

function LearnerPersona({ data }: { data: DashboardData }) {
  void data;
  return <PrototypeFrame src="/personas/taas_learner_view.html" title="Learner console" />;
}

function ExecutivePersona({ data }: { data: DashboardData }) {
  void data;
  return <PrototypeFrame src="/personas/taas_executive_view.html" title="Executive console" />;
}

function SectionTitle({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return <div className="mb-5">
    <p className="text-xs font-bold uppercase tracking-[.16em] text-blue-600">{eyebrow}</p>
    <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">{title}</h2>
    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">{description}</p>
  </div>;
}

export function DashboardTabs({ data }: { data: DashboardData }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activePersona, setActivePersona] = useState<PersonaId>(() => {
    if (typeof window === "undefined") return "admin";
    const hash = window.location.hash.replace("#", "");
    return personas.some((persona) => persona.id === hash) ? hash as PersonaId : "admin";
  });

  function loginAs(persona: PersonaId = "admin") {
    setActivePersona(persona);
    window.history.replaceState(null, "", `#${persona}`);
    setIsAuthenticated(true);
  }

  if (!isAuthenticated) return <LoginScreen onLogin={loginAs} />;

  return <main className="min-h-screen bg-[#f5f7fb] text-[#17233b]">
    <section className="mx-auto max-w-[1520px] px-4 py-4 md:px-6 md:py-6">
      <div className="mb-3 flex items-center justify-end gap-2">
        <label htmlFor="persona-switcher" className="text-[10px] font-bold uppercase tracking-[.14em] text-slate-400">Demo persona</label>
        <select id="persona-switcher" value={activePersona} onChange={(event) => loginAs(event.target.value as PersonaId)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-sm outline-none focus:border-blue-500">
          {personas.map((persona) => <option key={persona.id} value={persona.id}>{persona.label}</option>)}
        </select>
        <span className="grid size-9 place-items-center rounded-full bg-slate-950 text-xs font-extrabold text-white" aria-label="Current user">JR</span>
      </div>
      {activePersona === "admin" && <AdminPersona data={data} />}
      {activePersona === "sales" && <SalesPersona data={data} />}
      {activePersona === "trainer" && <TrainerPersona data={data} />}
      {activePersona === "learner" && <LearnerPersona data={data} />}
      {activePersona === "executive" && <ExecutivePersona data={data} />}
    </section>
  </main>;
}

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  return <main className="grid min-h-screen place-items-center bg-[#f5f7fb] px-4 py-10 text-[#17233b]">
    <section className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70 md:p-8">
      <div className="mb-8 flex items-center gap-3">
        <div className="grid size-12 place-items-center rounded-lg bg-[#ff5b49] text-white"><Sparkles size={22} /></div>
        <div>
          <p className="text-xl font-bold tracking-tight text-slate-950">Cprime TaaS</p>
          <p className="text-[10px] font-bold uppercase tracking-[.2em] text-slate-400">Secure access</p>
        </div>
      </div>

      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-[.16em] text-blue-600">Login</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">Sign in to continue</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">Sign in with your Cprime credentials to continue.</p>
      </div>

      <form onSubmit={(event) => { event.preventDefault(); onLogin(); }} className="space-y-4">
        <label className="block">
          <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Email</span>
          <input type="email" required placeholder="you@company.com" className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-blue-500 focus:bg-white" />
        </label>
        <label className="block">
          <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Password</span>
          <input type="password" required placeholder="Password" className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-blue-500 focus:bg-white" />
        </label>
        <button type="submit" className="mt-2 w-full rounded-lg bg-slate-950 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-800">Login</button>
      </form>
    </section>
  </main>;
}
