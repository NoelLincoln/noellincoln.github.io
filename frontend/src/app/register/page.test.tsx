import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RegisterPage from "./page";

const mockPush = vi.hoisted(() => vi.fn());
const mockFetch = vi.hoisted(() => vi.fn());

vi.mock("next-auth/react", () => ({
  signIn: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

vi.stubGlobal("fetch", mockFetch);

import { signIn } from "next-auth/react";
import { toast } from "sonner";

const mockSignIn = vi.mocked(signIn);
const mockToast = vi.mocked(toast);

function mockOkResponse(data: unknown) {
  mockFetch.mockResolvedValueOnce({
    ok: true,
    json: () => Promise.resolve(data),
  });
}

function mockErrorResponse(data: unknown, status = 400) {
  mockFetch.mockResolvedValueOnce({
    ok: false,
    status,
    json: () => Promise.resolve(data),
  });
}

beforeEach(() => {
  vi.clearAllMocks();
});

async function fillAndSubmit(
  username = "noel",
  email = "noel@example.com",
  password = "password123"
) {
  await userEvent.type(screen.getByPlaceholderText("your-username"), username);
  await userEvent.type(screen.getByPlaceholderText("you@example.com"), email);
  await userEvent.type(screen.getByPlaceholderText("••••••••"), password);
  await userEvent.click(screen.getByRole("button", { name: /create account/i }));
}

describe("RegisterPage", () => {
  it("renders the registration form", () => {
    render(<RegisterPage />);
    expect(screen.getByPlaceholderText("your-username")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("you@example.com")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("••••••••")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /create account/i })).toBeInTheDocument();
  });

  it("renders the Google sign-in button", () => {
    render(<RegisterPage />);
    expect(screen.getByRole("button", { name: /continue with google/i })).toBeInTheDocument();
  });

  it("shows a link to the login page", () => {
    render(<RegisterPage />);
    expect(screen.getByRole("link", { name: /sign in/i })).toHaveAttribute("href", "/login");
  });

  it("calls signIn with google when Google button is clicked", async () => {
    render(<RegisterPage />);
    await userEvent.click(screen.getByRole("button", { name: /continue with google/i }));
    expect(mockSignIn).toHaveBeenCalledWith(
      "google",
      expect.objectContaining({ callbackUrl: "/blog" })
    );
  });

  it("shows success toast, signs in, and redirects on successful registration", async () => {
    mockOkResponse({ username: "noel", email: "noel@example.com" });
    mockSignIn.mockResolvedValueOnce({ error: null } as never);
    render(<RegisterPage />);

    await fillAndSubmit();

    expect(mockToast.success).toHaveBeenCalledWith("Account created! Signing you in...");
    expect(mockSignIn).toHaveBeenCalledWith(
      "credentials",
      expect.objectContaining({ username: "noel", password: "password123", redirect: false })
    );
    expect(mockPush).toHaveBeenCalledWith("/blog");
  });

  it("shows error toast with server message on API failure", async () => {
    mockErrorResponse({ username: ["Username already taken."] });
    render(<RegisterPage />);

    await fillAndSubmit();

    expect(mockToast.error).toHaveBeenCalledWith("Username already taken.");
  });

  it('shows fallback "Registration failed." when server returns empty error body', async () => {
    mockErrorResponse({});
    render(<RegisterPage />);

    await fillAndSubmit();

    expect(mockToast.error).toHaveBeenCalledWith("Registration failed.");
  });

  it("shows generic error toast when network request throws", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));
    render(<RegisterPage />);

    await fillAndSubmit();

    expect(mockToast.error).toHaveBeenCalledWith("Something went wrong. Please try again.");
  });
});
