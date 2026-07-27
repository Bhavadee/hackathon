import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { NextResponse } from "next/server";
import { z } from "zod";

const inputSchema = z.object({
  course: z.object({
    title: z.string().trim().min(2).max(180),
    status: z.string().trim().max(80),
    freshness: z.number().min(0).max(100),
    sourceVersion: z.string().trim().max(60),
  }),
  assignmentContext: z.string().trim().max(300).default("Upcoming private cohort"),
  learnerProfile: z.string().trim().max(300).default("Mixed experience enterprise learners"),
  deliveryMode: z.string().trim().max(80).default("Blended instructor-led"),
  classLength: z.string().trim().max(80).default("2 hours"),
});

const curatorPackSchema = z.object({
  readinessSummary: z.string(),
  aiInputs: z.array(z.string()).min(4).max(8),
  teachingStructure: z.array(z.object({
    step: z.string(),
    purpose: z.string(),
    trainerAction: z.string(),
    duration: z.string(),
  })).min(4).max(7),
  trainerNotes: z.array(z.string()).min(4).max(8),
  classroomPrompts: z.array(z.string()).min(3).max(6),
  materials: z.array(z.object({
    name: z.string(),
    use: z.string(),
  })).min(4).max(8),
  riskChecks: z.array(z.string()).min(3).max(6),
  smeReviewNotice: z.string(),
});

type CuratorInput = z.infer<typeof inputSchema>;
type CuratorPack = z.infer<typeof curatorPackSchema>;

const CURATOR_PROMPT = `You are the Cprime TaaS Trainer Course Curator Agent.

Your job is to help a trainer prepare before teaching an already-approved course. Do not create a new course. Curate the approved course into a practical delivery pack.

Use the provided course metadata, assignment context, learner profile, delivery mode, class length, and content freshness signal.

Generate:
- the AI inputs used
- a class-ready teaching structure
- trainer speaking and facilitation notes
- classroom prompts
- materials to prepare
- risk checks before teaching
- an SME review notice

Keep the output practical and concise. Focus on what the trainer should do before and during class. Do not reproduce proprietary certification content or exam questions.`;

function fallbackPack(input: CuratorInput): CuratorPack {
  const topic = input.course.title;
  return {
    readinessSummary: `${topic} curator pack prepared for ${input.deliveryMode.toLowerCase()} delivery. Content source v${input.course.sourceVersion} is ${input.course.freshness}% fresh, so trainer can proceed after quick source and lab validation.`,
    aiInputs: [
      `Approved course: ${topic}`,
      `Content status: ${input.course.status}, source v${input.course.sourceVersion}`,
      `Freshness signal: ${input.course.freshness}%`,
      `Assignment context: ${input.assignmentContext}`,
      `Learner profile: ${input.learnerProfile}`,
      `Delivery mode and class length: ${input.deliveryMode}, ${input.classLength}`,
    ],
    teachingStructure: [
      { step: "Context setup", purpose: "Connect the course to the client problem.", trainerAction: `Open with a short ${topic} scenario and define the outcomes learners should reach.`, duration: "10 min" },
      { step: "Core concepts", purpose: "Build shared vocabulary without overloading learners.", trainerAction: "Explain each concept with one practical example and one visual.", duration: "25 min" },
      { step: "Trainer demo", purpose: "Show the expected standard before learner practice.", trainerAction: "Walk through a guided example and call out decision points.", duration: "20 min" },
      { step: "Learner practice", purpose: "Move learners from listening to doing.", trainerAction: "Run a lab, breakout, or scenario activity using the approved course assets.", duration: "35 min" },
      { step: "Debrief and checks", purpose: "Confirm understanding and surface blockers.", trainerAction: "Ask reflection questions, correct misconceptions, and capture follow-up items.", duration: "20 min" },
      { step: "Wrap-up", purpose: "Make the next action clear.", trainerAction: "Summarize takeaways, share reference materials, and assign post-class practice.", duration: "10 min" },
    ],
    trainerNotes: [
      `Start with why ${topic} matters to this learner group before introducing terminology.`,
      "Use examples from the assignment context so the class feels relevant.",
      "Keep theory segments short and follow each one with a check-for-understanding prompt.",
      "Call out common mistakes before learners start the practice activity.",
      "Reserve time for questions after the demo and again after the activity.",
    ],
    classroomPrompts: [
      "Where does this show up in your current team workflow?",
      "What would make this hard to apply in your environment?",
      "Which decision would you make first, and what evidence would you use?",
      "What should be documented before handing this off to another team?",
    ],
    materials: [
      { name: "Facilitator guide", use: "Primary trainer runbook and timing reference." },
      { name: "Slide deck", use: "Concept framing and visual explanation." },
      { name: "Lab guide", use: "Learner practice and applied validation." },
      { name: "Demo script", use: "Step-by-step trainer walkthrough before practice." },
      { name: "Q&A prompts", use: "Discussion and misconception checks." },
      { name: "Assessment notes", use: "Evidence that learners met the session outcomes." },
    ],
    riskChecks: [
      "Confirm the deck and lab guide match the approved source version.",
      "Check lab environment access before class starts.",
      "Review learner background so examples match experience level.",
      "Keep certification references high-level and avoid protected exam content.",
    ],
    smeReviewNotice: "This curator pack is AI-generated and should be reviewed by a qualified trainer or SME before live delivery.",
  };
}

export async function POST(request: Request) {
  const parsed = inputSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Select a valid course before generating the curator pack." }, { status: 400 });
  }

  const local = (notice: string) => NextResponse.json({
    mode: "taas",
    model: "TaaS local curator engine",
    notice,
    pack: fallbackPack(parsed.data),
  });

  if (!process.env.OPENAI_API_KEY) {
    return local("Generated locally because OpenAI is not configured.");
  }

  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await openai.responses.parse({
      model: process.env.OPENAI_MODEL ?? "gpt-5.6",
      input: [
        { role: "system", content: CURATOR_PROMPT },
        { role: "user", content: JSON.stringify(parsed.data) },
      ],
      text: { format: zodTextFormat(curatorPackSchema, "trainer_curator_pack") },
    });

    if (!response.output_parsed) {
      return local("OpenAI returned no curator pack, so TaaS generated a local pack.");
    }

    return NextResponse.json({
      id: response.id,
      mode: "openai",
      model: process.env.OPENAI_MODEL ?? "gpt-5.6",
      pack: response.output_parsed,
    });
  } catch (error) {
    console.error("[course-curator] OpenAI unavailable; using TaaS fallback:", error instanceof Error ? error.message : "Unknown error");
    return local("OpenAI was unavailable, so TaaS generated a local curator pack.");
  }
}
