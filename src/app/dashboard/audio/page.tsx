import { AudioLines, Bell } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function AudioPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
          Voice &amp; Music
        </h1>
        <p className="mt-1.5 text-sm text-muted">
          Narration, sound design and score to finish your story.
        </p>
      </div>

      <div className="card relative overflow-hidden px-6 py-16 text-center">
        <div className="absolute inset-0 aurora opacity-60" />
        <div className="relative">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-accent/30 to-brand/20 text-accent ring-1 ring-accent/30">
            <AudioLines className="h-7 w-7" />
          </span>
          <h2 className="font-display mt-5 text-xl font-bold text-ink">
            Audio generation is on the way
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted">
            Leonardo focuses on image and video. We&apos;re wiring Lumina to a
            dedicated voice &amp; music engine so you can score and narrate your
            creations right here. Want to be first in line?
          </p>
          <div className="mt-6 flex justify-center">
            <Button variant="soft" size="md">
              <Bell className="h-4 w-4" /> Notify me when it&apos;s live
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
