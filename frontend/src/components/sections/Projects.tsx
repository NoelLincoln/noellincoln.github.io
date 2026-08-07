"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { projects, type Project } from "@/data/projects";
import AnimatedButton from "@/components/ui/animated-button";

export default function Projects() {
  const [selected, setSelected] = useState<Project | null>(null);

  return (
    <section id="projects" className="py-16 px-4 max-w-7xl mx-auto w-full">
      <h2 className="text-2xl font-bold text-[#172b4d] dark:text-[#e2e8f0] mb-10 text-center">
        Highlighted Projects
      </h2>

      <div className="flex flex-col gap-8">
        {projects.map((project, i) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className={`flex flex-col md:flex-row ${
              i % 2 !== 0 ? "md:flex-row-reverse" : ""
            } gap-6 bg-card border border-border rounded-2xl p-4 shadow-sm`}
          >
            {/* Image */}
            <div className="md:w-1/2 rounded-xl overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={project.image}
                alt={project.name}
                className="w-full h-56 md:h-72 object-cover"
              />
            </div>

            {/* Info */}
            <div className="md:w-1/2 flex flex-col justify-between p-2 gap-4">
              <div>
                <h3 className="text-xl font-bold text-[#172b4d] dark:text-[#e2e8f0]">
                  {project.name}
                </h3>
                <div className="flex items-center gap-2 mt-1 text-xs font-semibold text-muted-foreground">
                  <span>{project.company}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-border" />
                  <span>{project.role}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-border" />
                  <span>{project.year}</span>
                </div>
                <p className="mt-3 text-sm text-[#344563] dark:text-[#94a3b8] leading-relaxed">
                  {project.descrShort}
                </p>
              </div>
              <AnimatedButton
                variant="outline"
                onClick={() => setSelected(project)}
                className="w-fit px-5 py-2"
              >
                See project
              </AnimatedButton>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selected && <ProjectModal project={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </section>
  );
}

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="relative bg-card border border-border rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 md:p-8"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-[#172b4d] dark:text-[#e2e8f0]">{project.name}</h3>
            <div className="flex items-center gap-2 mt-1 text-xs font-semibold text-muted-foreground">
              <span>{project.company}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-border" />
              <span>{project.role}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-border" />
              <span>{project.year}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground text-2xl leading-none"
          >
            &times;
          </button>
        </div>

        {/* Image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={project.image}
          alt={project.name}
          className="w-full h-56 object-cover rounded-xl mb-6"
        />

        {/* Case study */}
        <div className="flex flex-col gap-5 mb-6">
          {[
            { label: "Problem", content: project.problem },
            { label: "What I built", content: project.built },
            { label: "What I learned", content: project.learned },
          ].map(({ label, content }) => (
            <div key={label}>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                {label}
              </p>
              <p className="text-sm text-[#344563] dark:text-[#94a3b8] leading-relaxed">
                {content}
              </p>
            </div>
          ))}
        </div>

        {/* Tags + links */}
        <div className="flex flex-wrap gap-2 mb-6">
          {project.language.map((lang) => (
            <span
              key={lang}
              className="px-3 py-1 rounded-lg bg-accent text-accent-foreground text-xs font-medium"
            >
              {lang}
            </span>
          ))}
        </div>

        <div className="flex gap-3">
          <a
            href={project.liveLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-primary text-primary text-sm font-medium hover:bg-primary hover:text-white transition-colors"
          >
            See live ↗
          </a>
          <a
            href={project.sourceLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-muted-foreground text-sm font-medium hover:border-primary hover:text-primary transition-colors"
          >
            Source code ↗
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
}
