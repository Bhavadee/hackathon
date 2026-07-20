import { LearningExperience } from "@/components/learning-experience";

export default async function QuizPage({ params }: { params: Promise<{ moduleId: string; lessonId: string }> }) {
  const { moduleId, lessonId } = await params;
  return <LearningExperience view="quiz" moduleId={Number(moduleId)} lessonId={Number(lessonId)} />;
}
