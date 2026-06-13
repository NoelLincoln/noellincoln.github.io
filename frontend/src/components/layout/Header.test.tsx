import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Header from "./Header";

vi.mock("next-auth/react", () => ({
  useSession: vi.fn(),
  signOut: vi.fn(),
}));

vi.mock("next-themes", () => ({
  useTheme: vi.fn(),
}));

vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: React.ComponentProps<"div">) => <div {...props}>{children}</div>,
    a: ({ children, ...props }: React.ComponentProps<"a">) => <a {...props}>{children}</a>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

import { useSession, signOut } from "next-auth/react";
import { useTheme } from "next-themes";

const mockUseSession = vi.mocked(useSession);
const mockUseTheme = vi.mocked(useTheme);
const mockSignOut = vi.mocked(signOut);

const loggedOut = { data: null, status: "unauthenticated" as const, update: vi.fn() };
const loggedIn = (overrides = {}) => ({
  data: {
    user: { name: "Noel Bryant", email: "noel@example.com", image: undefined, ...overrides },
    expires: "",
  },
  status: "authenticated" as const,
  update: vi.fn(),
});

beforeEach(() => {
  vi.clearAllMocks();
  mockUseSession.mockReturnValue(loggedOut);
  mockUseTheme.mockReturnValue({
    theme: "dark",
    setTheme: vi.fn(),
    resolvedTheme: "dark",
    themes: [],
    systemTheme: "dark",
    forcedTheme: undefined,
    setResolvedTheme: vi.fn(),
  });
});

describe("Header", () => {
  it("renders nav links", () => {
    render(<Header />);
    expect(screen.getByText("Blog")).toBeInTheDocument();
    expect(screen.getByText("Portfolio")).toBeInTheDocument();
  });

  it("does not show avatar when logged out", () => {
    render(<Header />);
    expect(screen.queryByText("NO")).not.toBeInTheDocument();
  });

  it("shows user initials when logged in", () => {
    mockUseSession.mockReturnValue(loggedIn());
    render(<Header />);
    expect(screen.getByText("NO")).toBeInTheDocument();
  });

  it('shows "?" as fallback initials when user has no name', () => {
    mockUseSession.mockReturnValue(loggedIn({ name: undefined }));
    render(<Header />);
    expect(screen.getByText("?")).toBeInTheDocument();
  });

  it("opens dropdown with user info when avatar is clicked", async () => {
    mockUseSession.mockReturnValue(loggedIn({ image: "https://example.com/photo.jpg" }));
    render(<Header />);
    const trigger = screen.getByText("NO").closest("button")!;
    await userEvent.click(trigger);
    await waitFor(() => {
      expect(screen.getByText("Noel Bryant")).toBeInTheDocument();
      expect(screen.getByText("noel@example.com")).toBeInTheDocument();
      expect(screen.getByText("Sign out")).toBeInTheDocument();
    });
  });

  it("calls signOut when Sign out is clicked", async () => {
    mockUseSession.mockReturnValue(loggedIn());
    render(<Header />);
    const trigger = screen.getByText("NO").closest("button")!;
    await userEvent.click(trigger);
    await waitFor(() => screen.getByText("Sign out"));
    await userEvent.click(screen.getByText("Sign out"));
    expect(mockSignOut).toHaveBeenCalledWith({ callbackUrl: "/" });
  });

  it("shows sun icon (☀) when theme is dark", () => {
    mockUseTheme.mockReturnValue({
      theme: "dark",
      setTheme: vi.fn(),
      resolvedTheme: "dark",
      themes: [],
      systemTheme: "dark",
      forcedTheme: undefined,
      setResolvedTheme: vi.fn(),
    });
    render(<Header />);
    expect(screen.getAllByText("☀").length).toBeGreaterThan(0);
  });

  it("shows moon icon (☽) when theme is light", () => {
    mockUseTheme.mockReturnValue({
      theme: "light",
      setTheme: vi.fn(),
      resolvedTheme: "light",
      themes: [],
      systemTheme: "light",
      forcedTheme: undefined,
      setResolvedTheme: vi.fn(),
    });
    render(<Header />);
    expect(screen.getAllByText("☽").length).toBeGreaterThan(0);
  });

  it("calls setTheme with 'light' when toggling dark theme", async () => {
    const mockSetTheme = vi.fn();
    mockUseTheme.mockReturnValue({
      theme: "dark",
      setTheme: mockSetTheme,
      resolvedTheme: "dark",
      themes: [],
      systemTheme: "dark",
      forcedTheme: undefined,
      setResolvedTheme: vi.fn(),
    });
    render(<Header />);
    await userEvent.click(screen.getAllByLabelText("Toggle dark mode")[0]);
    expect(mockSetTheme).toHaveBeenCalledWith("light");
  });

  it("calls setTheme with 'dark' when toggling light theme", async () => {
    const mockSetTheme = vi.fn();
    mockUseTheme.mockReturnValue({
      theme: "light",
      setTheme: mockSetTheme,
      resolvedTheme: "light",
      themes: [],
      systemTheme: "light",
      forcedTheme: undefined,
      setResolvedTheme: vi.fn(),
    });
    render(<Header />);
    await userEvent.click(screen.getAllByLabelText("Toggle dark mode")[0]);
    expect(mockSetTheme).toHaveBeenCalledWith("dark");
  });

  it("shows Sign in link in desktop nav when logged out", () => {
    render(<Header />);
    expect(screen.getByRole("link", { name: "Sign in" })).toBeInTheDocument();
  });

  it("does not show Sign in link in mobile menu when logged in", async () => {
    mockUseSession.mockReturnValue(loggedIn());
    render(<Header />);
    await userEvent.click(screen.getByLabelText("Open menu"));
    expect(screen.queryByRole("link", { name: "Sign in" })).not.toBeInTheDocument();
  });

  it("opens the mobile menu when hamburger is clicked", async () => {
    render(<Header />);
    expect(screen.queryByLabelText("Close menu")).not.toBeInTheDocument();
    await userEvent.click(screen.getByLabelText("Open menu"));
    expect(screen.getByLabelText("Close menu")).toBeInTheDocument();
  });

  it("closes the mobile menu when close button is clicked", async () => {
    render(<Header />);
    await userEvent.click(screen.getByLabelText("Open menu"));
    await userEvent.click(screen.getByLabelText("Close menu"));
    expect(screen.queryByLabelText("Close menu")).not.toBeInTheDocument();
  });
});
