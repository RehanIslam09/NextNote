import Image from "next/image";
import Link from "next/link";
import { Great_Vibes } from "next/font/google";

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
});

export default function Footer() {
  return (
    <footer className="py-16 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <Link
          href="/"
          aria-label="go home"
          className="mx-auto size-fit flex items-center gap-2"
        >
          <Image src="/noteforge-logo.png" alt="logo" width={60} height={60} />

          <span className="text-2xl font-bold">NextNote</span>
        </Link>

        <span className="text-muted-foreground block text-center text-sm">
          © {new Date().getFullYear()} NextNote, All rights reserved
        </span>

        {/* ✨ Only this span uses Great Vibes */}
        <br />
        <span
          className={`${greatVibes.className} block text-center text-2xl bg-clip-text text-transparent 
                      bg-gradient-to-r from-pink-600 via-purple-600 to-pink-700
                      dark:from-pink-300 dark:via-purple-400 dark:to-pink-300`}
        >
          A notes taking app, made specially for my darling Kimmy 💖
        </span>
      </div>
    </footer>
  );
}
