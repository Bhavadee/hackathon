"use client";

import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  BadgeCheck,
  Banknote,
  Bell,
  BookOpenCheck,
  Bot,
  CalendarDays,
  ClipboardCheck,
  Gauge,
  GraduationCap,
  Library,
  LineChart,
  MessageCircle,
  Network,
  Search,
  Send,
  Settings2,
  Sparkles,
  UserRoundCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ExecutiveCommandCenter } from "@/components/executive-command-center";
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
type TrainerView = "home" | "network" | "curator" | "content" | "prep";
type LearnerView = "discover" | "catalogue" | "generator" | "learning";

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
  return <PrototypeFrame src="/personas/taas_admin_view.html" title="Admin console" />;
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
    {view === "prep" && <TrainerPrep />}
  </TrainerShell>;
}

function TrainerCourseCurator({ data }: { data: DashboardData }) {
  const [selectedCourseId, setSelectedCourseId] = useState(data.courses[0]?.id ?? "");
  const [notesReady, setNotesReady] = useState(false);
  const selectedCourse = data.courses.find((course) => course.id === selectedCourseId) ?? data.courses[0];
  const lessonFlow = [
    ["Opening", "Set context, learner outcomes, and real client scenario.", "10 min"],
    ["Concepts", "Explain the core model with one visual and one business example.", "25 min"],
    ["Demo", "Walk through the trainer-led example before learner practice.", "20 min"],
    ["Practice", "Run breakout activity, lab, or guided discussion.", "35 min"],
    ["Debrief", "Collect questions, correct misconceptions, and connect to certification prep.", "20 min"],
  ];
  const notes = [
    "Start with the Northstar value stream story so the class sees why the topic matters.",
    "Keep definitions short, then immediately show how the idea changes daily work.",
    "Use the GitLab CI/CD lab as the practical anchor for DevOps learners.",
    "Pause after every major concept and ask learners to map it to their current team.",
  ];
  const materials = ["Facilitator guide", "Slide deck", "Lab guide", "Timing plan", "Q&A prompts", "Assessment notes"];

  return <div className="space-y-5">
    <SectionTitle
      eyebrow="Course curator"
      title="Prepare the course before teaching"
      description="Curate the approved content into trainer notes, lesson order, examples, timing, and classroom delivery structure."
    />
    <Card className="border-blue-100 bg-blue-50/70">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <label className="block min-w-0 flex-1">
          <span className="text-xs font-bold uppercase tracking-wide text-blue-700">Course</span>
          <select value={selectedCourseId} onChange={(event) => { setSelectedCourseId(event.target.value); setNotesReady(false); }} className="mt-2 w-full rounded-lg border border-blue-100 bg-white px-4 py-3 text-sm font-semibold text-slate-950 outline-none focus:border-blue-500">
            {data.courses.map((course) => <option key={course.id} value={course.id}>{course.title}</option>)}
          </select>
        </label>
        <button onClick={() => setNotesReady(true)} className="rounded-lg bg-slate-950 px-4 py-3 text-sm font-bold text-white">{notesReady ? "Curator pack ready" : "Prepare curator pack"}</button>
      </div>
      {selectedCourse && <p className="mt-3 text-sm leading-6 text-blue-900">Selected course: <b>{selectedCourse.title}</b>. Source v{selectedCourse.sourceVersion}, freshness {selectedCourse.freshness}%.</p>}
    </Card>

    <div className="grid gap-5 xl:grid-cols-[1.05fr_.95fr]">
      <Card>
        <h2 className="font-semibold text-slate-950">Teaching Structure</h2>
        <div className="mt-5 space-y-3">
          {lessonFlow.map(([step, detail, time], index) => <div key={step} className="grid gap-3 rounded-lg border border-slate-100 bg-slate-50 p-4 sm:grid-cols-[76px_1fr_70px] sm:items-center">
            <div className="text-xs font-bold uppercase tracking-wide text-blue-700">Step {index + 1}</div>
            <div><p className="text-sm font-semibold text-slate-900">{step}</p><p className="mt-1 text-xs leading-5 text-slate-500">{detail}</p></div>
            <div className="rounded-md bg-white px-3 py-2 text-center text-xs font-bold text-slate-600">{time}</div>
          </div>)}
        </div>
      </Card>

      <Card>
        <h2 className="font-semibold text-slate-950">Trainer Notes</h2>
        <div className="mt-5 space-y-3">
          {notes.map((note, index) => <div key={note} className={`rounded-lg border p-3 text-sm leading-6 ${notesReady ? "border-emerald-100 bg-emerald-50 text-emerald-900" : "border-slate-100 bg-slate-50 text-slate-600"}`}>
            <span className="mr-2 font-bold">{index + 1}.</span>{note}
          </div>)}
        </div>
      </Card>
    </div>

    <Card>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div><h2 className="font-semibold text-slate-950">Curator Materials</h2><p className="mt-1 text-xs text-slate-500">Everything the trainer prepares before the class starts.</p></div>
        <StatusPill tone={notesReady ? "green" : "amber"}>{notesReady ? "Ready to teach" : "Draft"}</StatusPill>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {materials.map((item) => <div key={item} className={`rounded-lg border p-4 text-sm font-semibold ${notesReady ? "border-emerald-100 bg-emerald-50 text-emerald-800" : "border-slate-100 bg-slate-50 text-slate-700"}`}>{item}</div>)}
      </div>
    </Card>
  </div>;
}

function TrainerContent({ data }: { data: DashboardData }) {
  const [downloaded, setDownloaded] = useState<string[]>([]);
  return <Card>
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
  </Card>;
}

function TrainerPrep() {
  const [notesReady, setNotesReady] = useState(false);
  const [checked, setChecked] = useState<string[]>(["Slides finalized", "Lab environment provisioned"]);
  const items = ["Slides finalized", "Lab environment provisioned", "Roster confirmed", "Learner background reviewed", "Kickoff call joined", "Escalation route ready"];
  return <Card>
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between"><div><h2 className="font-semibold text-slate-950">Session Prep Checklist</h2><p className="mt-1 text-xs text-slate-500">Prepare the accepted cohort using latest content and AI-generated notes.</p></div><button onClick={() => setNotesReady(true)} className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-bold text-white">{notesReady ? "AI notes generated" : "Generate AI prep notes"}</button></div>
    {notesReady && <div className="mt-5 rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm leading-6 text-blue-900"><b>AI prep notes:</b> Northstar learners are product and platform leads. Start with value stream mapping, then run GitLab CI/CD lab, and close with certification Q&A.</div>}
    <div className="mt-5 grid gap-3 md:grid-cols-2">
      {items.map((item) => {
        const active = checked.includes(item);
        return <label key={item} className={`flex items-center gap-3 rounded-lg border p-4 text-sm font-semibold ${active ? "border-emerald-100 bg-emerald-50 text-emerald-800" : "border-slate-100 bg-slate-50 text-slate-700"}`}>
          <input type="checkbox" checked={active} onChange={() => setChecked(active ? checked.filter((entry) => entry !== item) : [...checked, item])} className="size-4 accent-blue-600" />
          {item}
        </label>;
      })}
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
  const [goalGenerated, setGoalGenerated] = useState(false);
  return <div className="space-y-5">
    <Card className="border-violet-100 bg-violet-50/70">
      <p className="text-xs font-bold uppercase tracking-[.16em] text-violet-700">Learner scenario</p>
      <h2 className="mt-2 text-lg font-semibold text-slate-950">A product owner wants a guided SAFe learning path.</h2>
      <p className="mt-1 text-sm text-slate-600">Learner gets catalogue recommendations, nudges for progress, and grounded copilot help from approved content.</p>
    </Card>
    <div className="grid gap-4 lg:grid-cols-[1fr_.8fr]">
      <Card>
        <div className="flex items-center gap-3"><div className="grid size-10 place-items-center rounded-lg bg-blue-50 text-blue-700"><Sparkles size={18} /></div><div><h2 className="font-semibold text-slate-950">Learning Objective Builder</h2><p className="text-xs text-slate-500">Tell us your goal and generate a structured path.</p></div></div>
        <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">I want to learn Scaled Agile for a Product Owner role...</div>
        <div className="mt-4 flex flex-wrap gap-2"><StatusPill>Self-paced</StatusPill><StatusPill tone="slate">Blended</StatusPill><StatusPill tone="slate">Instructor-led</StatusPill></div>
        {goalGenerated && <div className="mt-4 rounded-lg border border-emerald-100 bg-emerald-50 p-3 text-sm text-emerald-800">Path generated: SAFe Fundamentals, Product Owner focus, DevOps collaboration lab.</div>}
        <button onClick={() => { setGoalGenerated(true); onGenerate(); }} className="mt-5 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-bold text-white">{goalGenerated ? "Open generated path" : "Generate my path"}</button>
      </Card>
      <Card>
        <h2 className="font-semibold text-slate-950">My Progress</h2>
        <div className="mt-5 space-y-4">
          {[["SAFe Fundamentals", 72], ["Scrum Master Prep", 34]].map(([title, progress]) => <div key={title}>
            <div className="flex justify-between text-sm"><span className="font-semibold text-slate-700">{title}</span><span className="font-bold text-slate-950">{progress}%</span></div>
            <div className="mt-2 h-2 rounded-full bg-slate-100"><div className="h-full rounded-full bg-blue-600" style={{ width: `${progress}%` }} /></div>
          </div>)}
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 text-sm"><div className="rounded-lg bg-slate-50 p-3"><p className="text-xs text-slate-500">Skills gained</p><p className="mt-1 font-bold text-slate-900">Agile, Scrum</p></div><div className="rounded-lg bg-slate-50 p-3"><p className="text-xs text-slate-500">Certificates</p><p className="mt-1 font-bold text-slate-900">1 earned</p></div></div>
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
  const [continued, setContinued] = useState<string | null>(null);
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
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"><p className="text-xs text-slate-500">{index === 0 ? "Next: PI Planning simulation" : index === 1 ? "Next: servant leadership quiz" : "Suggested start: 20 min overview"}</p><button onClick={() => setContinued(course.id)} className={`rounded-lg px-3 py-2 text-xs font-bold text-white ${continued === course.id ? "bg-emerald-600" : "bg-blue-600"}`}>{continued === course.id ? "Nudge accepted" : index < 2 ? "Continue" : "Start"}</button></div>
      </div>)}
    </div>
    <div className="mt-5 grid gap-3 md:grid-cols-3"><div className="rounded-lg bg-slate-50 p-4"><p className="text-xs text-slate-500">Weekly streak</p><p className="mt-1 text-xl font-bold text-slate-950">4 days</p></div><div className="rounded-lg bg-slate-50 p-4"><p className="text-xs text-slate-500">Certificates earned</p><p className="mt-1 text-xl font-bold text-slate-950">1</p></div><div className="rounded-lg bg-slate-50 p-4"><p className="text-xs text-slate-500">Skills added</p><p className="mt-1 text-xl font-bold text-slate-950">5</p></div></div>
  </Card>;
}

function LearnerCatalogue({ data }: { data: DashboardData }) {
  const [filter, setFilter] = useState("All");
  const [enrolled, setEnrolled] = useState<string[]>([]);
  const categories = ["All", "Agile", "DevOps", "Cloud", "Product"];
  const visible = data.courses.filter((_, index) => filter === "All" || index % categories.length === categories.indexOf(filter) % categories.length || filter === "Agile");
  return <div className="space-y-5">
    <SectionTitle eyebrow="Catalogue" title="All courses and recommendations" description="Browse the full catalogue with recommendations based on skills, courses taken, and stated interests." />
    <div className="flex flex-wrap gap-2">{categories.map((item) => <button key={item} onClick={() => setFilter(item)} className={`rounded-lg px-3 py-2 text-xs font-bold ${filter === item ? "bg-slate-950 text-white" : "bg-white text-slate-600"}`}>{item}</button>)}</div>
    <div className="grid gap-4 md:grid-cols-3">
      {visible.map((course, index) => {
        const active = enrolled.includes(course.id);
        return <Card key={course.id}>
          <div className="flex items-start justify-between gap-3"><h3 className="font-semibold text-slate-950">{course.title}</h3><StatusPill tone={active ? "green" : index === 0 ? "green" : "blue"}>{active ? "Enrolled" : index === 0 ? "Recommended" : "Catalogue"}</StatusPill></div>
          <p className="mt-2 text-xs leading-5 text-slate-500">Recommended from your agile interest profile, completed modules, and target Product Owner role.</p>
          <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-semibold text-slate-600"><span className="rounded-md bg-slate-100 px-2 py-1">Beginner</span><span className="rounded-md bg-slate-100 px-2 py-1">{index + 4} modules</span><span className="rounded-md bg-slate-100 px-2 py-1">Self-paced</span></div>
          <button onClick={() => setEnrolled(active ? enrolled : [...enrolled, course.id])} className={`mt-4 rounded-lg px-3 py-2 text-xs font-bold text-white ${active ? "bg-emerald-600" : "bg-blue-600"}`}>{active ? "Added to My Learning" : "Enroll"}</button>
        </Card>;
      })}
    </div>
  </div>;
}

function LearnerCopilot() {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<{ role: "bot" | "user"; text: string }[]>([
    { role: "bot", text: "Ask me about your current module, lab, or recommended next step." },
  ]);
  function ask() {
    const trimmed = question.trim();
    if (!trimmed) return;
    setMessages([...messages, { role: "user", text: trimmed }, { role: "bot", text: `Here is a guided explanation for "${trimmed}". Review the related module, then try the practical lab to reinforce the concept.` }]);
    setQuestion("");
  }
  function prompt(text: string) {
    setQuestion(text);
  }
  return <div className="fixed bottom-5 right-5 z-40">
    {open && <div className="mb-3 w-[min(390px,calc(100vw-2rem))] rounded-lg border border-slate-200 bg-white p-4 shadow-2xl">
      <div className="flex items-center justify-between"><div className="flex items-center gap-2"><div className="grid size-9 place-items-center rounded-lg bg-violet-100 text-violet-700"><Bot size={17} /></div><div><p className="text-sm font-bold text-slate-950">Learner Copilot</p><p className="text-xs text-slate-500">Grounded in approved content</p></div></div><button onClick={() => setOpen(false)} className="text-slate-400">X</button></div>
      <div className="mt-4 max-h-72 space-y-2 overflow-y-auto rounded-lg bg-slate-50 p-3 text-sm leading-6 text-slate-600">{messages.map((message, index) => <div key={index} className={`rounded-lg px-3 py-2 ${message.role === "user" ? "ml-8 bg-blue-600 text-white" : "mr-8 bg-white text-slate-700"}`}>{message.text}</div>)}</div>
      <div className="mt-3 flex flex-wrap gap-2">{["Explain PI Planning", "Give quiz questions", "Summarize my next lesson"].map((item) => <button key={item} onClick={() => prompt(item)} className="rounded-full bg-slate-100 px-3 py-1.5 text-[11px] font-bold text-slate-600">{item}</button>)}</div>
      <div className="mt-3 flex gap-2"><input value={question} onChange={(event) => setQuestion(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") ask(); }} className="min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500" placeholder="Ask copilot" /><button onClick={ask} className="grid size-10 place-items-center rounded-lg bg-blue-600 text-white"><Send size={16} /></button></div>
    </div>}
    <button onClick={() => setOpen(!open)} className="flex items-center gap-2 rounded-full bg-slate-950 px-4 py-3 text-sm font-bold text-white shadow-xl"><MessageCircle size={18} />Copilot</button>
  </div>;
}

function ExecutivePersona({ data }: { data: DashboardData }) {
  return <ExecutiveCommandCenter connected={data.connected} />;
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
  const [allowedPersona, setAllowedPersona] = useState<PersonaId>("admin");
  const [activePersona, setActivePersona] = useState<PersonaId>(() => {
    if (typeof window === "undefined") return "admin";
    const hash = window.location.hash.replace("#", "");
    return personas.some((persona) => persona.id === hash) ? hash as PersonaId : "admin";
  });
  const active = useMemo(() => personas.find((persona) => persona.id === activePersona) ?? personas[0], [activePersona]);
  const visiblePersonas = useMemo(() => personas.filter((persona) => persona.id === allowedPersona), [allowedPersona]);

  function selectPersona(persona: PersonaId) {
    setActivePersona(persona);
    window.history.replaceState(null, "", `#${persona}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function loginAs(persona: PersonaId) {
    setAllowedPersona(persona);
    setActivePersona(persona);
    window.history.replaceState(null, "", `#${persona}`);
    setIsAuthenticated(true);
  }

  if (!isAuthenticated) return <LoginScreen onLogin={loginAs} />;

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
        <div className="grid grid-cols-1 gap-2">
          {visiblePersonas.map(({ id, label, Icon }) => <button key={id} type="button" onClick={() => selectPersona(id)} className={`flex items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-bold transition ${activePersona === id ? "bg-slate-950 text-white" : "text-slate-500 hover:bg-slate-100 hover:text-slate-950"}`}>
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

function LoginScreen({ onLogin }: { onLogin: (persona: PersonaId) => void }) {
  const [persona, setPersona] = useState<PersonaId>("admin");
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
        <p className="mt-2 text-sm leading-6 text-slate-500">Use any email and password for this prototype.</p>
      </div>

      <form onSubmit={(event) => { event.preventDefault(); onLogin(persona); }} className="space-y-4">
        <label className="block">
          <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Role</span>
          <select value={persona} onChange={(event) => setPersona(event.target.value as PersonaId)} className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-950 outline-none transition focus:border-blue-500 focus:bg-white">
            {personas.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
          </select>
        </label>
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
