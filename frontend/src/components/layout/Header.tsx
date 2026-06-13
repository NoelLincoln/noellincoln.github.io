"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navLinks = [
  { label: "Portfolio", href: "#projects" },
  { label: "About", href: "#about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "#contact" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const { data: session, status } = useSession();

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  const closeMenu = () => setMenuOpen(false);

  const initials = session?.user?.name ? session.user.name.slice(0, 2).toUpperCase() : "?";

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
            {status === "unauthenticated" && (
              <a
                href="/login"
                className="text-sm font-semibold text-primary border border-primary/40 rounded-full px-3 py-1 hover:bg-primary/10 transition-colors"
              >
                Sign in
              </a>
            )}
            {session?.user && (
              <DropdownMenu>
                <DropdownMenuTrigger className="rounded-full border-0 bg-transparent p-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={session.user.image ?? ""} alt={session.user.name ?? ""} />
                    <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>
                      <p className="font-medium text-sm truncate">{session.user.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{session.user.email}</p>
                    </DropdownMenuLabel>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
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
              {status === "unauthenticated" && (
                <motion.a
                  href="/login"
                  onClick={closeMenu}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 + navLinks.length * 0.08 }}
                  className="text-4xl font-semibold text-white hover:text-indigo-300 transition-colors tracking-tight"
                >
                  Sign in
                </motion.a>
              )}
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
