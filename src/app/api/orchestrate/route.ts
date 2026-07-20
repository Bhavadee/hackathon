import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { NextResponse } from "next/server";
import { z } from "zod";
import { transaction } from "@/lib/pg";

const inputSchema = z.object({
  objective: z.string().trim().min(2).max(500),
  audience: z.string().trim().max(160).optional().default("Working professionals"),
  jobRole: z.string().trim().max(120).optional().default(""),
  certification: z.string().trim().max(120).optional().default(""),
  deliveryModel: z.enum(["Self-paced", "Blended", "Instructor-led", "Virtual instructor-led", "Private cohort"]).optional().default("Blended"),
  businessContext: z.string().trim().max(300).optional().default(""),
});

const courseSchema = z.object({
  title: z.string(),
  description: z.string(),
  format: z.enum(["Self-paced", "Blended", "Instructor-led", "Virtual instructor-led", "Private cohort"]),
  duration: z.string(),
  audience: z.string(),
  jobRole: z.string(),
  learningPathOverview: z.string(),
  deliveryRecommendation: z.string(),
  modules: z.array(z.object({
    title: z.string(),
    description: z.string(),
    lessons: z.array(z.string()).min(2).max(4),
    outcome: z.string(),
    quizQuestions: z.array(z.string()).min(3).max(8),
    lab: z.string(),
  })).length(6),
  assessmentStrategy: z.object({
    moduleQuizzes: z.string(),
    practicalLabs: z.string(),
    finalCapstone: z.string(),
    knowledgeValidation: z.string(),
  }),
  expectedSkills: z.array(z.string()),
  smeReviewNotice: z.string(),
});

type Input = z.infer<typeof inputSchema>;
type Course = z.infer<typeof courseSchema> & { trainer: string; profitability: string };

const COURSE_DESIGN_PROMPT = `You are the Cprime TaaS Learning Objective & Course Design Agent.

Your role is to act as an enterprise instructional designer responsible for creating professional, job-role-based learning programs.

Every training engagement begins with user-provided learning requirements. Using these inputs, generate a complete course blueprint that can be reviewed by instructional designers and SMEs before publication.

Input:
- Learning Objective
- Target Audience
- Job Role
- Certification Track (if applicable)
- Preferred Delivery Model
- Business Context

Requirements:

1. Generate an original course. Do not copy or reproduce proprietary certification material.
2. Create exactly **6 progressive modules** that move from foundational concepts to advanced practical application.
3. Each module must contain:
   - Module title
   - Short module description
   - 2–4 lessons
   - One measurable learning outcome (written using action verbs such as Explain, Configure, Implement, Design, Troubleshoot, Evaluate)
   - One hands-on lab or practical exercise aligned with the module outcome
   - 3–8 quiz questions that assess understanding of the module
4. Ensure the curriculum aligns with:
   - the requested audience
   - job role
   - certification track
   - delivery model
   - business context
5. Recommend how the delivery model should be implemented (self-paced, instructor-led, blended, virtual, etc.) including practical suggestions.
6. Include assessment recommendations such as quizzes, labs, capstone projects, peer discussions, or instructor evaluations where appropriate.
7. Keep the curriculum vendor-neutral unless the user explicitly requests a specific technology stack.
8. Certification tracks should only influence topic selection and skill coverage. Never reproduce exam questions, protected objectives, or proprietary certification content.
9. Ensure each module builds logically on the previous one and supports the overall learning objective.
10. At the end, include a note stating:
   "This curriculum is AI-generated and should undergo review by a qualified Subject Matter Expert (SME) before publication or delivery."

Generate the following sections:

# Course Title

# Course Summary

# Target Audience

# Job Role

# Learning Path Overview

# Delivery Model Recommendation

# Curriculum

For each of the 6 modules provide:

- Module Number
- Module Title
- Module Description
- Lessons (2–4)
- Learning Outcome
- Hands-on Lab
- Quiz Questions (3–8)

# Assessment Strategy

Include recommendations for:
- Module quizzes
- Practical labs
- Final capstone or project
- Knowledge validation

# Expected Skills After Completion

List the practical competencies learners should demonstrate upon successfully completing the course.

# SME Review Notice

State that the generated curriculum is intended as a draft and must be validated by an instructional designer or qualified SME before publication.`;

function createFallbackCourse(input: Input): Course {
  const topic = input.objective.replace(/[.!?]+$/, "");
  const audience = input.jobRole ? `${input.audience} working as ${input.jobRole}` : input.audience;
  const certificationNote = input.certification ? ` with preparation aligned to ${input.certification}` : "";
  const contextNote = input.businessContext ? ` The learning path is tailored to ${input.businessContext}.` : "";

  const moduleData = [
    [`${topic} Foundations`, "Establish the vocabulary, principles, business value, and learning environment required for the rest of the path.", ["Core vocabulary and principles", "Business value and use cases", "Learning environment setup"], `Explain the purpose, terminology, and value of ${topic} in a practical business setting.`, `Set up a starter workspace and map one real-world use case for ${topic}.`],
    ["Core Concepts and Workflow", "Connect the essential building blocks into an end-to-end workflow with clear responsibilities.", ["Essential building blocks", "End-to-end workflow", "Roles and responsibilities"], `Design a clear end-to-end ${topic} workflow and explain how its components interact.`, `Build and document a basic ${topic} workflow from intake to outcome.`],
    ["Tools and Practical Techniques", "Apply vendor-neutral selection criteria, configuration patterns, and implementation techniques.", ["Tool selection", "Configuration patterns", "Guided implementation"], `Configure and apply appropriate tools and techniques for a common ${topic} scenario.`, `Complete a guided implementation using a representative ${topic} toolchain.`],
    ["Applied Delivery", "Move from isolated techniques to collaborative planning and operational execution.", ["Planning and prioritization", "Team collaboration", "Operational execution"], `Implement a small ${topic} initiative with measurable acceptance criteria.`, `Run a scenario-based delivery exercise and present the completed workflow.`],
    ["Quality, Governance and Scale", "Evaluate quality, risk, security, governance, and scaling considerations in an enterprise context.", ["Quality controls", "Security and governance", "Scaling patterns"], `Evaluate a ${topic} implementation for quality, risk, governance, and scalability.`, `Audit a sample implementation and produce a prioritized improvement plan.`],
    ["Capstone and Next Steps", "Integrate the complete learning path through a practical capstone and personal development plan.", ["Integrated capstone", "Knowledge assessment", "Personal action plan"], `Demonstrate job-ready ${topic} capability through an integrated practical solution.`, `Complete and present a capstone that applies the full ${topic} learning path.`],
  ] as const;

  return {
    title: `${topic}: Applied Learning Path`,
    description: `A progressive, practice-led roadmap for ${audience}${certificationNote}.${contextNote}`,
    format: input.deliveryModel,
    duration: "6 modules · 12–18 hours",
    audience,
    jobRole: input.jobRole || "Role-neutral professional development",
    learningPathOverview: `The path progresses from ${topic} foundations through workflow, tools, delivery, governance, and an integrated capstone. Each module builds on demonstrated skills from the previous stage.`,
    deliveryRecommendation: `Deliver as ${input.deliveryModel.toLowerCase()} learning with short concept briefings, guided demonstrations, practical labs, facilitated reflection, and feedback after every module.`,
    trainer: "Trainer-network match pending",
    profitability: "Demand and margin review pending",
    modules: moduleData.map(([title, description, lessons, outcome, lab], index) => ({
      title,
      description,
      lessons: [...lessons],
      outcome,
      lab,
      quizQuestions: [
        `What is the primary purpose of ${title.toLowerCase()}?`,
        `Which practice best supports the learning outcome for module ${index + 1}?`,
        `How would you apply this module in a realistic ${topic} scenario?`,
        `Which result demonstrates successful completion of module ${index + 1}?`,
      ],
    })),
    assessmentStrategy: {
      moduleQuizzes: "Use scenario-based quizzes after every module with a recommended passing score of 80% and targeted remediation.",
      practicalLabs: "Evaluate each lab with an outcome-aligned checklist covering correct execution, decision quality, and reflection.",
      finalCapstone: `Require learners to design, implement, and present an integrated ${topic} solution for a realistic business scenario.`,
      knowledgeValidation: "Combine quiz performance, lab evidence, capstone review, and instructor or peer feedback for final validation.",
    },
    expectedSkills: [
      `Explain foundational ${topic} concepts and business value`,
      `Design and implement an end-to-end ${topic} workflow`,
      "Select appropriate vendor-neutral tools and practices",
      "Evaluate quality, governance, risk, and scalability",
      `Present a practical ${topic} solution supported by evidence`,
    ],
    smeReviewNotice: "This curriculum is AI-generated and should undergo review by a qualified Subject Matter Expert (SME) before publication or delivery.",
  };
}

function createStages(course: Course, aiGenerated: boolean) {
  return [
    { name: "Course design", status: "complete" as const, output: `${aiGenerated ? "AI" : "TaaS"} generated ${course.modules.length} structured modules` },
    { name: "Content governance", status: "pending" as const, output: "Awaiting approved-source verification" },
    { name: "Trainer matching", status: "pending" as const, output: "Awaiting profile and calendar comparison" },
    { name: "Publishing readiness", status: "pending" as const, output: "Awaiting branding, demand, and margin review" },
  ];
}

async function recordStages(stages: ReturnType<typeof createStages>) {
  try {
    await transaction(async (client) => {
      for (const [index, stage] of stages.entries()) {
        await client.query(
          `INSERT INTO agent_runs (agent, status, summary, duration_ms) VALUES ($1, $2, $3, $4)`,
          [stage.name, stage.status, stage.output, 540 + index * 290],
        );
      }
    });
  } catch { /* Generation remains available when the local database is offline. */ }
}

export async function POST(request: Request) {
  const parsed = inputSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Enter a course topic or learning objective." }, { status: 400 });
  }

  const fallback = async (reason: string) => {
    const course = createFallbackCourse(parsed.data);
    const stages = createStages(course, false);
    await recordStages(stages);
    return NextResponse.json({
      id: `local-${Date.now()}`,
      objective: parsed.data.objective,
      mode: "taas",
      model: "TaaS resilient course engine",
      notice: reason,
      stages,
      course,
    });
  };

  if (!process.env.OPENAI_API_KEY) {
    return fallback("Generated locally because OpenAI is not configured.");
  }

  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await openai.responses.parse({
      model: process.env.OPENAI_MODEL ?? "gpt-5.6",
      input: [
        {
          role: "system",
          content: COURSE_DESIGN_PROMPT,
        },
        { role: "user", content: JSON.stringify(parsed.data) },
      ],
      text: { format: zodTextFormat(courseSchema, "course_blueprint") },
    });

    if (!response.output_parsed) return fallback("OpenAI returned no blueprint, so TaaS generated a resilient local roadmap.");

    const course: Course = {
      ...response.output_parsed,
      trainer: "Trainer-network match pending",
      profitability: "Demand and margin review pending",
    };
    const stages = createStages(course, true);
    await recordStages(stages);

    return NextResponse.json({
      id: response.id,
      objective: parsed.data.objective,
      mode: "openai",
      model: process.env.OPENAI_MODEL ?? "gpt-5.6",
      stages,
      course,
    });
  } catch (error) {
    console.error("[course-generator] OpenAI unavailable; using TaaS fallback:", error instanceof Error ? error.message : "Unknown error");
    return fallback("OpenAI was unavailable, so TaaS generated a resilient local roadmap.");
  }
}
