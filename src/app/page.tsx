import { DashboardTabs, type DashboardData } from "@/components/dashboard-tabs";
import { query } from "@/lib/pg";

export const dynamic = "force-dynamic";

type CourseRow = DashboardData["courses"][number] & { updatedAt: Date };
type RequestRow = DashboardData["requests"][number];
type TrainerRow = DashboardData["trainers"][number];
type AgentRunRow = DashboardData["runs"][number];

const demo: DashboardData = {
  courses: [
    { id: "1", title: "SAFe DevOps Practitioner", status: "review", freshness: 74, sourceVersion: "6.0.1" },
    { id: "2", title: "ICAgile Foundations", status: "published", freshness: 98, sourceVersion: "2026.2" },
    { id: "3", title: "GitLab CI/CD Essentials", status: "published", freshness: 91, sourceVersion: "18.1" },
  ],
  requests: [
    { id: "1", customer: "Northstar Financial", topic: "SAFe DevOps", seats: 28, pricePerSeat: "425", deliveryMode: "Blended", status: "agent review" },
    { id: "2", customer: "Acme Health", topic: "GitLab CI/CD", seats: 18, pricePerSeat: "350", deliveryMode: "Private cohort", status: "trainer match" },
    { id: "3", customer: "Orbit Retail", topic: "ICAgile", seats: 42, pricePerSeat: "220", deliveryMode: "Self-paced", status: "ready" },
  ],
  trainers: [
    { id: "1", name: "Maya Chen", role: "Principal Agile Coach", skills: ["SAFe", "DevOps", "Leadership"], certifications: ["SAFe SPC", "ICAgile ICP-ACC"], hourlyRate: 185, utilization: 72, availableFrom: "2026-07-16" },
    { id: "2", name: "Ravi Kumar", role: "Senior Technical Trainer", skills: ["GitLab", "CI/CD", "Automation"], certifications: ["GitLab Certified Trainer", "CKA"], hourlyRate: 160, utilization: 64, availableFrom: "2026-07-14" },
    { id: "3", name: "Elena Torres", role: "Enterprise Agility Lead", skills: ["SAFe", "Scrum", "Coaching"], certifications: ["SAFe SPC", "Scrum Alliance CSP"], hourlyRate: 205, utilization: 81, availableFrom: "2026-07-20" },
    { id: "4", name: "Jordan Blake", role: "DevSecOps Instructor", skills: ["DevSecOps", "GitLab", "Kubernetes"], certifications: ["GitLab Professional", "CKAD"], hourlyRate: 175, utilization: 58, availableFrom: "2026-07-18" },
    { id: "5", name: "Aisha Rahman", role: "Agile Delivery Consultant", skills: ["Scrum", "Kanban", "Facilitation"], certifications: ["ICAgile ICP", "PSM II"], hourlyRate: 155, utilization: 49, availableFrom: "2026-07-15" },
    { id: "6", name: "Marcus Johnson", role: "Platform Engineering Trainer", skills: ["Platform Ops", "AWS", "DevOps"], certifications: ["AWS Solutions Architect", "Terraform Associate"], hourlyRate: 190, utilization: 83, availableFrom: "2026-07-22" },
    { id: "7", name: "Priya Nair", role: "Release Management Specialist", skills: ["Release Train", "SAFe", "Metrics"], certifications: ["SAFe RTE", "Lean Portfolio"], hourlyRate: 170, utilization: 76, availableFrom: "2026-07-17" },
    { id: "8", name: "Daniel Kim", role: "Cloud Automation Coach", skills: ["Azure", "CI/CD", "Scripting"], certifications: ["Azure Administrator", "GitHub Actions"], hourlyRate: 165, utilization: 54, availableFrom: "2026-07-15" },
    { id: "9", name: "Sofia Martinez", role: "Enterprise Scrum Trainer", skills: ["Scrum", "Agile", "Stakeholder Mgmt"], certifications: ["PSM I", "ICAgile ICP-ATF"], hourlyRate: 150, utilization: 67, availableFrom: "2026-07-19" },
    { id: "10", name: "Liam O'Connor", role: "DevOps Transformation Lead", skills: ["DevOps", "Value Stream", "Change Mgmt"], certifications: ["DevOps Institute", "SAFe POPM"], hourlyRate: 210, utilization: 88, availableFrom: "2026-07-24" },
  ],
  runs: [
    { id: "1", agent: "Certification watchdog", status: "attention", summary: "Detected a syllabus delta in SAFe DevOps 6.0.2", durationMs: 1840 },
    { id: "2", agent: "Trainer matching", status: "complete", summary: "Ranked 3 qualified trainers for Acme Health", durationMs: 920 },
    { id: "3", agent: "Repository sync", status: "complete", summary: "Branded and versioned 12 approved assets", durationMs: 3410 },
  ],
  connected: false,
};

async function loadDashboard(): Promise<DashboardData> {
  try {
    const [courseResult, requestResult, trainerResult, runResult] = await Promise.all([
      query<CourseRow>(`SELECT id, title, status, freshness, source_version AS "sourceVersion", updated_at AS "updatedAt" FROM courses ORDER BY updated_at DESC LIMIT $1`, [4]),
      query<RequestRow>(`SELECT id, customer, topic, seats, price_per_seat AS "pricePerSeat", delivery_mode AS "deliveryMode", status FROM training_requests ORDER BY created_at DESC LIMIT $1`, [4]),
      query<TrainerRow>(`SELECT id, name, role, skills, certifications, hourly_rate AS "hourlyRate", utilization, available_from AS "availableFrom" FROM trainers ORDER BY name ASC LIMIT $1`, [10]),
      query<AgentRunRow>(`SELECT id, agent, status, summary, duration_ms AS "durationMs" FROM agent_runs ORDER BY created_at DESC LIMIT $1`, [4]),
    ]);

    const trainersByName = new Set(trainerResult.rows.map((trainer) => trainer.name));
    const trainers = [
      ...trainerResult.rows,
      ...demo.trainers.filter((trainer) => !trainersByName.has(trainer.name)),
    ].slice(0, 10);

    return {
      courses: courseResult.rows.map((course) => ({
        id: course.id,
        title: course.title,
        status: course.status,
        freshness: course.freshness,
        sourceVersion: course.sourceVersion,
      })),
      requests: requestResult.rows,
      trainers,
      runs: runResult.rows,
      connected: true,
    };
  } catch {
    return demo;
  }
}

export default async function Home() {
  return <DashboardTabs data={await loadDashboard()} />;
}
