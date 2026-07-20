"use client";

import { useState } from "react";
import {
  BadgeCheck, CalendarDays, Check, CheckCircle2, ChevronRight,
  Clock3, Filter, MapPin, Search, SlidersHorizontal, UserCheck, Users, X,
} from "lucide-react";
import type { DashboardData } from "@/components/dashboard-tabs";
import type { LucideIcon } from "lucide-react";

type Trainer = DashboardData["trainers"][number];
type ActionItem = { id: string; label: string; detail: string; priority: "high" | "medium" | "low" };

const locations = ["Austin, US", "Bengaluru, IN", "Madrid, ES", "Toronto, CA", "London, UK", "Singapore", "Berlin, DE", "Hyderabad, IN", "Chicago, US", "Melbourne, AU"];

function actionsFor(trainer: Trainer, index: number): ActionItem[] {
  const actions: ActionItem[] = [];
  if (trainer.utilization >= 80) actions.push({ id: `${trainer.id}-capacity`, label: "Review delivery capacity", detail: "Utilization is above 80%; confirm preparation time before the next assignment.", priority: "high" });
  if (trainer.utilization < 60) actions.push({ id: `${trainer.id}-match`, label: "Match to an upcoming course", detail: "Available capacity can support a new learner cohort.", priority: "medium" });
  if (index % 3 === 0) actions.push({ id: `${trainer.id}-cert`, label: "Verify certification evidence", detail: "Certification record is due for its quarterly validation.", priority: "high" });
  if (index % 3 === 1) actions.push({ id: `${trainer.id}-availability`, label: "Confirm next-month availability", detail: "Ask the trainer to confirm delivery and preparation dates.", priority: "medium" });
  if (index % 4 === 2) actions.push({ id: `${trainer.id}-profile`, label: "Refresh trainer profile", detail: "Add a recent engagement, learner rating, or new specialist skill.", priority: "low" });
  if (index % 5 === 0) actions.push({ id: `${trainer.id}-feedback`, label: "Review learner feedback", detail: "Close the feedback loop from the trainer’s most recent cohort.", priority: "low" });
  return actions.length ? actions : [{ id: `${trainer.id}-ready`, label: "Confirm course assignment", detail: "Review the proposed course match and reserve the delivery dates.", priority: "low" }];
}

const priorityStyle = {
  high: "bg-red-50 text-red-700 border-red-100",
  medium: "bg-amber-50 text-amber-700 border-amber-100",
  low: "bg-blue-50 text-blue-700 border-blue-100",
};

type SummaryCard = {
  Icon: LucideIcon;
  label: string;
  value: number | string;
  detail: string;
  color: string;
};

export function TrainerNetwork({ trainers }: { trainers: Trainer[] }) {
  const [search, setSearch] = useState("");
  const [skill, setSkill] = useState("All skills");
  const [availability, setAvailability] = useState("All availability");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [completed, setCompleted] = useState<string[]>([]);
  const today = new Date();
  const skills = ["All skills", ...Array.from(new Set(trainers.flatMap((trainer) => trainer.skills))).sort()];
  const filtered = trainers.filter((trainer) => {
    const query = search.toLowerCase();
    const matchesSearch = !query || `${trainer.name} ${trainer.role} ${trainer.skills.join(" ")}`.toLowerCase().includes(query);
    const matchesSkill = skill === "All skills" || trainer.skills.includes(skill);
    const daysUntilAvailable = Math.ceil((new Date(trainer.availableFrom).getTime() - today.getTime()) / 86_400_000);
    const matchesAvailability = availability === "All availability" || (availability === "Available now" && daysUntilAvailable <= 1) || (availability === "Within 7 days" && daysUntilAvailable <= 7);
    return matchesSearch && matchesSkill && matchesAvailability;
  });
  const selectedIndex = trainers.findIndex((trainer) => trainer.id === selectedId);
  const selected = selectedIndex >= 0 ? trainers[selectedIndex] : null;
  const totalOpen = trainers.reduce((sum, trainer, index) => sum + actionsFor(trainer, index).filter((item) => !completed.includes(item.id)).length, 0);
  const available = trainers.filter((trainer) => Math.ceil((new Date(trainer.availableFrom).getTime() - today.getTime()) / 86_400_000) <= 7).length;
  const avgUtilization = Math.round(trainers.reduce((sum, trainer) => sum + trainer.utilization, 0) / trainers.length);
  const summaryCards: SummaryCard[] = [
    { Icon: Users, label: "Total trainers", value: trainers.length, detail: "Active network", color: "bg-blue-50 text-blue-700" },
    { Icon: UserCheck, label: "Available soon", value: available, detail: "Within 7 days", color: "bg-emerald-50 text-emerald-700" },
    { Icon: SlidersHorizontal, label: "Avg. utilization", value: `${avgUtilization}%`, detail: "Across the network", color: "bg-violet-50 text-violet-700" },
    { Icon: Clock3, label: "Open actions", value: totalOpen, detail: "Items needing attention", color: "bg-amber-50 text-amber-700" },
  ];

  return <>
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {summaryCards.map(({ Icon, label, value, detail, color }) => <article key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className={`grid size-10 place-items-center rounded-xl ${color}`}><Icon size={19} /></div><p className="mt-4 text-xs font-bold uppercase tracking-wider text-slate-400">{label}</p><p className="mt-1 text-2xl font-bold">{value}</p><p className="mt-1 text-xs text-slate-500">{detail}</p></article>)}
    </section>

    <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
      <div className="flex flex-col gap-3 lg:flex-row"><label className="relative flex-1"><Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={17} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search trainers, roles, or skills" className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500" /></label><label className="relative"><Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} /><select value={skill} onChange={(event) => setSkill(event.target.value)} className="min-w-48 appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-8 text-sm font-semibold outline-none">{skills.map((item) => <option key={item}>{item}</option>)}</select></label><select value={availability} onChange={(event) => setAvailability(event.target.value)} className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold outline-none"><option>All availability</option><option>Available now</option><option>Within 7 days</option></select></div>
    </section>

    <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{filtered.map((trainer) => {
      const index = trainers.findIndex((item) => item.id === trainer.id);
      const actions = actionsFor(trainer, index);
      const open = actions.filter((item) => !completed.includes(item.id));
      const days = Math.max(0, Math.ceil((new Date(trainer.availableFrom).getTime() - today.getTime()) / 86_400_000));
      return <button type="button" key={trainer.id} onClick={() => setSelectedId(trainer.id)} className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md">
        <div className="flex items-start justify-between"><div className={`grid size-12 place-items-center rounded-xl text-sm font-bold ${["bg-violet-100 text-violet-700", "bg-blue-100 text-blue-700", "bg-orange-100 text-orange-700", "bg-emerald-100 text-emerald-700"][index % 4]}`}>{trainer.name.split(" ").map((name) => name[0]).join("")}</div><span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${days <= 1 ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>{days <= 1 ? "Available now" : `Available in ${days}d`}</span></div>
        <h3 className="mt-4 font-bold">{trainer.name}</h3><p className="mt-1 text-sm text-slate-500">{trainer.role}</p><p className="mt-2 flex items-center gap-1.5 text-xs text-slate-400"><MapPin size={13} />{locations[index % locations.length]}</p><div className="mt-4 flex flex-wrap gap-1.5">{trainer.skills.slice(0, 3).map((item) => <span key={item} className="rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">{item}</span>)}</div>
        <div className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4"><div><p className="text-[10px] uppercase tracking-wider text-slate-400">Utilization</p><p className={`mt-1 font-bold ${trainer.utilization >= 80 ? "text-amber-600" : "text-emerald-600"}`}>{trainer.utilization}%</p></div><div><p className="text-[10px] uppercase tracking-wider text-slate-400">Rate</p><p className="mt-1 font-bold">${trainer.hourlyRate}/hr</p></div></div>
        <div className={`mt-4 flex items-center justify-between rounded-xl p-3 ${open.length ? "bg-amber-50 text-amber-800" : "bg-emerald-50 text-emerald-700"}`}><span className="text-xs font-bold">{open.length ? `${open.length} action${open.length === 1 ? "" : "s"} needed` : "All actions complete"}</span>{open.length ? <ChevronRight size={16} /> : <CheckCircle2 size={16} />}</div>
      </button>;
    })}</div>
    {!filtered.length && <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">No trainers match these filters.</div>}

    {selected && <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/40 backdrop-blur-sm" onMouseDown={(event) => { if (event.currentTarget === event.target) setSelectedId(null); }}><aside className="h-full w-full max-w-xl overflow-y-auto bg-[#f7f9fc] shadow-2xl"><div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4"><div><p className="text-xs font-bold uppercase tracking-wider text-blue-600">Trainer profile</p><h2 className="mt-1 text-lg font-bold">Operational details</h2></div><button onClick={() => setSelectedId(null)} className="grid size-9 place-items-center rounded-full bg-slate-100 text-slate-500"><X size={18} /></button></div><div className="p-6">
      <section className="rounded-2xl bg-[#17233b] p-6 text-white"><div className="flex items-start gap-4"><div className="grid size-14 shrink-0 place-items-center rounded-xl bg-white/10 font-bold">{selected.name.split(" ").map((name) => name[0]).join("")}</div><div><h3 className="text-xl font-bold">{selected.name}</h3><p className="mt-1 text-sm text-slate-300">{selected.role}</p><p className="mt-2 flex items-center gap-1.5 text-xs text-slate-400"><MapPin size={13} />{locations[selectedIndex % locations.length]}</p></div></div><div className="mt-6 grid grid-cols-3 gap-3"><div><p className="text-[10px] uppercase text-slate-400">Utilization</p><p className="mt-1 font-bold">{selected.utilization}%</p></div><div><p className="text-[10px] uppercase text-slate-400">Rate</p><p className="mt-1 font-bold">${selected.hourlyRate}/hr</p></div><div><p className="text-[10px] uppercase text-slate-400">Available</p><p className="mt-1 text-sm font-bold">{new Date(selected.availableFrom).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</p></div></div></section>
      <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5"><h3 className="flex items-center gap-2 font-bold"><BadgeCheck className="text-blue-600" size={19} />Skills and credentials</h3><div className="mt-4 flex flex-wrap gap-2">{selected.skills.map((item) => <span key={item} className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">{item}</span>)}</div><div className="mt-4 space-y-2">{selected.certifications.map((item) => <p key={item} className="flex items-center gap-2 text-sm text-slate-600"><CheckCircle2 className="text-emerald-500" size={16} />{item}</p>)}</div></section>
      <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5"><div className="flex items-center justify-between"><div><h3 className="font-bold">What needs to be done</h3><p className="mt-1 text-xs text-slate-500">Complete these actions to keep this trainer assignment-ready.</p></div><span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700">{actionsFor(selected, selectedIndex).filter((item) => !completed.includes(item.id)).length} open</span></div><div className="mt-4 space-y-3">{actionsFor(selected, selectedIndex).map((item) => { const done = completed.includes(item.id); return <button key={item.id} onClick={() => setCompleted(done ? completed.filter((id) => id !== item.id) : [...completed, item.id])} className={`flex w-full gap-3 rounded-xl border p-4 text-left transition ${done ? "border-emerald-100 bg-emerald-50" : "border-slate-200 hover:border-blue-300"}`}><span className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border ${done ? "border-emerald-500 bg-emerald-500 text-white" : "border-slate-300"}`}>{done && <Check size={13} />}</span><span className="flex-1"><span className={`block text-sm font-bold ${done ? "text-emerald-800 line-through" : "text-slate-800"}`}>{item.label}</span><span className="mt-1 block text-xs leading-5 text-slate-500">{item.detail}</span></span><span className={`h-fit rounded-full border px-2 py-1 text-[9px] font-bold uppercase ${priorityStyle[item.priority]}`}>{item.priority}</span></button>; })}</div></section>
      <button className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-bold text-white"><CalendarDays size={17} />Create course assignment</button>
    </div></aside></div>}
  </>;
}
