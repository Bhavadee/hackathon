export type LearningCourse = {
  title: string;
  description: string;
  duration: string;
  audience: string;
  jobRole: string;
  modules: LearningModule[];
};

export type LearningModule = {
  title: string;
  description: string;
  lessons: string[];
  outcome: string;
  quizQuestions: string[];
  lab: string;
};

export type LearningProgress = {
  completedLessons: string[];
  quizAttempts: Record<string, QuizAttempt>;
};

export type QuizAttempt = {
  answers: number[];
  score: number;
  passed: boolean;
  completedAt: string;
};

export type QuizChoice = { text: string; explanation: string };
export type QuizQuestion = {
  prompt: string;
  choices: QuizChoice[];
  correct: number;
};

export const COURSE_STORAGE_KEY = "cprime-learning-course";
export const PROGRESS_STORAGE_KEY = "cprime-learning-progress";
export const PASS_PERCENTAGE = 80;

export function lessonKey(moduleId: number, lessonId: number) {
  return `${moduleId}:${lessonId}`;
}

export function readProgress(): LearningProgress {
  if (typeof window === "undefined") return { completedLessons: [], quizAttempts: {} };
  try {
    const stored = JSON.parse(localStorage.getItem(PROGRESS_STORAGE_KEY) ?? "null") as LearningProgress | null;
    return stored ?? { completedLessons: [], quizAttempts: {} };
  } catch {
    return { completedLessons: [], quizAttempts: {} };
  }
}

export function writeProgress(progress: LearningProgress) {
  localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
}

export function readCourse(): LearningCourse | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = JSON.parse(localStorage.getItem(COURSE_STORAGE_KEY) ?? "null") as LearningCourse | null;
    return stored?.modules?.length ? stored : null;
  } catch {
    return null;
  }
}

export function moduleMinutes(module: LearningModule) {
  return module.lessons.length * 12;
}

export function buildQuiz(module: LearningModule, lessonTitle: string): QuizQuestion[] {
  const outcome = module.outcome.replace(/\.$/, "");
  return [
    {
      prompt: `What is the best first step when applying ${lessonTitle} in an enterprise setting?`,
      correct: 1,
      choices: [
        { text: "Select a tool before agreeing on the outcome", explanation: "Tools should support an agreed outcome, not define it." },
        { text: "Clarify the outcome, stakeholders, and current constraints", explanation: "Correct. Shared context makes later decisions intentional and measurable." },
        { text: "Copy another team’s process without changes", explanation: "A borrowed process may ignore local risks, capabilities, and constraints." },
        { text: "Optimize one activity in isolation", explanation: "Local optimization can reduce performance across the wider system." },
      ],
    },
    {
      prompt: `Which evidence most strongly shows that the lesson’s concepts are working?`,
      correct: 2,
      choices: [
        { text: "The team attended a presentation", explanation: "Attendance records exposure, not behavior change or improved outcomes." },
        { text: "More documentation was produced", explanation: "Documentation is useful only when it improves decisions or execution." },
        { text: `Observable progress toward: ${outcome}`, explanation: "Correct. Evidence should connect directly to the stated learning outcome." },
        { text: "A senior leader approved the terminology", explanation: "Approval alone does not demonstrate effective application." },
      ],
    },
    {
      prompt: `A team is struggling to adopt ${lessonTitle}. What is the most effective response?`,
      correct: 0,
      choices: [
        { text: "Run a small experiment, inspect evidence, and adapt", explanation: "Correct. A bounded feedback loop reduces risk while creating useful learning." },
        { text: "Mandate every practice immediately", explanation: "A large forced change hides cause and effect and often creates resistance." },
        { text: "Wait until all uncertainty is removed", explanation: "Complex work never becomes fully certain before action." },
        { text: "Measure individual activity instead of team outcomes", explanation: "Activity measures encourage busyness and weaken shared ownership." },
      ],
    },
    {
      prompt: "Which approach best supports sustainable enterprise adoption?",
      correct: 3,
      choices: [
        { text: "Treat the practice as a one-time rollout", explanation: "Adoption requires continued learning, reinforcement, and feedback." },
        { text: "Keep decisions within one specialist team", explanation: "Silos prevent the shared understanding needed for durable change." },
        { text: "Reward speed regardless of quality or risk", explanation: "Speed without balancing measures can increase rework and exposure." },
        { text: "Create clear ownership, feedback loops, and balanced measures", explanation: "Correct. These elements make improvement visible and repeatable." },
      ],
    },
    {
      prompt: `When should the team revisit its approach to ${lessonTitle}?`,
      correct: 1,
      choices: [
        { text: "Only after a major failure", explanation: "Waiting for failure makes learning expensive and reactive." },
        { text: "At regular review points and when evidence changes", explanation: "Correct. Frequent inspection keeps the approach aligned with reality." },
        { text: "Never, once the process is documented", explanation: "A documented process still needs to evolve with its environment." },
        { text: "Whenever a new tool is released", explanation: "Tool changes alone are not a reason to abandon an effective approach." },
      ],
    },
  ];
}
