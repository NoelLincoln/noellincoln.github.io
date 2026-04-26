"use client";

import { useTypingAnimation } from "@/hooks/useTypingAnimation";
import { motion } from "framer-motion";

const socials = [
  { label: "Twitter", href: "https://twitter.com/Noel_Lincoln", icon: "/social/twitter.svg" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/noel-bryant/", icon: "/social/linkedin.svg" },
  { label: "Medium", href: "https://medium.com/@noelsobryant", icon: "/social/medium.svg" },
  { label: "GitHub", href: "https://github.com/NoelLincoln", icon: "/social/github.svg" },
];

export default function Hero() {
  const displayed = useTypingAnimation("Hi, I'm Noel.\nGlad to see you!", 65);

  const lines = displayed.split("\n");

  return (
    <section className="min-h-[580px] mt-14 flex items-center rounded-bl-[100px] bg-[#ddd0d0] dark:bg-[#141720] overflow-hidden">
      <div className="max-w-7xl mx-auto w-full px-8 py-16 flex items-center justify-between gap-8">
        {/* Text */}
        <motion.div
          className="flex flex-col gap-4 max-w-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-semibold text-[#172b4d] dark:text-[#e2e8f0] leading-tight min-h-[6rem]">
            {lines.map((line, i) => (
              <span key={i}>
                {line}
                {i < lines.length - 1 && <br />}
              </span>
            ))}
            <span className="inline-block w-[2px] h-[1em] bg-orange-400 ml-1 animate-pulse align-middle" />
          </h1>

          <p className="text-base md:text-lg text-[#344563] dark:text-[#94a3b8] leading-relaxed">
            Full-stack engineer with <strong className="text-[#172b4d] dark:text-[#e2e8f0]">5+ years</strong> shipping production software across healthcare, IoT, and SaaS — from React &amp; Next.js frontends to Rails &amp; Node backends. I champion <strong className="text-[#172b4d] dark:text-[#e2e8f0]">TDD</strong>, clean architecture, and have a track record of <strong className="text-[#172b4d] dark:text-[#e2e8f0]">measurable impact</strong>: 20% performance gains, 25% fewer bugs, and teams that ship with confidence.
          </p>

          <div className="flex flex-wrap gap-3 mt-1">
            <a
              href="#projects"
              className="px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:opacity-90 transition-opacity"
            >
              View My Work
            </a>
            <a
              href="#contact"
              className="px-5 py-2.5 rounded-lg border border-primary text-primary text-sm font-medium hover:bg-primary hover:text-white transition-colors"
            >
              Get in Touch
            </a>
          </div>

          <div className="mt-2">
            <p className="text-xs font-semibold tracking-widest text-primary mb-3 uppercase">
              Let&apos;s Connect
            </p>
            <div className="flex gap-4">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="opacity-70 hover:opacity-100 transition-opacity"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.icon} alt={s.label} width={24} height={24} />
                </a>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Lottie — desktop only */}
        <div className="hidden md:block flex-shrink-0">
          <LottieHero />
        </div>
      </div>
    </section>
  );
}

function LottieHero() {
  return (
    // @ts-expect-error lottie-player is a web component
    <lottie-player
      src="https://lottie.host/5d685b3f-3839-48ca-adcf-6ac119e46c89/hLClBwVVzG.json"
      background="transparent"
      speed="1"
      class="w-130 h-130"
      autoplay
      loop
    />
  );
}
