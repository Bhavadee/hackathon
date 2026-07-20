"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight, BookOpen, Bot, Check, CheckCircle2, Clock3, FlaskConical,
  LoaderCircle, Sparkles, Target, Users,
} from "lucide-react";
import { COURSE_STORAGE_KEY } from "@/lib/learning";

type Result = {
  id: string;
  mode: "openai" | "taas";
  model: string;
  notice?: string;
  stages: { name: string; status: "complete" | "pending"; output: string }[];
  course: {
    title: string;
    description: string;
    format: string;
    duration: string;
    audience: string;
    jobRole: string;
    learningPathOverview: string;
    deliveryRecommendation: string;
    trainer: string;
    profitability: string;
    modules: {
      title: string;
      description: string;
      lessons: string[];
      outcome: string;
      quizQuestions: string[];
      lab: string;
    }[];
    assessmentStrategy: {
      moduleQuizzes: string;
      practicalLabs: string;
      finalCapstone: string;
      knowledgeValidation: string;
    };
    expectedSkills: string[];
    smeReviewNotice: string;
  };
};

function CourseRoadmap({ result }: { result: Result }) {
  const router = useRouter();
  const [selectedModule, setSelectedModule] = useState(0);
  const selected = result.course.modules[selectedModule];

  function openModule(index: number) {
    setSelectedModule(index);
    localStorage.setItem(COURSE_STORAGE_KEY, JSON.stringify(result.course));
    router.push(`/learn/module/${index}`);
  }

  return <div className="border-t border-slate-200 bg-[#f8f9fb] p-5 text-[#17233b] md:p-8 lg:p-10">
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700">Roadmap generated</span>
            <span className="text-[10px] font-semibold text-slate-400">{result.model}</span>
          </div>
          <h3 className="mt-3 text-2xl font-bold md:text-3xl">{result.course.title}</h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{result.course.description}</p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2 text-xs font-semibold text-slate-600">
          <span className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2"><BookOpen size={14} />{result.course.format}</span>
          <span className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2"><Clock3 size={14} />{result.course.duration}</span>
        </div>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-4"><p className="text-[10px] font-bold uppercase tracking-[.16em] text-blue-600">Learning path overview</p><p className="mt-2 text-xs leading-5 text-slate-600">{result.course.learningPathOverview}</p></div>
        <div className="rounded-xl border border-slate-200 bg-white p-4"><p className="text-[10px] font-bold uppercase tracking-[.16em] text-violet-600">Delivery recommendation</p><p className="mt-2 text-xs leading-5 text-slate-600">{result.course.deliveryRecommendation}</p></div>
      </div>

      <div className="mt-7 grid gap-3 md:grid-cols-4">
        {result.stages.map((stage) => <div key={stage.name} className="rounded-xl border border-slate-200 bg-white p-3">
          <div className="flex items-center gap-2"><span className={`grid size-5 place-items-center rounded-full text-white ${stage.status === "complete" ? "bg-emerald-500" : "bg-slate-300"}`}>{stage.status === "complete" ? <Check size={11} /> : <Clock3 size={11} />}</span><p className="text-xs font-bold">{stage.name}</p></div>
          <p className="mt-2 text-[11px] leading-4 text-slate-500">{stage.output}</p>
        </div>)}
      </div>

      {result.notice && <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-800">{result.notice} You can continue reviewing the complete roadmap below.</div>}

      <div className="mt-8 overflow-hidden rounded-2xl border border-slate-300 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-3 border-b border-slate-200 px-5 py-4 md:flex-row md:items-center">
          <div><p className="font-bold">Your learning roadmap</p><p className="mt-0.5 text-xs text-slate-500">Select any module to explore its outcome and hands-on work.</p></div>
          <div className="flex flex-wrap gap-3 text-[11px] font-semibold text-slate-500"><span className="flex items-center gap-1.5"><i className="size-3 rounded-sm border border-[#17233b] bg-[#f8d34f]" />Selected</span><span className="flex items-center gap-1.5"><i className="size-3 rounded-sm border border-[#17233b] bg-white" />Upcoming</span><span className="flex items-center gap-1.5"><i className="size-3 rounded-sm bg-emerald-500" />Start here</span></div>
        </div>

        <div className="roadmap-grid relative overflow-hidden bg-[#f7f7f5] px-4 py-10 md:px-8">
          <div className="pointer-events-none absolute inset-y-10 left-7 w-1 rounded-full bg-[#17233b] md:left-1/2 md:-translate-x-1/2" />
          <div className="relative space-y-7 md:space-y-5">
            {result.course.modules.map((module, index) => {
              const left = index % 2 === 0;
              const active = selectedModule === index;
              return <div key={module.title} className="relative grid grid-cols-[30px_1fr] items-center gap-4 md:grid-cols-[1fr_60px_1fr] md:gap-0">
                <div className={`${left ? "md:col-start-1 md:pr-6" : "md:col-start-3 md:pl-6"} col-start-2 row-start-1`}>
                  <button type="button" onClick={() => openModule(index)} aria-pressed={active} className={`w-full rounded-lg border-2 border-[#17233b] p-4 text-left shadow-[3px_3px_0_#17233b] transition hover:-translate-y-0.5 ${active ? "bg-[#f8d34f]" : "bg-white hover:bg-[#fff9dc]"}`}>
                    <div className="flex items-start justify-between gap-3"><div><span className="text-[10px] font-black uppercase tracking-[.16em] text-slate-500">Module {index + 1}</span><h4 className="mt-1 text-sm font-extrabold leading-5">{module.title}</h4></div>{index === 0 && <CheckCircle2 size={18} className="shrink-0 text-emerald-600" />}</div>
                    <div className="mt-3 flex flex-wrap gap-1.5">{module.lessons.map((lesson) => <span key={lesson} className="rounded border border-black/15 bg-white/70 px-2 py-1 text-[10px] font-medium text-slate-600">{lesson}</span>)}</div>
                  </button>
                </div>
                <div className="col-start-1 row-start-1 grid place-items-center md:col-start-2">
                  <span className="absolute left-[15px] h-0.5 w-8 bg-[#17233b] md:left-auto md:w-[60px]" />
                  <span className={`relative z-[1] grid size-8 place-items-center rounded-full border-[3px] border-[#17233b] text-xs font-black ${index === 0 ? "bg-emerald-400" : active ? "bg-[#f8d34f]" : "bg-white"}`}>{index + 1}</span>
                </div>
              </div>;
            })}
          </div>
        </div>

        <div className="grid border-t border-slate-200 lg:grid-cols-[1.2fr_.8fr]">
          <div className="p-5 md:p-7">
            <p className="text-[10px] font-bold uppercase tracking-[.18em] text-blue-600">Module {selectedModule + 1} details</p>
            <h4 className="mt-2 text-xl font-bold">{selected.title}</h4>
            <p className="mt-2 text-sm leading-6 text-slate-600">{selected.description}</p>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              <div className="flex gap-3 rounded-xl bg-blue-50 p-4 text-sm text-blue-950"><Target size={18} className="mt-0.5 shrink-0 text-blue-600" /><span><b>Learning outcome</b><br /><span className="mt-1 block text-xs leading-5 text-blue-900/75">{selected.outcome}</span></span></div>
              <div className="flex gap-3 rounded-xl bg-violet-50 p-4 text-sm text-violet-950"><FlaskConical size={18} className="mt-0.5 shrink-0 text-violet-600" /><span><b>Hands-on lab</b><br /><span className="mt-1 block text-xs leading-5 text-violet-900/75">{selected.lab}</span></span></div>
            </div>
          </div>
          <div className="border-t border-slate-200 bg-slate-50 p-5 md:p-7 lg:border-l lg:border-t-0">
            <div className="flex items-start gap-3"><Users size={18} className="mt-0.5 text-blue-600" /><div><p className="text-sm font-bold">Designed for</p><p className="mt-1 text-xs leading-5 text-slate-600">{result.course.audience}</p><p className="mt-1 text-xs font-semibold text-blue-700">Role: {result.course.jobRole}</p></div></div>
            <div className="mt-4 rounded-xl border border-slate-200 bg-white p-3 text-xs"><div className="mb-2 flex items-center justify-between"><b>{selected.quizQuestions.length} quiz questions</b><CheckCircle2 size={18} className="text-emerald-500" /></div><ol className="space-y-1.5 pl-4 text-[11px] leading-4 text-slate-500">{selected.quizQuestions.map((question) => <li key={question} className="list-decimal">{question}</li>)}</ol></div>
            <button onClick={() => openModule(selectedModule)} className="mt-4 w-full rounded-xl bg-[#17233b] px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-900">Review full course</button>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-6"><h4 className="font-bold">Assessment strategy</h4><div className="mt-4 space-y-3">{Object.entries(result.course.assessmentStrategy).map(([key, value]) => <div key={key} className="flex gap-3"><CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-500" /><div><p className="text-xs font-bold capitalize">{key.replace(/([A-Z])/g, " $1")}</p><p className="mt-1 text-xs leading-5 text-slate-500">{value}</p></div></div>)}</div></section>
        <section className="rounded-2xl border border-slate-200 bg-white p-6"><h4 className="font-bold">Expected skills after completion</h4><div className="mt-4 space-y-2">{result.course.expectedSkills.map((skill) => <div key={skill} className="flex gap-2 rounded-lg bg-slate-50 p-3 text-xs leading-5 text-slate-600"><Check size={14} className="mt-0.5 shrink-0 text-blue-600" />{skill}</div>)}</div></section>
      </div>

      <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-center text-[11px] leading-5 text-amber-800">{result.course.smeReviewNotice}</p>
    </div>
  </div>;
}

export function WorkflowLauncher() {
  const [objective, setObjective] = useState("Run a SAFe DevOps course next month");
  const [audience, setAudience] = useState("Technical professionals");
  const [jobRole, setJobRole] = useState("");
  const [certification, setCertification] = useState("");
  const [deliveryModel, setDeliveryModel] = useState("Blended");
  const [businessContext, setBusinessContext] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");

  async function run() {
    setLoading(true);
    setResult(null);
    setError("");
    try {
      const response = await fetch("/api/orchestrate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ objective, audience, jobRole, certification, deliveryModel, businessContext }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error ?? "Course generation failed.");
      setResult(body);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Course generation failed.");
    } finally {
      setLoading(false);
    }
  }

  return <div>
    <div className="grid lg:grid-cols-[1.05fr_.95fr]">
      <div className="p-7 md:p-10 lg:p-11">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-blue-100"><Bot size={14} /> AI training operations</span>
        <h2 className="mt-6 max-w-xl text-3xl font-bold leading-tight md:text-4xl">From learning request to visual roadmap.</h2>
        <p className="mt-4 max-w-xl text-sm leading-6 text-slate-300">Describe the outcome you need. The agent team will build a connected, step-by-step learning path that is ready for review.</p>
      </div>
      <div className="border-t border-white/10 bg-white/[.06] p-7 md:p-9 lg:border-l lg:border-t-0">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold"><Sparkles size={16} className="text-[#ff8b7e]" />Launch an agent workflow</div>
        <label className="text-[11px] font-semibold text-slate-300">Learning objective or topic</label>
        <textarea value={objective} onChange={(event) => setObjective(event.target.value)} className="mt-1.5 h-20 w-full resize-none rounded-xl border border-white/10 bg-[#0e192d] p-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-blue-400" aria-label="Learning objective" placeholder="e.g. DevOps for enterprise delivery teams" />
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <label className="text-[11px] font-semibold text-slate-300">Target audience<input value={audience} onChange={(event) => setAudience(event.target.value)} className="mt-1.5 w-full rounded-lg border border-white/10 bg-[#0e192d] px-3 py-2.5 text-sm font-normal text-white outline-none focus:border-blue-400" placeholder="Technical professionals" /></label>
          <label className="text-[11px] font-semibold text-slate-300">Job role<input value={jobRole} onChange={(event) => setJobRole(event.target.value)} className="mt-1.5 w-full rounded-lg border border-white/10 bg-[#0e192d] px-3 py-2.5 text-sm font-normal text-white outline-none focus:border-blue-400" placeholder="Optional" /></label>
          <label className="text-[11px] font-semibold text-slate-300">Certification track<input value={certification} onChange={(event) => setCertification(event.target.value)} className="mt-1.5 w-full rounded-lg border border-white/10 bg-[#0e192d] px-3 py-2.5 text-sm font-normal text-white outline-none focus:border-blue-400" placeholder="Optional" /></label>
          <label className="text-[11px] font-semibold text-slate-300">Delivery model<select value={deliveryModel} onChange={(event) => setDeliveryModel(event.target.value)} className="mt-1.5 w-full rounded-lg border border-white/10 bg-[#0e192d] px-3 py-2.5 text-sm font-normal text-white outline-none focus:border-blue-400"><option>Self-paced</option><option>Blended</option><option>Instructor-led</option><option>Virtual instructor-led</option><option>Private cohort</option></select></label>
        </div>
        <label className="mt-3 block text-[11px] font-semibold text-slate-300">Customer or business context<input value={businessContext} onChange={(event) => setBusinessContext(event.target.value)} className="mt-1.5 w-full rounded-lg border border-white/10 bg-[#0e192d] px-3 py-2.5 text-sm font-normal text-white outline-none focus:border-blue-400" placeholder="Optional enterprise requirement" /></label>
        <button onClick={run} disabled={loading || !objective.trim()} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#ff5b49] px-4 py-3 text-sm font-bold shadow-lg shadow-red-950/30 transition hover:bg-[#ff6c5b] disabled:opacity-60">{loading ? <LoaderCircle size={16} className="animate-spin" /> : <ArrowRight size={16} />} {loading ? "Building your roadmap..." : "Generate roadmap"}</button>
        {error && <div className="mt-3 rounded-xl border border-red-400/30 bg-red-500/10 p-3 text-xs leading-5 text-red-100">{error}</div>}
      </div>
    </div>
    {result && <CourseRoadmap result={result} />}
  </div>;
}
