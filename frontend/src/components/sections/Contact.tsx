"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function Contact() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("https://formspree.io/f/xoqzgvow", {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        setStatus("sent");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="contact" className="mt-12 mb-0">
      <motion.div
        className="bg-[#6070ff] dark:bg-[#1e1b4b] rounded-tl-[80px] px-6 md:px-[20%] py-16 flex flex-col items-center gap-6"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-4xl font-bold text-white mt-4">Contact Me</h2>
        <p className="text-[#ebebff] dark:text-[#c7d2fe] text-center text-base md:text-lg max-w-md">
          If you have an application you are interested in developing, a feature that needs
          building, or a project that needs coding — I&apos;d love to help!
        </p>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4 max-w-lg">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            maxLength={30}
            required
            className="h-12 rounded-lg px-4 bg-white dark:bg-[#2d2a5e] text-[#172b4d] dark:text-[#e2e8f0] placeholder-gray-400 dark:placeholder-indigo-300 border border-transparent dark:border-[#4c4a8f] outline-none focus:ring-2 focus:ring-white/50 text-sm"
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            required
            className="h-12 rounded-lg px-4 bg-white dark:bg-[#2d2a5e] text-[#172b4d] dark:text-[#e2e8f0] placeholder-gray-400 dark:placeholder-indigo-300 border border-transparent dark:border-[#4c4a8f] outline-none focus:ring-2 focus:ring-white/50 text-sm"
          />
          <textarea
            name="message"
            placeholder="Write your message here..."
            rows={7}
            maxLength={500}
            required
            className="rounded-lg px-4 py-3 bg-white dark:bg-[#2d2a5e] text-[#172b4d] dark:text-[#e2e8f0] placeholder-gray-400 dark:placeholder-indigo-300 border border-transparent dark:border-[#4c4a8f] outline-none focus:ring-2 focus:ring-white/50 text-sm resize-none"
          />

          <button
            type="submit"
            disabled={status === "sending"}
            className="w-fit px-6 py-3 rounded-lg bg-white dark:bg-[#4f46e5] text-primary dark:text-white font-medium text-sm hover:bg-indigo-50 dark:hover:bg-[#6366f1] transition-colors disabled:opacity-60"
          >
            {status === "sending" ? "Sending…" : "Get in touch"}
          </button>

          {status === "sent" && (
            <p className="text-green-300 text-sm">Message sent! I&apos;ll get back to you soon.</p>
          )}
          {status === "error" && (
            <p className="text-red-300 text-sm">Something went wrong. Please try again.</p>
          )}
        </form>
      </motion.div>
    </section>
  );
}
