import { LearningExperience } from "@/components/learning-experience";

export default async function ResultsPage({ params }: { params: Promise<{ moduleId: string; lessonId: string }> }) {
  const { moduleId, lessonId } = await params;
  return <LearningExperience view="results" moduleId={Number(moduleId)} lessonId={Number(lessonId)} />;
}
