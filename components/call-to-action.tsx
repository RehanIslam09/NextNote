import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CallToAction() {
  return (
    <section className="py-16 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center">
          <h2 className="text-balance text-4xl font-semibold lg:text-5xl">
            ✨ Capture Moments, Create Magic
          </h2>
          <p className="mt-4">
            Every word you write becomes part of a bigger story — your story.
          </p>
          <p className="mt-4">
            With NextNotes, your ideas stay alive and connected.
          </p>

          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/dashboard">
                <span>Get Started</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
