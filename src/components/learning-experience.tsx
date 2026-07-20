"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft, ArrowRight, Award, BookOpen, Check, CheckCircle2, ChevronLeft,
  ChevronRight, Circle, Clock3, GraduationCap, Lightbulb, ListChecks,
  RotateCcw, ShieldAlert, Sparkles, Target, Trophy, XCircle,
} from "lucide-react";
import {
  buildQuiz, lessonKey, moduleMinutes, PASS_PERCENTAGE, readCourse, readProgress,
  writeProgress, type LearningCourse, type LearningProgress,
} from "@/lib/learning";

type View = "module" | "lesson" | "quiz" | "results";

function route(moduleId: number, lessonId?: number, tail = "") {
  const lesson = lessonId === undefined ? "" : `/lesson/${lessonId}`;
  return `/learn/module/${moduleId}${lesson}${tail}`;
}

function LearningHeader({ course, progress }: { course: LearningCourse; progress: number }) {
  return <>
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center gap-4 px-4 md:px-8">
        <Link href="/#course-generator" className="flex items-center gap-2 font-bold text-[#17233b]"><span className="grid size-9 place-items-center rounded-xl bg-[#ff5b49] text-white"><GraduationCap size={19} /></span><span className="hidden sm:inline">Cprime Learning</span></Link>
        <div className="h-6 w-px bg-slate-200" />
        <p className="min-w-0 flex-1 truncate text-sm font-semibold text-slate-600">{course.title}</p>
        <div className="hidden items-center gap-3 sm:flex"><span className="text-xs font-semibold text-slate-500">Course progress</span><div className="h-2 w-28 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${progress}%` }} /></div><span className="text-xs font-bold">{progress}%</span></div>
      </div>
    </header>
    <div className="h-1 bg-slate-100 sm:hidden"><div className="h-full bg-emerald-500" style={{ width: `${progress}%` }} /></div>
  </>;
}

function MissingCourse() {
  return <main className="grid min-h-screen place-items-center bg-[#f5f7fb] p-6"><div className="max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm"><BookOpen className="mx-auto text-blue-600" size={36} /><h1 className="mt-5 text-xl font-bold">Open a module from your roadmap</h1><p className="mt-2 text-sm leading-6 text-slate-500">This learning page is connected to the course you generate. Return to the roadmap and select any module to begin.</p><Link href="/#course-generator" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#17233b] px-5 py-3 text-sm font-bold text-white"><ArrowLeft size={16} />Return to roadmap</Link></div></main>;
}

function ProgressBadge({ done }: { done: boolean }) {
  return done ? <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700"><CheckCircle2 size={13} />Completed</span> : <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-500"><Circle size={12} />Not started</span>;
}

function ModuleView({ course, moduleId, progress }: { course: LearningCourse; moduleId: number; progress: LearningProgress }) {
  const currentModule = course.modules[moduleId];
  const completed = currentModule.lessons.filter((_, lessonId) => progress.completedLessons.includes(lessonKey(moduleId, lessonId))).length;
  const percent = Math.round((completed / currentModule.lessons.length) * 100);
  const active = Math.min(completed, currentModule.lessons.length - 1);
  return <div className="mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-12">
    <Link href="/#course-generator" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-700"><ChevronLeft size={17} />Back to learning roadmap</Link>
    <section className="mt-7 overflow-hidden rounded-3xl bg-gradient-to-br from-[#17233b] via-[#1d3153] to-[#294a7a] text-white shadow-xl shadow-slate-300/50">
      <div className="grid gap-8 p-7 md:p-10 lg:grid-cols-[1fr_330px]">
        <div><span className="text-xs font-bold uppercase tracking-[.18em] text-blue-200">Module {moduleId + 1} of {course.modules.length}</span><h1 className="mt-3 max-w-3xl text-3xl font-bold leading-tight md:text-4xl">{currentModule.title}</h1><p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">{currentModule.description}</p><div className="mt-6 flex flex-wrap gap-4 text-xs font-semibold text-slate-200"><span className="flex items-center gap-2"><Clock3 size={16} />{moduleMinutes(currentModule)} minutes</span><span className="flex items-center gap-2"><BookOpen size={16} />{currentModule.lessons.length} lessons</span><span className="flex items-center gap-2"><CheckCircle2 size={16} />{completed} completed</span></div></div>
        <div className="rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur"><div className="flex items-end justify-between"><span className="text-sm font-semibold text-slate-200">Overall progress</span><span className="text-3xl font-bold">{percent}%</span></div><div className="mt-4 h-2.5 overflow-hidden rounded-full bg-white/15"><div className="h-full rounded-full bg-[#f8d34f] transition-all" style={{ width: `${percent}%` }} /></div><div className="mt-4 flex items-center gap-2 text-sm font-semibold">{percent === 100 ? <><Trophy size={18} className="text-[#f8d34f]" />Module complete</> : <><Sparkles size={18} className="text-[#f8d34f]" />{currentModule.lessons.length - completed} lessons remaining</>}</div></div>
      </div>
      <div className="border-t border-white/10 bg-black/10 px-7 py-5 md:px-10"><div className="flex gap-3"><Target className="mt-0.5 shrink-0 text-[#f8d34f]" size={20} /><div><p className="text-xs font-bold uppercase tracking-wider text-blue-200">Learning outcome</p><p className="mt-1 text-sm leading-6 text-white/90">{currentModule.outcome}</p></div></div></div>
    </section>

    <div className="mt-10 flex items-end justify-between"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-blue-600">Module curriculum</p><h2 className="mt-2 text-2xl font-bold">Lessons in this module</h2></div><span className="hidden text-sm text-slate-500 sm:block">Complete in order or revisit any lesson</span></div>
    <div className="mt-5 space-y-3">{currentModule.lessons.map((title, lessonId) => {
      const done = progress.completedLessons.includes(lessonKey(moduleId, lessonId));
      const isActive = lessonId === active;
      return <article key={title} className={`group rounded-2xl border bg-white p-5 shadow-sm transition md:p-6 ${isActive ? "border-blue-400 ring-2 ring-blue-100" : "border-slate-200 hover:border-slate-300 hover:shadow-md"}`}>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center"><div className={`grid size-12 shrink-0 place-items-center rounded-xl text-sm font-bold ${done ? "bg-emerald-100 text-emerald-700" : isActive ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500"}`}>{done ? <Check size={21} /> : lessonId + 1}</div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Lesson {lessonId + 1}</span>{isActive && !done && <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700">Active lesson</span>}<ProgressBadge done={done} /></div><h3 className="mt-1.5 text-lg font-bold">{title}</h3><p className="mt-1 text-sm leading-6 text-slate-500">Build practical understanding of {title.toLowerCase()} and apply it confidently in an enterprise delivery environment.</p><span className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-slate-400"><Clock3 size={14} />12 min read</span></div><Link href={route(moduleId, lessonId)} className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold ${isActive && !done ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}>{done ? "Review" : lessonId < active ? "Continue" : "Start"}<ChevronRight size={16} /></Link></div>
      </article>;
    })}</div>
  </div>;
}

function Callout({ type, title, children }: { type: "note" | "warning" | "tip" | "takeaway"; title: string; children: React.ReactNode }) {
  const styles = { note: "border-blue-200 bg-blue-50 text-blue-950", warning: "border-amber-200 bg-amber-50 text-amber-950", tip: "border-violet-200 bg-violet-50 text-violet-950", takeaway: "border-emerald-200 bg-emerald-50 text-emerald-950" };
  const Icon = type === "warning" ? ShieldAlert : type === "takeaway" ? CheckCircle2 : Lightbulb;
  return <aside className={`my-7 rounded-2xl border p-5 ${styles[type]}`}><div className="flex gap-3"><Icon className="mt-0.5 shrink-0" size={20} /><div><p className="font-bold">{title}</p><div className="mt-1 text-sm leading-6 opacity-80">{children}</div></div></div></aside>;
}

function LessonArticle({ topic, moduleTitle, outcome, lab }: { topic: string; moduleTitle: string; outcome: string; lab: string }) {
  return <article className="learning-article">
    <section id="introduction"><p className="section-kicker">Introduction</p><h2>Building a working understanding of {topic}</h2><p>{topic} is more than a definition to memorize. It is a way to improve how people make decisions, coordinate work, and deliver reliable outcomes. In this lesson, you will connect the concept to the wider context of {moduleTitle} and learn how to use it when conditions are uncertain.</p><p>Enterprise environments combine multiple teams, systems, policies, and customer needs. That complexity makes a structured approach valuable: it creates shared language without removing the judgment teams need to respond to real conditions.</p></section>
    <section id="why"><p className="section-kicker">Why this topic matters</p><h2>From isolated activity to measurable outcomes</h2><p>Organizations often invest in new practices but measure only whether activities occurred. Effective learning changes that focus. Teams define the outcome, understand the system around the work, and use evidence to decide what to improve next.</p><ul><li><b>For learners:</b> it provides a repeatable mental model for unfamiliar situations.</li><li><b>For teams:</b> it reduces ambiguity and improves cross-functional decisions.</li><li><b>For leaders:</b> it connects investment to observable customer and business outcomes.</li></ul></section>
    <Callout type="note" title="Important note">A practice is successful only when it improves the system’s outcome. Adoption, activity, and tool usage are supporting signals—not the goal.</Callout>
    <section id="concepts"><p className="section-kicker">Core concepts</p><h2>The four ideas to keep in view</h2><div className="grid gap-4 sm:grid-cols-2"><div className="concept-card"><b>1. Purpose</b><span>Define the customer, problem, and measurable outcome before choosing an approach.</span></div><div className="concept-card"><b>2. System</b><span>Understand dependencies, constraints, handoffs, and feedback across the full flow.</span></div><div className="concept-card"><b>3. Evidence</b><span>Use balanced measures and direct observation instead of assumptions or activity alone.</span></div><div className="concept-card"><b>4. Adaptation</b><span>Make a small change, inspect the result, and adjust based on what you learn.</span></div></div></section>
    <section id="explanation"><p className="section-kicker">Detailed explanation</p><h2>A practical cycle for applying the concept</h2><p>Start by writing a precise outcome statement: who should benefit, what should improve, and how the team will recognize progress. Next, map the current workflow from request to result. Include queues, approval points, rework, information gaps, and operational risks—not just the happy path.</p><ol><li><b>Frame the situation.</b> Gather perspectives from the people who request, perform, govern, and receive the work.</li><li><b>Find the constraint.</b> Identify where delay, risk, or uncertainty has the greatest effect on the outcome.</li><li><b>Design a safe experiment.</b> Change one meaningful condition within clear guardrails.</li><li><b>Measure balanced signals.</b> Track speed alongside quality, stability, customer value, and team health.</li><li><b>Review and standardize.</b> Keep what works, document why it works, and define the next review point.</li></ol>
      <div className="my-8 rounded-2xl bg-[#17233b] p-6 text-white"><p className="text-xs font-bold uppercase tracking-widest text-blue-200">Simple learning workflow</p><div className="mt-5 grid gap-2 text-center text-xs font-bold sm:grid-cols-5">{["Define outcome", "Map reality", "Choose experiment", "Observe evidence", "Adapt & share"].map((step, index) => <div key={step} className="relative rounded-xl bg-white/10 px-3 py-4">{step}{index < 4 && <ArrowRight className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 text-[#f8d34f] sm:block" size={16} />}</div>)}</div></div>
    </section>
    <section id="example"><p className="section-kicker">Real-world example</p><h2>Improving a slow delivery approval</h2><p>A financial-services team believed testing was delaying releases. A workflow review showed that completed changes waited an average of four days for risk approval because evidence arrived in inconsistent formats. Rather than asking testers to work faster, the team created an agreed evidence template and automated collection of routine controls.</p><p>The approval queue fell to less than one day while control coverage improved. The important move was viewing the entire system, validating the true constraint, and improving both flow and risk rather than trading one for the other.</p></section>
    <Callout type="tip" title="Best practice">Invite the people closest to the work into diagnosis and experiment design. Their operational knowledge reveals conditions that process diagrams and executive reports frequently miss.</Callout>
    <section id="case-study"><p className="section-kicker">Case study</p><h2>Scaling change across a product group</h2><p>A product group with eight teams attempted to standardize a new working method. The first rollout created a large checklist, but teams completed it without improving lead time or quality. The group reset around a shared outcome and allowed each team to run a bounded experiment.</p><div className="overflow-hidden rounded-2xl border border-slate-200"><div className="grid grid-cols-3 bg-slate-50 p-3 text-xs font-bold text-slate-500"><span>Stage</span><span>Action</span><span>Evidence</span></div>{[["Discover","Mapped delays and dependencies","Baseline established"],["Experiment","Piloted with two teams","Cycle time −23%"],["Scale","Shared principles and guardrails","Quality remained stable"]].map((row) => <div key={row[0]} className="grid grid-cols-3 border-t border-slate-200 p-3 text-xs leading-5"><b>{row[0]}</b><span>{row[1]}</span><span>{row[2]}</span></div>)}</div><p>The group scaled the proven principles and guardrails, not every local implementation detail. That balance preserved consistency while letting teams respond to different products and constraints.</p></section>
    <section id="mistakes"><p className="section-kicker">Common mistakes</p><h2>Patterns that weaken results</h2><ul><li><b>Starting with a preferred solution:</b> it narrows discovery and encourages confirmation bias.</li><li><b>Optimizing one team:</b> faster local work can simply create a larger downstream queue.</li><li><b>Using a single metric:</b> speed without quality, risk, or value produces distorted behavior.</li><li><b>Scaling before learning:</b> an untested assumption becomes more expensive when applied broadly.</li><li><b>Skipping reinforcement:</b> one workshop rarely changes day-to-day decisions on its own.</li></ul></section>
    <Callout type="warning" title="Watch for metric gaming">When a measure becomes a target, people may improve the number without improving the outcome. Pair quantitative signals with direct observation and customer feedback.</Callout>
    <section id="scenario"><p className="section-kicker">Engineering scenario</p><h2>A production incident repeats</h2><p>Imagine a team that resolves recurring incidents quickly but never reduces their frequency. Applying this lesson means expanding the boundary beyond mean time to restore. The team examines detection, change history, architecture, ownership, and learning after restoration.</p><p>A practical response is to reserve capacity for one recurrence-reduction experiment, define a leading indicator such as alert precision or automated coverage, and review the result after two delivery cycles. This creates a learning loop while preserving operational safety.</p></section>
    <section id="application"><p className="section-kicker">Practical application</p><h2>Try it in your environment</h2><p>Your module lab is: <b>{lab}</b></p><ol><li>Select one real workflow small enough to observe this week.</li><li>Write the intended outcome and two balanced measures.</li><li>Map the current state with at least three stakeholder perspectives.</li><li>Choose one reversible change and state what you expect to happen.</li><li>Schedule a review before starting the experiment.</li></ol></section>
    <Callout type="takeaway" title="Key takeaway">{outcome} The durable skill is not following a fixed recipe; it is using purpose, systems thinking, evidence, and feedback to make better decisions.</Callout>
    <section id="summary"><p className="section-kicker">Lesson summary</p><h2>What you learned</h2><p>{topic} becomes useful when it guides action in a real system. Begin with the outcome, examine the full flow, test assumptions safely, and use balanced evidence to adapt. This approach turns a concept into a repeatable enterprise capability.</p><h3>Key learning points</h3><ul><li>Outcomes provide direction; practices and tools provide options.</li><li>System-level observation prevents harmful local optimization.</li><li>Small, measured experiments accelerate learning while containing risk.</li><li>Balanced evidence supports better decisions and sustainable adoption.</li><li>Regular reflection turns individual experience into organizational learning.</li></ul></section>
  </article>;
}

function LessonView({ course, moduleId, lessonId, progress, updateProgress, reading }: { course: LearningCourse; moduleId: number; lessonId: number; progress: LearningProgress; updateProgress: (value: LearningProgress) => void; reading: number }) {
  const currentModule = course.modules[moduleId];
  const topic = currentModule.lessons[lessonId];
  const done = progress.completedLessons.includes(lessonKey(moduleId, lessonId));
  function markDone() {
    if (done) return;
    updateProgress({ ...progress, completedLessons: [...progress.completedLessons, lessonKey(moduleId, lessonId)] });
  }
  return <>
    <div className="sticky top-16 z-20 h-1 bg-slate-100"><div className="h-full bg-blue-600 transition-all" style={{ width: `${reading}%` }} /></div>
    <div className="mx-auto grid max-w-[1320px] gap-8 px-4 py-8 md:px-8 lg:grid-cols-[250px_minmax(0,760px)_220px]">
      <aside className="hidden lg:block"><div className="sticky top-28"><Link href={route(moduleId)} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500"><ChevronLeft size={16} />Module overview</Link><p className="mt-7 text-[10px] font-bold uppercase tracking-wider text-slate-400">In this lesson</p><nav className="mt-3 space-y-1 text-xs font-medium text-slate-500">{[["introduction","Introduction"],["why","Why it matters"],["concepts","Core concepts"],["explanation","Detailed explanation"],["example","Real-world example"],["case-study","Case study"],["mistakes","Common mistakes"],["scenario","Engineering scenario"],["application","Practical application"],["summary","Lesson summary"]].map(([id,label]) => <a key={id} href={`#${id}`} className="block rounded-lg px-3 py-2 hover:bg-white hover:text-blue-700">{label}</a>)}</nav></div></aside>
      <main className="min-w-0"><div className="rounded-3xl border border-slate-200 bg-white px-6 py-8 shadow-sm md:px-10 md:py-11"><div className="flex flex-wrap items-center gap-2"><span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">Lesson {lessonId + 1} of {currentModule.lessons.length}</span><span className="flex items-center gap-1.5 text-xs text-slate-400"><Clock3 size={14} />12 min read</span><ProgressBadge done={done} /></div><h1 className="mt-5 text-3xl font-bold leading-tight md:text-4xl">{topic}</h1><p className="mt-3 text-sm leading-6 text-slate-500">Module {moduleId + 1}: {currentModule.title}</p><LessonArticle topic={topic} moduleTitle={currentModule.title} outcome={currentModule.outcome} lab={currentModule.lab} />
        <div className="mt-10 rounded-3xl bg-gradient-to-br from-blue-600 to-violet-700 p-7 text-white md:p-9"><div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center"><div><span className="text-xs font-bold uppercase tracking-widest text-blue-200">Ready to check your understanding?</span><h2 className="mt-2 text-2xl font-bold">Test My Knowledge</h2><p className="mt-2 text-sm text-blue-100">5 questions · About 5 minutes · 80% to pass</p></div><Link href={route(moduleId, lessonId, "/quiz")} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-blue-700 shadow-lg">Start quiz<ArrowRight size={17} /></Link></div></div>
      </div>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3"><Link aria-disabled={lessonId === 0} href={lessonId === 0 ? route(moduleId) : route(moduleId, lessonId - 1)} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold"><ChevronLeft size={17} />{lessonId === 0 ? "Module overview" : "Previous lesson"}</Link><button onClick={markDone} disabled={done} className={`inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold ${done ? "bg-emerald-50 text-emerald-700" : "bg-emerald-600 text-white"}`}><CheckCircle2 size={17} />{done ? "Lesson completed" : "Mark as Done"}</button>{lessonId < currentModule.lessons.length - 1 && <Link href={route(moduleId, lessonId + 1)} className="inline-flex items-center gap-2 rounded-xl bg-[#17233b] px-4 py-3 text-sm font-bold text-white">Next lesson<ChevronRight size={17} /></Link>}</div>
      </main>
      <aside className="hidden xl:block"><div className="sticky top-28 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><span className="text-xs font-bold text-slate-500">Reading progress</span><span className="text-sm font-bold text-blue-700">{reading}%</span></div><div className="mt-3 h-2 rounded-full bg-slate-100"><div className="h-full rounded-full bg-blue-600" style={{ width: `${reading}%` }} /></div><p className="mt-5 text-[10px] font-bold uppercase tracking-wider text-slate-400">Module lessons</p><div className="mt-3 space-y-2">{currentModule.lessons.map((title, index) => <Link key={title} href={route(moduleId, index)} className={`flex gap-2 rounded-lg p-2 text-xs leading-5 ${index === lessonId ? "bg-blue-50 font-bold text-blue-800" : "text-slate-500"}`}><span>{progress.completedLessons.includes(lessonKey(moduleId,index)) ? "✓" : index + 1}</span><span>{title}</span></Link>)}</div></div></aside>
    </div>
  </>;
}

function QuizView({ course, moduleId, lessonId, progress, updateProgress }: { course: LearningCourse; moduleId: number; lessonId: number; progress: LearningProgress; updateProgress: (value: LearningProgress) => void }) {
  const router = useRouter();
  const currentModule = course.modules[moduleId];
  const topic = currentModule.lessons[lessonId];
  const questions = useMemo(() => buildQuiz(currentModule, topic), [currentModule, topic]);
  const [question, setQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const selected = answers[question];
  const current = questions[question];
  function choose(index: number) { if (selected === undefined) setAnswers([...answers, index]); }
  function next() {
    if (question < questions.length - 1) { setQuestion(question + 1); return; }
    const score = answers.reduce((total, answer, index) => total + (answer === questions[index].correct ? 1 : 0), 0);
    const percent = Math.round((score / questions.length) * 100);
    const passed = percent >= PASS_PERCENTAGE;
    const key = lessonKey(moduleId, lessonId);
    const completedLessons = passed && !progress.completedLessons.includes(key) ? [...progress.completedLessons, key] : progress.completedLessons;
    updateProgress({ completedLessons, quizAttempts: { ...progress.quizAttempts, [key]: { answers, score, passed, completedAt: new Date().toISOString() } } });
    router.push(route(moduleId, lessonId, "/quiz/results"));
  }
  return <main className="mx-auto max-w-3xl px-4 py-8 md:px-8 md:py-12"><Link href={route(moduleId, lessonId)} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500"><XCircle size={17} />Exit quiz</Link><div className="mt-7 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50 md:p-10">
    <div className="flex items-center justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-wider text-blue-600">Knowledge check</p><p className="mt-1 text-sm font-semibold text-slate-500">{topic}</p></div><span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold">Question {question + 1} of {questions.length}</span></div><div className="mt-6 flex gap-2">{questions.map((_, index) => <span key={index} className={`h-1.5 flex-1 rounded-full ${index <= question ? "bg-blue-600" : "bg-slate-100"}`} />)}</div>
    <h1 className="mt-9 text-2xl font-bold leading-9">{current.prompt}</h1><div className="mt-7 space-y-3">{current.choices.map((choice, index) => { const answered = selected !== undefined; const correct = index === current.correct; const chosen = index === selected; return <button key={choice.text} onClick={() => choose(index)} disabled={answered} className={`flex w-full items-center gap-4 rounded-2xl border-2 p-4 text-left text-sm font-semibold transition ${answered && correct ? "border-emerald-500 bg-emerald-50 text-emerald-950" : answered && chosen ? "border-red-400 bg-red-50 text-red-950" : "border-slate-200 bg-white hover:border-blue-400 hover:bg-blue-50"}`}><span className={`grid size-8 shrink-0 place-items-center rounded-full border text-xs font-bold ${answered && correct ? "border-emerald-500 bg-emerald-500 text-white" : answered && chosen ? "border-red-400 bg-red-400 text-white" : "border-slate-300"}`}>{answered && correct ? <Check size={16} /> : answered && chosen ? <XCircle size={16} /> : String.fromCharCode(65 + index)}</span>{choice.text}</button>; })}</div>
    {selected !== undefined && <div className={`mt-6 rounded-2xl border p-5 ${selected === current.correct ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"}`}><p className="font-bold">{selected === current.correct ? "Correct — well done." : "Not quite. Here’s why:"}</p><p className="mt-2 text-sm leading-6 text-slate-600">{current.choices[selected].explanation}</p>{selected !== current.correct && <p className="mt-2 text-sm leading-6 text-slate-600"><b>Correct answer:</b> {current.choices[current.correct].text}. {current.choices[current.correct].explanation}</p>}</div>}
    <div className="mt-7 flex justify-end"><button onClick={next} disabled={selected === undefined} className="inline-flex items-center gap-2 rounded-xl bg-[#17233b] px-6 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-40">{question === questions.length - 1 ? "View results" : "Next question"}<ArrowRight size={17} /></button></div>
  </div></main>;
}

function ResultsView({ course, moduleId, lessonId, progress }: { course: LearningCourse; moduleId: number; lessonId: number; progress: LearningProgress }) {
  const currentModule = course.modules[moduleId];
  const topic = currentModule.lessons[lessonId];
  const questions = buildQuiz(currentModule, topic);
  const attempt = progress.quizAttempts[lessonKey(moduleId, lessonId)];
  const [review, setReview] = useState(false);
  if (!attempt) return <main className="grid min-h-[70vh] place-items-center p-6"><div className="text-center"><ListChecks className="mx-auto text-blue-600" size={36} /><h1 className="mt-4 text-xl font-bold">Complete the quiz to see your results</h1><Link href={route(moduleId, lessonId, "/quiz")} className="mt-5 inline-flex rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white">Start quiz</Link></div></main>;
  const percent = Math.round((attempt.score / questions.length) * 100);
  const nextHref = lessonId < currentModule.lessons.length - 1 ? route(moduleId, lessonId + 1) : moduleId < course.modules.length - 1 ? route(moduleId + 1) : route(moduleId);
  return <main className="mx-auto max-w-4xl px-4 py-10 md:px-8 md:py-14"><section className="overflow-hidden rounded-3xl border border-slate-200 bg-white text-center shadow-xl shadow-slate-200/60"><div className={`p-8 md:p-12 ${attempt.passed ? "bg-gradient-to-br from-emerald-500 to-teal-600 text-white" : "bg-gradient-to-br from-amber-400 to-orange-500 text-white"}`}><span className="mx-auto grid size-20 place-items-center rounded-full bg-white/20"><Award size={42} /></span><p className="mt-5 text-xs font-bold uppercase tracking-[.2em]">Quiz complete</p><h1 className="mt-2 text-3xl font-bold">{attempt.passed ? "Excellent work — you passed!" : "Good effort — try once more"}</h1><p className="mt-3 text-sm text-white/80">{topic}</p></div><div className="p-7 md:p-10"><div className="mx-auto grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4"><div className="result-stat"><b>{percent}%</b><span>Final score</span></div><div className="result-stat"><b>{attempt.score}</b><span>Correct</span></div><div className="result-stat"><b>{questions.length - attempt.score}</b><span>Incorrect</span></div><div className="result-stat"><b className={attempt.passed ? "text-emerald-600" : "text-amber-600"}>{attempt.passed ? "Pass" : "Fail"}</b><span>Status</span></div></div><p className="mx-auto mt-7 max-w-xl text-sm leading-6 text-slate-500">{attempt.passed ? "Your lesson is now marked complete and module progress has been updated automatically." : `You need ${PASS_PERCENTAGE}% to pass. Review the explanations below, then retry when you’re ready.`}</p><div className="mt-7 flex flex-wrap justify-center gap-3"><button onClick={() => setReview(!review)} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold"><ListChecks size={17} />{review ? "Hide review" : "Review answers"}</button><Link href={route(moduleId, lessonId, "/quiz")} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold"><RotateCcw size={17} />Retry quiz</Link><Link href={nextHref} className="inline-flex items-center gap-2 rounded-xl bg-[#17233b] px-5 py-3 text-sm font-bold text-white">Continue learning<ArrowRight size={17} /></Link></div></div></section>
    {review && <section className="mt-8 space-y-4"><h2 className="text-xl font-bold">Answer review</h2>{questions.map((question, index) => { const chosen = attempt.answers[index]; const correct = chosen === question.correct; return <div key={question.prompt} className="rounded-2xl border border-slate-200 bg-white p-5"><div className="flex gap-3">{correct ? <CheckCircle2 className="shrink-0 text-emerald-600" size={20} /> : <XCircle className="shrink-0 text-red-500" size={20} />}<div><p className="font-bold">{index + 1}. {question.prompt}</p><p className="mt-2 text-sm text-slate-600"><b>Your answer:</b> {question.choices[chosen].text}</p>{!correct && <p className="mt-1 text-sm text-emerald-700"><b>Correct answer:</b> {question.choices[question.correct].text}</p>}<p className="mt-3 rounded-xl bg-slate-50 p-3 text-sm leading-6 text-slate-500">{question.choices[chosen].explanation}</p></div></div></div>; })}</section>}
  </main>;
}

export function LearningExperience({ view, moduleId, lessonId = 0 }: { view: View; moduleId: number; lessonId?: number }) {
  const [course, setCourse] = useState<LearningCourse | null>();
  const [progress, setProgress] = useState<LearningProgress>({ completedLessons: [], quizAttempts: {} });
  const [reading, setReading] = useState(0);
  useEffect(() => {
    const load = window.setTimeout(() => { setCourse(readCourse()); setProgress(readProgress()); }, 0);
    return () => window.clearTimeout(load);
  }, []);
  useEffect(() => {
    if (view !== "lesson") return;
    const update = () => { const available = document.documentElement.scrollHeight - window.innerHeight; setReading(available <= 0 ? 100 : Math.min(100, Math.round((window.scrollY / available) * 100))); };
    update(); window.addEventListener("scroll", update, { passive: true }); return () => window.removeEventListener("scroll", update);
  }, [view]);
  function updateProgress(value: LearningProgress) { setProgress(value); writeProgress(value); }
  if (course === undefined) return <main className="grid min-h-screen place-items-center bg-[#f5f7fb]"><span className="size-9 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" /></main>;
  if (!course || !course.modules[moduleId] || (view !== "module" && !course.modules[moduleId].lessons[lessonId])) return <MissingCourse />;
  const total = course.modules.reduce((sum, courseModule) => sum + courseModule.lessons.length, 0);
  const coursePercent = Math.round((progress.completedLessons.length / total) * 100);
  return <div className="min-h-screen bg-[#f5f7fb] text-[#17233b]"><LearningHeader course={course} progress={coursePercent} />{view === "module" && <ModuleView course={course} moduleId={moduleId} progress={progress} />}{view === "lesson" && <LessonView course={course} moduleId={moduleId} lessonId={lessonId} progress={progress} updateProgress={updateProgress} reading={reading} />}{view === "quiz" && <QuizView course={course} moduleId={moduleId} lessonId={lessonId} progress={progress} updateProgress={updateProgress} />}{view === "results" && <ResultsView course={course} moduleId={moduleId} lessonId={lessonId} progress={progress} />}</div>;
}
