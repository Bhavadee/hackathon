"use client";

import { useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight, BookOpen, Bot, Check, CheckCircle2, Clock3, FlaskConical,
  LoaderCircle, Sparkles, Target, Users,
} from "lucide-react";
import { COURSE_STORAGE_KEY } from "@/lib/learning";

const MY_LEARNING_STORAGE_KEY = "cprime-my-learning-courses";
const MY_LEARNING_STORAGE_EVENT = "cprime-my-learning-courses-updated";
const ACTIVE_ROADMAP_STORAGE_KEY = "cprime-active-learning-roadmap";
const ACTIVE_ROADMAP_STORAGE_EVENT = "cprime-active-learning-roadmap-updated";

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

type SavedLearningCourse = {
  id: string;
  savedAt: string;
  course: Result["course"];
  result?: Result;
};

let cachedSavedCoursesSnapshot = "";
let cachedSavedCourses: SavedLearningCourse[] = [];
const emptySavedCourses: SavedLearningCourse[] = [];
let cachedActiveRoadmapSnapshot = "";
let cachedActiveRoadmap: Result | null = null;

function readSavedCourses(): SavedLearningCourse[] {
  if (typeof window === "undefined") return [];
  try {
    const snapshot = localStorage.getItem(MY_LEARNING_STORAGE_KEY) ?? "[]";
    if (snapshot === cachedSavedCoursesSnapshot) return cachedSavedCourses;
    cachedSavedCoursesSnapshot = snapshot;
    const parsed = JSON.parse(snapshot) as SavedLearningCourse[];
    cachedSavedCourses = Array.isArray(parsed) ? parsed.filter((item) => item.course?.modules?.length) : [];
    return cachedSavedCourses;
  } catch {
    return [];
  }
}

function writeSavedCourses(courses: SavedLearningCourse[]) {
  localStorage.setItem(MY_LEARNING_STORAGE_KEY, JSON.stringify(courses));
  window.dispatchEvent(new Event(MY_LEARNING_STORAGE_EVENT));
}

function readActiveRoadmap(): Result | null {
  if (typeof window === "undefined") return null;
  try {
    const snapshot = localStorage.getItem(ACTIVE_ROADMAP_STORAGE_KEY) ?? "";
    if (snapshot === cachedActiveRoadmapSnapshot) return cachedActiveRoadmap;
    cachedActiveRoadmapSnapshot = snapshot;
    cachedActiveRoadmap = JSON.parse(snapshot || "null") as Result | null;
    return cachedActiveRoadmap?.course?.modules?.length ? cachedActiveRoadmap : null;
  } catch {
    return null;
  }
}

function writeActiveRoadmap(result: Result) {
  localStorage.setItem(ACTIVE_ROADMAP_STORAGE_KEY, JSON.stringify(result));
  localStorage.setItem(COURSE_STORAGE_KEY, JSON.stringify(result.course));
  window.dispatchEvent(new Event(ACTIVE_ROADMAP_STORAGE_EVENT));
}

function subscribeToSavedCourses(onStoreChange: () => void) {
  function handleStorage(event: StorageEvent) {
    if (event.key === MY_LEARNING_STORAGE_KEY) onStoreChange();
  }
  window.addEventListener("storage", handleStorage);
  window.addEventListener(MY_LEARNING_STORAGE_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(MY_LEARNING_STORAGE_EVENT, onStoreChange);
  };
}

function subscribeToActiveRoadmap(onStoreChange: () => void) {
  function handleStorage(event: StorageEvent) {
    if (event.key === ACTIVE_ROADMAP_STORAGE_KEY) onStoreChange();
  }
  window.addEventListener("storage", handleStorage);
  window.addEventListener(ACTIVE_ROADMAP_STORAGE_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(ACTIVE_ROADMAP_STORAGE_EVENT, onStoreChange);
  };
}

function courseId(course: Result["course"]) {
  return course.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "generated-course";
}

function resultFromSavedCourse(item: SavedLearningCourse): Result {
  return item.result ?? {
    id: item.id,
    mode: "taas",
    model: "Saved My Learning course",
    stages: [
      { name: "Saved course", status: "complete", output: "Loaded from My Learning." },
      { name: "Curriculum", status: "complete", output: `${item.course.modules.length} modules ready.` },
      { name: "Learning path", status: "complete", output: "Roadmap restored from local storage." },
      { name: "Ready", status: "complete", output: "Select a module to continue." },
    ],
    course: item.course,
  };
}

function CourseRoadmap({ result, isSaved, onAddToMyLearning }: { result: Result; isSaved: boolean; onAddToMyLearning: () => void }) {
  const router = useRouter();
  const [selectedModule, setSelectedModule] = useState(0);
  const selected = result.course.modules[selectedModule];

  function openModule(index: number) {
    setSelectedModule(index);
    localStorage.setItem(COURSE_STORAGE_KEY, JSON.stringify(result.course));
    router.push(`/learn/module/${index}`);
  }

  return <div id="generated-roadmap" className="border-t border-slate-200 bg-[#f8f9fb] p-5 text-[#17233b] md:p-8 lg:p-10">
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
          <button onClick={onAddToMyLearning} className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold ${isSaved ? "bg-emerald-50 text-emerald-700" : "bg-[#17233b] text-white"}`}>
            <CheckCircle2 size={14} />{isSaved ? "Added to My Learning" : "Add to My Learning"}
          </button>
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

function RoadmapLoadingState() {
  return <section className="border-t border-slate-200 bg-[#f8f9fb] p-5 text-[#17233b] md:p-8 lg:p-10">
    <div className="mx-auto max-w-6xl rounded-lg border border-blue-100 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-4">
          <span className="grid size-12 shrink-0 place-items-center rounded-lg bg-blue-50 text-blue-700">
            <LoaderCircle size={22} className="animate-spin" />
          </span>
          <div>
            <p className="text-xs font-bold uppercase tracking-[.16em] text-blue-600">Generating new roadmap</p>
            <h3 className="mt-1 text-xl font-semibold text-slate-950">Building course structure, modules, labs, and assessments.</h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">This view will update when the new roadmap is ready.</p>
          </div>
        </div>
        <div className="grid w-full gap-2 md:w-64">
          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full w-2/3 animate-pulse rounded-full bg-blue-500" />
          </div>
          <p className="text-xs font-semibold text-slate-400">Agent workflow running</p>
        </div>
      </div>
    </div>
  </section>;
}

function MyLearningCourses({ courses, onOpenRoadmap }: { courses: SavedLearningCourse[]; onOpenRoadmap: (item: SavedLearningCourse) => void }) {
  return <section className="mt-5 rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:p-6">
    <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="text-xs font-bold uppercase tracking-[.16em] text-blue-600">My Learning</p>
        <h2 className="mt-1 text-xl font-semibold text-slate-950">Saved courses</h2>
      </div>
      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500">{courses.length} saved</span>
    </div>
    {courses.length ? <div className="mt-4 grid gap-3 md:grid-cols-2">
      {courses.map((item) => (
        <article key={item.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-950">{item.course.title}</h3>
              <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">{item.course.description}</p>
            </div>
            <span className="shrink-0 rounded-md bg-white px-2 py-1 text-[10px] font-bold text-slate-500">{item.course.modules.length} modules</span>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-semibold text-slate-400">Saved {new Date(item.savedAt).toLocaleDateString()}</span>
            <button onClick={() => onOpenRoadmap(item)} className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-bold text-white">Start course</button>
          </div>
        </article>
      ))}
    </div> : <div className="mt-4 rounded-lg border border-dashed border-slate-200 bg-slate-50 p-5 text-sm leading-6 text-slate-500">
      Generated courses you add will appear here.
    </div>}
  </section>;
}

export function WorkflowLauncher() {
  const [objective, setObjective] = useState("Run a SAFe DevOps course next month");
  const [loading, setLoading] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<Result | null>(null);
  const [error, setError] = useState("");
  const savedCourses = useSyncExternalStore(subscribeToSavedCourses, readSavedCourses, () => emptySavedCourses);
  const activeRoadmap = useSyncExternalStore(subscribeToActiveRoadmap, readActiveRoadmap, () => null);
  const result = generatedResult ?? activeRoadmap;
  const generatedCourseId = result ? courseId(result.course) : "";
  const isGeneratedCourseSaved = Boolean(generatedCourseId && savedCourses.some((item) => item.id === generatedCourseId));

  function addToMyLearning() {
    if (!result) return;
    const id = courseId(result.course);
    const nextCourse = { id, savedAt: new Date().toISOString(), course: result.course, result };
    const otherCourses = readSavedCourses().filter((item) => item.id !== id);
    writeSavedCourses([nextCourse, ...otherCourses].slice(0, 12));
    writeActiveRoadmap(result);
  }

  function openSavedRoadmap(item: SavedLearningCourse) {
    const roadmap = resultFromSavedCourse(item);
    setGeneratedResult(roadmap);
    writeActiveRoadmap(roadmap);
    window.setTimeout(() => document.getElementById("generated-roadmap")?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
  }

  async function run() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/orchestrate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ objective }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error ?? "Course generation failed.");
      const generated = body as Result;
      setGeneratedResult(generated);
      writeActiveRoadmap(generated);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Course generation failed.");
    } finally {
      setLoading(false);
    }
  }

  return <div className="bg-[#f5f7fb] text-[#17233b]">
    <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="grid gap-0 lg:grid-cols-[.9fr_1.1fr]">
        <div className="border-b border-slate-200 p-5 md:p-6 lg:border-b-0 lg:border-r">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-lg bg-blue-50 text-blue-700"><Bot size={18} /></span>
            <div>
              <p className="text-xs font-bold uppercase tracking-[.16em] text-blue-600">AI training operations</p>
              <h2 className="mt-1 text-xl font-semibold text-slate-950">Build a learning roadmap</h2>
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-600">
            Enter a training need and the agent workflow creates a course outline, timeline, modules, labs, and assessment plan for review.
          </p>
          <div className="mt-5 grid gap-2">
            {[
              "Capture learning objective",
              "Generate course structure",
              "Create visual learner roadmap",
            ].map((step, index) => (
              <div key={step} className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5">
                <span className="grid size-7 place-items-center rounded-full bg-slate-950 text-xs font-bold text-white">{index + 1}</span>
                <span className="text-sm font-semibold text-slate-700">{step}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="p-5 md:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-950"><Sparkles size={16} className="text-[#ff5b49]" />Course generator</div>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-700">Ready</span>
          </div>
          <label className="block">
            <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Learning objective or topic</span>
            <textarea
              value={objective}
              onChange={(event) => setObjective(event.target.value)}
              className="mt-2 h-28 w-full resize-none rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm leading-6 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
              aria-label="Learning objective"
              placeholder="e.g. DevOps for enterprise delivery teams"
            />
          </label>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs leading-5 text-slate-500">The response is validated before the roadmap appears.</p>
            <button onClick={run} disabled={loading || !objective.trim()} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#ff5b49] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#e94d3d] disabled:cursor-not-allowed disabled:bg-slate-300">{loading ? <LoaderCircle size={16} className="animate-spin" /> : <ArrowRight size={16} />} {loading ? "Building roadmap..." : "Generate roadmap"}</button>
          </div>
          {error && <div className="mt-4 rounded-lg border border-red-100 bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</div>}
        </div>
      </div>
    </section>
    <MyLearningCourses courses={savedCourses} onOpenRoadmap={openSavedRoadmap} />
    {loading ? <RoadmapLoadingState /> : result && <CourseRoadmap result={result} isSaved={isGeneratedCourseSaved} onAddToMyLearning={addToMyLearning} />}
  </div>;
}
