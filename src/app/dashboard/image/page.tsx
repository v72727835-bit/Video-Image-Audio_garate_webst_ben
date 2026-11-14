import { PromptStudio } from "@/components/dashboard/PromptStudio";

export default function ImagePage() {
  return (
    <PromptStudio
      kind="image"
      title="Text to Image"
      description="Generate photoreal shots, concept art and product renders — four variations every run."
    />
  );
}
