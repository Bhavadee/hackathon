import { LearningExperience } from "@/components/learning-experience";

export default async function LessonPage({ params }: { params: Promise<{ moduleId: string; lessonId: string }> }) {
  const { moduleId, lessonId } = await params;
  return <LearningExperience view="lesson" moduleId={Number(moduleId)} lessonId={Number(lessonId)} />;
}
