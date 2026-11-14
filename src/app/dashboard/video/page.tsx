import { PromptStudio } from "@/components/dashboard/PromptStudio";

export default function VideoPage() {
  return (
    <PromptStudio
      kind="video"
      title="Text to Video"
      description="Describe a scene and Lumina renders a cinematic clip with motion, lighting and mood."
    />
  );
}
