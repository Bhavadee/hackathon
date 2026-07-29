"use client";

import { useState } from "react";
import {
  BadgeCheck,
  Banknote,
  CalendarDays,
  Download,
  Gauge,
  GraduationCap,
  Library,
  LineChart,
  Settings2,
  Sparkles,
  UserRoundCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

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
type DashboardMode = "default" | "custom";

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

function PrototypeFrame({ src, title }: { src: string; title: string }) {
  return <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
    <iframe
      title={title}
      src={src}
      className="block h-[calc(100vh-168px)] min-h-[760px] w-full border-0 bg-white"
    />
  </section>;
}

function CustomDashboardBuilder({ persona }: { persona: Exclude<PersonaId, "trainer"> }) {
  return <Card className="space-y-4">
    <div>
      <p className="text-xs font-bold uppercase tracking-[.16em] text-slate-500">Custom dashboard</p>
      <h3 className="mt-1 text-lg font-semibold text-slate-950">Build a role-specific view for {persona}.</h3>
      <p className="mt-1 text-sm leading-6 text-slate-500">Use this as the default dashboard alternative when the persona needs a focused operating view instead of the prototype shell.</p>
    </div>
    <div className="grid gap-3 md:grid-cols-2">
      {[
        "KPI tiles",
        "Work queue",
        "Calendar or schedule",
        "Revenue or demand chart",
        "Approval stream",
        "Library or content panel",
      ].map((item) => (
        <div key={item} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-semibold text-slate-700">{item}</div>
      ))}
    </div>
    <div className="grid gap-3 md:grid-cols-3">
      <label className="block text-sm">
        <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Primary focus</span>
        <input className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5" placeholder="Operations, revenue, learning, or delivery" />
      </label>
      <label className="block text-sm">
        <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Metric source</span>
        <input className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5" placeholder="Dashboards, pipeline, sessions, or content" />
      </label>
      <label className="block text-sm">
        <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Refresh cadence</span>
        <input className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5" placeholder="Hourly, daily, or weekly" />
      </label>
    </div>
    <button className="rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-bold text-white">Save custom dashboard</button>
  </Card>;
}

function PersonaModeShell({ title, description, customLabel, customView, children }: { title: string; description: string; customLabel: string; customView: React.ReactNode; children: React.ReactNode }) {
  const [mode, setMode] = useState<DashboardMode>("default");
  return <div className="space-y-4">
    <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <div>
        <p className="text-xs font-bold uppercase tracking-[.16em] text-slate-500">{title}</p>
        <h2 className="mt-1 text-base font-semibold text-slate-950">{description}</h2>
      </div>
      <div className="flex gap-2">
        <button onClick={() => setMode("default")} className={`rounded-lg px-3 py-2 text-sm font-bold ${mode === "default" ? "bg-slate-950 text-white" : "border border-slate-200 bg-white text-slate-700"}`}>Default</button>
        <button onClick={() => setMode("custom")} className={`rounded-lg px-3 py-2 text-sm font-bold ${mode === "custom" ? "bg-slate-950 text-white" : "border border-slate-200 bg-white text-slate-700"}`}>{customLabel}</button>
      </div>
    </div>
    {mode === "default" ? children : customView}
  </div>;
}

function AdminPersona({ data }: { data: DashboardData }) {
  void data;
  return <PersonaModeShell title="Admin persona" description="Dashboard mode" customLabel="Custom" customView={<CustomDashboardBuilder persona="admin" />}><PrototypeFrame src="/personas/taas_admin_view.html?v=20260727-reference-global-map" title="Admin console" /></PersonaModeShell>;
}

function SalesPersona({ data }: { data: DashboardData }) {
  void data;
  return <PersonaModeShell title="Sales persona" description="Dashboard mode" customLabel="Custom" customView={<CustomDashboardBuilder persona="sales" />}><PrototypeFrame src="/personas/taas_sales_view.html" title="Sales console" /></PersonaModeShell>;
}

function TrainerAvailabilityCard({ className = "" }: { className?: string }) {
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

  return <Card className={className}>
    <div className="flex items-start justify-between">
      <div className="grid size-10 place-items-center rounded-lg bg-emerald-50 text-emerald-700"><CalendarDays size={19} /></div>
      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-700">5 open days</span>
    </div>
    <p className="mt-5 text-xs font-bold uppercase tracking-wider text-slate-400">Availability</p>
    <div className="mt-1 flex items-end justify-between gap-3">
      <p className="text-2xl font-semibold tracking-tight text-slate-950">Calendar</p>
      <p className="text-xs font-semibold text-slate-500">Aug 1-14</p>
    </div>
    <div className="mt-4 grid grid-cols-7 gap-2">
      {slots.map((slot) => (
        <button
          key={slot.day}
          type="button"
          onClick={() => setSelectedDay(slot.day)}
          aria-label={`Aug ${slot.day}, ${slot.label}: ${slot.detail}`}
          className={`grid h-16 min-w-0 place-items-center rounded-md border text-center transition ${styles[slot.status]} ${selectedDay === slot.day ? "ring-2 ring-slate-900 ring-offset-1" : ""}`}
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
    { id: "network", label: "Sessions", Icon: CalendarDays },
    { id: "curator", label: "Course Curator", Icon: Sparkles },
    { id: "content", label: "Content Library", Icon: Library },
  ];
  return <div className="grid overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm xl:grid-cols-[220px_1fr]">
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
  const profile = data.trainers[0] ?? {
    id: "trainer",
    name: "Maya Chen",
    role: "Principal Agile Coach",
    skills: ["SAFe", "DevOps", "Leadership"],
    certifications: ["SAFe SPC", "ICAgile ICP-ACC"],
    hourlyRate: 185,
    utilization: 72,
    availableFrom: "2026-08-02",
  };
  return <div className="space-y-5">
    <div className="grid gap-5 xl:grid-cols-[.72fr_1.28fr]">
      <Card>
        <div className="flex items-start gap-4">
          <div className="grid size-14 shrink-0 place-items-center rounded-lg bg-slate-950 text-sm font-bold text-white">{profile.name.split(" ").map((name) => name[0]).join("")}</div>
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[.16em] text-blue-600">My profile</p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">{profile.name}</h2>
            <p className="mt-1 text-sm text-slate-500">{profile.role}</p>
          </div>
        </div>
        <div className="mt-5 grid gap-3">
          <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-blue-700"><BadgeCheck size={15} />Credentials</div>
            <p className="mt-2 text-sm font-semibold text-slate-900">{profile.certifications.join(", ")}</p>
          </div>
          <div className="rounded-lg border border-amber-100 bg-amber-50 p-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-amber-700"><LineChart size={15} />Utilization</div>
            <p className="mt-2 text-2xl font-semibold text-slate-950">{profile.utilization}%</p>
            <p className="mt-1 text-xs text-slate-600">Network average: {avgUtilization}%</p>
          </div>
          <div className="rounded-lg border border-slate-100 bg-slate-50 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Skills</p>
            <div className="mt-2 flex flex-wrap gap-1.5">{profile.skills.map((skill) => <span key={skill} className="rounded-md bg-white px-2.5 py-1 text-[11px] font-bold text-slate-600">{skill}</span>)}</div>
          </div>
        </div>
      </Card>
      <TrainerAvailabilityCard className="min-h-full" />
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
    {view === "network" && <TrainerSessionWorkspace data={data} />}
    {view === "curator" && <TrainerCourseCurator data={data} />}
    {view === "content" && <TrainerContent data={data} />}
  </TrainerShell>;
}

function TrainerSessionWorkspace({ data }: { data: DashboardData }) {
  const session = data.requests[0];
  const attendees = [
    { name: "Bidyashree Parhi", company: "Cprime", email: "bidyashree.parhi@cprime.com" },
    { name: "Chanel Bhalla", company: "Cprime", email: "chanel.bhalla@cprime.com" },
    { name: "Eric Martin", company: "Cprime", email: "eric.martin@cprime.com" },
    { name: "Hamchajini Balasundram", company: "Cprime", email: "hamchajini.balasundram@cprime.com" },
    { name: "Joseph Bamisiaye", company: "Cprime", email: "joseph.bamisaiye@cprime.com" },
    { name: "Kayley Newman", company: "Cprime", email: "kayley.newman@cprime.com" },
  ];

  return <div className="space-y-5">
    <SectionTitle
      eyebrow="Sessions"
      title="Trainer session workspace"
      description="Quick-access files, roster actions, and attendance tracking."
    />

    <Card className="space-y-4">
      <div className="flex flex-wrap gap-3">
        {["Download Instructor Materials", "Download Student Materials", "Printable Roster", "Download CSV", "Email all students"].map((label) => (
          <button key={label} type="button" className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-slate-100 px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-200">
            <Download size={16} />
            {label}
          </button>
        ))}
      </div>
      <div className="rounded-lg bg-slate-50 px-4 py-3 text-sm font-medium text-slate-500">
        Use these buttons to quickly get access to all instructor and student materials and files.
      </div>
    </Card>

    <Card className="space-y-4">
      <div>
        <h3 className="text-3xl font-semibold tracking-tight text-slate-950">{session?.topic ?? "Introduction to DevOps"}</h3>
        <p className="mt-2 text-sm text-slate-500">{session?.customer ?? "606508VCL03"}</p>
        <p className="mt-3 text-sm text-slate-500">{session?.deliveryMode ?? "Live Online Training"} | Jun 24</p>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-pink-600 text-white">
            <tr>
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold">Email</th>
              <th className="px-4 py-3 font-semibold">Company</th>
              <th className="px-4 py-3 font-semibold">Attendance</th>
              <th className="px-4 py-3 font-semibold">Follow Up Opportunity?</th>
            </tr>
          </thead>
          <tbody>
            {attendees.map((attendee, index) => (
              <tr key={attendee.name} className={index % 2 === 1 ? "bg-slate-100" : "bg-white"}>
                <td className="px-4 py-4 text-slate-700">{attendee.name}</td>
                <td className="px-4 py-4 text-slate-700">
                  <button type="button" className="rounded border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-600">edit email</button>
                </td>
                <td className="px-4 py-4 text-slate-700">{attendee.company}</td>
                <td className="px-4 py-4">
                  <select className="rounded border border-slate-300 bg-white px-2 py-1 text-sm text-slate-600" defaultValue="Attended">
                    <option>Attended</option>
                    <option>Absent</option>
                    <option>Late</option>
                  </select>
                </td>
                <td className="px-4 py-4">
                  <button type="button" className="inline-flex size-10 items-center justify-center rounded border border-slate-300 bg-white text-lg text-slate-600">+</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  </div>;
}

function TrainerCourseCurator({ data }: { data: DashboardData }) {
  void data;
  const [isCurating, setIsCurating] = useState(false);
  const [curatorResult, setCuratorResult] = useState<CuratorResponse | null>(null);
  const [curatorError, setCuratorError] = useState("");
  const pack = curatorResult?.pack;
  const [trainerPrompt, setTrainerPrompt] = useState("");
  const [courseGoal, setCourseGoal] = useState("");
  const [draftDuration, setDraftDuration] = useState("");
  const [draftSyllabus, setDraftSyllabus] = useState("");
  const [courseTitle, setCourseTitle] = useState("");
  const [courseContext, setCourseContext] = useState("");
  const [learnerNeed, setLearnerNeed] = useState("");
  const [savedDraft, setSavedDraft] = useState(false);

  async function generateCuratorPack() {
    setIsCurating(true);
    setCuratorError("");
    try {
      const response = await fetch("/api/curate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          course: {
            title: courseTitle || "Untitled course",
            status: "draft",
            freshness: 100,
            sourceVersion: "new",
          },
          assignmentContext: courseContext || "Create from scratch",
          learnerProfile: learnerNeed || "Learner-defined need",
          deliveryMode: "Custom",
          classLength: draftDuration || "Custom duration",
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
      title="Create a course from scratch"
      description="Trainer enters the need, course idea, goal, draft syllabus, and timing. AI turns that into a teachable course pack with timings, activities, materials, and trainer notes."
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
          <span className="text-xs font-bold uppercase tracking-wide text-violet-700">Need statement</span>
          <textarea value={trainerPrompt} onChange={(e) => setTrainerPrompt(e.target.value)} className="mt-2 h-32 w-full rounded-lg border border-violet-100 bg-white p-3 text-sm leading-6 outline-none focus:border-violet-500" placeholder="Describe the need in plain language..." />
        </label>
        <div className="grid gap-3">
          <label className="block">
            <span className="text-xs font-bold uppercase tracking-wide text-violet-700">Course title</span>
            <input value={courseTitle} onChange={(e) => setCourseTitle(e.target.value)} className="mt-2 w-full rounded-lg border border-violet-100 bg-white px-3 py-2.5 text-sm outline-none focus:border-violet-500" placeholder="Name the course" />
          </label>
          <label className="block">
            <span className="text-xs font-bold uppercase tracking-wide text-violet-700">Course goal</span>
            <textarea value={courseGoal} onChange={(e) => setCourseGoal(e.target.value)} className="mt-2 h-20 w-full rounded-lg border border-violet-100 bg-white p-3 text-sm leading-6 outline-none focus:border-violet-500" placeholder="Describe the outcome the learner should reach." />
          </label>
        </div>
        <label className="block lg:col-span-2">
          <span className="text-xs font-bold uppercase tracking-wide text-violet-700">Context and need</span>
          <textarea value={courseContext} onChange={(e) => setCourseContext(e.target.value)} className="mt-2 h-20 w-full rounded-lg border border-violet-100 bg-white p-3 text-sm leading-6 outline-none focus:border-violet-500" placeholder="What is the need, situation, or opportunity?" />
        </label>
        <label className="block lg:col-span-2">
          <span className="text-xs font-bold uppercase tracking-wide text-violet-700">Learner outcome notes</span>
          <textarea value={learnerNeed} onChange={(e) => setLearnerNeed(e.target.value)} className="mt-2 h-20 w-full rounded-lg border border-violet-100 bg-white p-3 text-sm leading-6 outline-none focus:border-violet-500" placeholder="What should the learner be able to do after this?" />
        </label>
        <label className="block lg:col-span-2">
          <span className="text-xs font-bold uppercase tracking-wide text-violet-700">Draft syllabus or topics</span>
          <textarea value={draftSyllabus} onChange={(e) => setDraftSyllabus(e.target.value)} className="mt-2 h-28 w-full rounded-lg border border-violet-100 bg-white p-3 text-sm leading-6 outline-none focus:border-violet-500" placeholder="Leave blank and let the curator build from the need." />
        </label>
        <label className="block lg:col-span-2">
          <span className="text-xs font-bold uppercase tracking-wide text-violet-700">Duration</span>
          <input value={draftDuration} onChange={(e) => setDraftDuration(e.target.value)} className="mt-2 w-full rounded-lg border border-violet-100 bg-white px-3 py-2.5 text-sm outline-none focus:border-violet-500" placeholder="Optional custom duration" />
        </label>
      </div>
    </Card>
    <Card className="border-blue-100 bg-blue-50/70">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex-1">
          <p className="text-xs font-bold uppercase tracking-[.16em] text-blue-700">No preset course selected</p>
          <p className="mt-2 text-sm leading-6 text-blue-900">The curator will build from the trainer-entered need, goal, context, and draft syllabus only.</p>
        </div>
        <button onClick={generateCuratorPack} disabled={isCurating || !trainerPrompt.trim()} className="rounded-lg bg-slate-950 px-4 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:bg-slate-400">{isCurating ? "Generating..." : pack ? "Regenerate course pack" : "Generate course pack"}</button>
      </div>
      {curatorResult && <div className="mt-3 rounded-lg border border-blue-100 bg-white p-3 text-xs font-semibold text-blue-900">Generated by {curatorResult.mode === "openai" ? "OpenAI" : "TaaS fallback AI"} using {curatorResult.model}. {curatorResult.notice}</div>}
      {curatorError && <div className="mt-3 rounded-lg border border-red-100 bg-red-50 p-3 text-sm font-semibold text-red-700">{curatorError}</div>}
    </Card>

    <Card>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div><h2 className="font-semibold text-slate-950">AI Inputs Used</h2><p className="mt-1 text-xs text-slate-500">Signals used to produce the trainer output.</p></div>
        <StatusPill tone={pack ? "green" : "amber"}>{pack ? "Generated" : "Ready"}</StatusPill>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {(pack?.aiInputs ?? [trainerPrompt, courseGoal, courseContext, learnerNeed].filter(Boolean)).map((input) => <div key={input} className="rounded-lg border border-slate-100 bg-slate-50 p-4 text-sm font-semibold leading-6 text-slate-700">{input}</div>)}
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
  const [prepNotes, setPrepNotes] = useState("");
  const deliveryDocs = [
    { status: "Past", title: "Acme Health GitLab CI/CD cohort", detail: "Attendance, feedback, lab completion, and follow-up actions archived.", tone: "slate" as const },
    { status: "Current", title: "Northstar SAFe DevOps delivery", detail: "Active roster, facilitator notes, open questions, and live delivery risks.", tone: "blue" as const },
    { status: "Upcoming", title: "Orbit Retail ICAgile workshop", detail: "Draft agenda, prep checklist, learner background, and readiness notes.", tone: "amber" as const },
  ];
  function generatePrepNotes() {
    setPrepNotes("Prep notes generated: review learner background, confirm lab access, open with value stream mapping, reserve time for Q&A, and capture unresolved blockers in the delivery record.");
  }
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
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between"><div><h2 className="font-semibold text-slate-950">Delivery documentation</h2><p className="mt-1 text-xs text-slate-500">Track documentation by past, current, and upcoming delivery events.</p></div><StatusPill tone={logSaved ? "green" : "amber"}>{logSaved ? "Saved" : "Draft"}</StatusPill></div>
    <div className="mt-5 grid gap-3 md:grid-cols-3">
      {deliveryDocs.map((doc) => <div key={doc.status} className="rounded-lg border border-slate-100 bg-slate-50 p-4">
        <StatusPill tone={doc.tone}>{doc.status}</StatusPill>
        <p className="mt-3 text-sm font-semibold text-slate-950">{doc.title}</p>
        <p className="mt-2 text-xs leading-5 text-slate-500">{doc.detail}</p>
      </div>)}
    </div>
    <div className="mt-5 grid gap-3 md:grid-cols-2">
      <input className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm" placeholder="Attendance, outcomes, risks or follow-ups" />
      <button onClick={generatePrepNotes} className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-bold text-white">{prepNotes ? "Prep notes generated" : "Generate prep notes"}</button>
    </div>
    <textarea className="mt-3 h-20 w-full rounded-lg border border-slate-200 bg-white p-3 text-sm" placeholder="Session notes and learner/user updates..." />
    {prepNotes && <div className="mt-3 rounded-lg border border-blue-100 bg-blue-50 p-3 text-sm leading-6 text-blue-900">{prepNotes}</div>}
    <button onClick={() => setLogSaved(true)} className="mt-3 rounded-lg bg-slate-950 px-4 py-2.5 text-xs font-bold text-white">Save session record</button>
  </Card></div>;
}

function LearnerPersona({ data }: { data: DashboardData }) {
  void data;
  return <PersonaModeShell title="Learner persona" description="Dashboard mode" customLabel="Custom" customView={<CustomDashboardBuilder persona="learner" />}><PrototypeFrame src="/personas/taas_learner_view.html" title="Learner console" /></PersonaModeShell>;
}

function ExecutivePersona({ data }: { data: DashboardData }) {
  void data;
  return <PersonaModeShell title="Executive persona" description="Dashboard mode" customLabel="Custom" customView={<CustomDashboardBuilder persona="executive" />}><PrototypeFrame src="/personas/taas_executive_view.html" title="Executive console" /></PersonaModeShell>;
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
