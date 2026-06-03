"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "Portfolio", href: "#projects" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="text-xl font-bold text-primary tracking-tight">
            Noel
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-[var(--text-secondary)] hover:text-primary transition-colors"
              >
                {link.label}
              </a>
            ))}
            <ThemeToggle mounted={mounted} theme={theme} onToggle={toggleTheme} />
          </nav>

          {/* Mobile controls */}
          <div className="flex md:hidden items-center gap-3">
            <ThemeToggle mounted={mounted} theme={theme} onToggle={toggleTheme} />
            <button
              onClick={() => setMenuOpen(true)}
              className="flex items-center justify-center w-8 h-8"
              aria-label="Open menu"
            >
              <HamburgerIcon />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-[1001] bg-[#1a1d27] flex flex-col items-center justify-center"
          >
            {/* Brand */}
            <span className="absolute top-4 left-5 text-xl font-bold text-white">Noel</span>

            {/* Close */}
            <button
              onClick={closeMenu}
              aria-label="Close menu"
              className="absolute top-3 right-3 w-9 h-9 rounded-full border border-white/30 text-white text-xl flex items-center justify-center hover:border-white hover:bg-white/10 transition-colors"
            >
              &times;
            </button>

            {/* Links */}
            <nav className="flex flex-col items-center gap-2">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 + i * 0.08 }}
                  className="text-4xl font-semibold text-white hover:text-indigo-300 transition-colors tracking-tight"
                >
                  {link.label}
                </motion.a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function ThemeToggle({
  mounted,
  theme,
  onToggle,
}: {
  mounted: boolean;
  theme: string | undefined;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      aria-label="Toggle dark mode"
      className="w-8 h-8 rounded-md border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors text-base"
    >
      {mounted ? (theme === "dark" ? "☀" : "☽") : "☽"}
    </button>
  );
}

function HamburgerIcon() {
  return (
    <svg width="22" height="16" viewBox="0 0 22 16" fill="none">
      <rect width="22" height="2" rx="1" fill="currentColor" />
      <rect y="7" width="22" height="2" rx="1" fill="currentColor" />
      <rect y="14" width="22" height="2" rx="1" fill="currentColor" />
    </svg>
  );
}
