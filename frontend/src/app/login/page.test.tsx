import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginPage from "./page";

const mockPush = vi.hoisted(() => vi.fn());

vi.mock("next-auth/react", () => ({
  signIn: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

import { signIn } from "next-auth/react";
import { toast } from "sonner";

const mockSignIn = vi.mocked(signIn);
const mockToast = vi.mocked(toast);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("LoginPage", () => {
  it("renders the login form", () => {
    render(<LoginPage />);
    expect(screen.getByPlaceholderText("your-username")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("••••••••")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  });

  it("renders the Google sign-in button", () => {
    render(<LoginPage />);
    expect(screen.getByRole("button", { name: /continue with google/i })).toBeInTheDocument();
  });

  it("shows a link to the register page", () => {
    render(<LoginPage />);
    expect(screen.getByRole("link", { name: /create one/i })).toHaveAttribute("href", "/register");
  });

  it("calls signIn with credentials on form submit", async () => {
    mockSignIn.mockResolvedValueOnce({ error: null } as never);
    render(<LoginPage />);

    await userEvent.type(screen.getByPlaceholderText("your-username"), "noel");
    await userEvent.type(screen.getByPlaceholderText("••••••••"), "password123");
    await userEvent.click(screen.getByRole("button", { name: /sign in/i }));

    expect(mockSignIn).toHaveBeenCalledWith(
      "credentials",
      expect.objectContaining({ username: "noel", password: "password123", redirect: false })
    );
  });

  it("shows success toast and redirects on successful login", async () => {
    mockSignIn.mockResolvedValueOnce({ error: null } as never);
    render(<LoginPage />);

    await userEvent.type(screen.getByPlaceholderText("your-username"), "noel");
    await userEvent.type(screen.getByPlaceholderText("••••••••"), "password123");
    await userEvent.click(screen.getByRole("button", { name: /sign in/i }));

    expect(mockToast.success).toHaveBeenCalledWith("Welcome back!");
    expect(mockPush).toHaveBeenCalledWith("/blog");
  });

  it("shows error toast on failed login", async () => {
    mockSignIn.mockResolvedValueOnce({ error: "CredentialsSignin" } as never);
    render(<LoginPage />);

    await userEvent.type(screen.getByPlaceholderText("your-username"), "noel");
    await userEvent.type(screen.getByPlaceholderText("••••••••"), "wrongpass");
    await userEvent.click(screen.getByRole("button", { name: /sign in/i }));

    expect(mockToast.error).toHaveBeenCalledWith("Invalid username or password.");
  });

  it("calls signIn with google when Google button is clicked", async () => {
    render(<LoginPage />);
    await userEvent.click(screen.getByRole("button", { name: /continue with google/i }));
    expect(mockSignIn).toHaveBeenCalledWith(
      "google",
      expect.objectContaining({ callbackUrl: "/blog" })
    );
  });
});
