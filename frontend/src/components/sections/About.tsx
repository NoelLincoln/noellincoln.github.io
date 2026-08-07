"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedButton from "@/components/ui/animated-button";

const skills = [
  {
    label: "Languages",
    items: ["JavaScript", "TypeScript", "Python", "Go"],
  },
  {
    label: "Frameworks & Libraries",
    items: [
      "React",
      "Next.js",
      "Node.js",
      "Ruby on Rails",
      "AngularJS",
      "Express",
      "Redux",
      "Tailwind CSS",
      "MaterialUI",
      "Spring Boot",
      "Prisma",
    ],
  },
  {
    label: "Databases & Cloud",
    items: ["PostgreSQL", "MySQL", "MongoDB", "AWS", "GCP", "Docker", "Kubernetes"],
  },
  {
    label: "Tools & Practices",
    items: [
      "Git",
      "Jira",
      "Postman",
      "TDD",
      "REST API",
      "GraphQL",
      "CI/CD",
      "Unit Testing",
      "End-to-End Testing",
      "Agile / Scrum",
    ],
  },
];

const socials = [
  { label: "Twitter", href: "https://twitter.com/Noel_Lincoln", icon: "/social/twitter.svg" },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/noel-bryant/",
    icon: "/social/linkedin.svg",
  },
  { label: "Medium", href: "https://medium.com/@noelsobryant", icon: "/social/medium.svg" },
  { label: "GitHub", href: "https://github.com/NoelLincoln", icon: "/social/github.svg" },
];

export default function About() {
  const [open, setOpen] = useState<string | null>(null);

  const toggle = (label: string) => setOpen((prev) => (prev === label ? null : label));

  return (
    <section
      id="about"
      className="bg-card border-t border-border rounded-tr-[6rem] mt-8 py-20 px-4"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12">
        {/* Bio */}
        <motion.div
          className="md:w-1/2 flex flex-col gap-5"
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-[#172b4d] dark:text-[#e2e8f0]">About Me</h2>

          <p className="text-[#344563] dark:text-[#94a3b8] leading-relaxed text-sm md:text-base">
            I&apos;m a{" "}
            <span className="text-primary font-semibold">full-stack software engineer</span> with{" "}
            <span className="text-primary font-semibold">5+ years</span> delivering production
            software across <span className="text-primary font-semibold">healthcare</span>,{" "}
            <span className="text-primary font-semibold">IoT</span>, and{" "}
            <span className="text-primary font-semibold">SaaS</span> domains. Currently at{" "}
            <span className="text-primary font-semibold">Savannah Informatics</span>, I build
            interoperable healthcare platforms — driving PRDs, leading code reviews, and mentoring
            junior engineers while shipping features that improve healthcare access across East
            Africa.
          </p>

          <p className="text-[#344563] dark:text-[#94a3b8] leading-relaxed text-sm md:text-base">
            I&apos;m a strong advocate for{" "}
            <span className="text-primary font-semibold">Test-Driven Development</span>, clean
            architecture, and building software you can stand behind. My results speak in numbers: a{" "}
            <span className="text-primary font-semibold">20% boost in system performance</span>, a{" "}
            <span className="text-primary font-semibold">25% reduction in bugs</span>, and{" "}
            <span className="text-primary font-semibold">30% faster delivery</span> through
            disciplined engineering practices and effective cross-functional collaboration.
          </p>

          {/* Values Pillars */}
          <div className="grid grid-cols-3 gap-3 mt-1">
            {[
              {
                icon: "🧪",
                title: "TDD First",
                desc: "Automated tests before shipping. Every time.",
              },
              {
                icon: "⚙️",
                title: "Scalable Systems",
                desc: "Architecture that grows with your business.",
              },
              { icon: "🤝", title: "Mentor & Lead", desc: "I grow teams, not just codebases." },
            ].map(({ icon, title, desc }, i) => (
              <motion.div
                key={title}
                className="group flex flex-col gap-1.5 p-3 rounded-xl bg-muted dark:bg-[#252836] border border-border hover:border-primary hover:shadow-md transition-colors cursor-default"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                whileHover={{ y: -6 }}
              >
                <span className="text-xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                  {icon}
                </span>
                <p className="text-xs font-semibold text-[#172b4d] dark:text-[#e2e8f0]">{title}</p>
                <p className="text-xs text-[#344563] dark:text-[#94a3b8]">{desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Socials */}
          <div className="mt-2">
            <p className="text-xs font-semibold tracking-widest text-primary uppercase mb-3">
              Let&apos;s connect
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
                  <img src={s.icon} alt={s.label} width={22} height={22} />
                </a>
              ))}
            </div>
          </div>

          <AnimatedButton
            href="https://drive.google.com/file/d/1BpU8dTX44TQNiuD_cbhI-KtjGAPiA52w/view?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            variant="outline"
            className="w-fit mt-2"
          >
            Get my resume
          </AnimatedButton>
        </motion.div>

        {/* Skills */}
        <motion.div
          className="md:w-1/2 flex flex-col gap-3"
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {skills.map(({ label, items }) => (
            <div key={label} className="border-b border-border last:border-0">
              <button
                onClick={() => toggle(label)}
                className="w-full flex items-center justify-between py-4 text-base font-medium text-[#172b4d] dark:text-[#e2e8f0] hover:text-primary transition-colors"
              >
                {label}
                <span
                  className={`transition-transform duration-200 ${
                    open === label ? "rotate-180" : ""
                  }`}
                >
                  ▾
                </span>
              </button>
              <AnimatePresence initial={false}>
                {open === label && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-wrap gap-2 pb-4">
                      {items.map((item) => (
                        <motion.span
                          key={item}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="px-3 py-1.5 rounded-lg bg-muted dark:bg-[#252836] text-sm text-[#344563] dark:text-[#94a3b8] border border-transparent hover:border-primary cursor-default transition-colors"
                        >
                          {item}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
