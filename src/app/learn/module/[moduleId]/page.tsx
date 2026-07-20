import { LearningExperience } from "@/components/learning-experience";

export default async function ModulePage({ params }: { params: Promise<{ moduleId: string }> }) {
  const { moduleId } = await params;
  return <LearningExperience view="module" moduleId={Number(moduleId)} />;
}
