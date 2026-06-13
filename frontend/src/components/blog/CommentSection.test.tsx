import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CommentSection from "./CommentSection";

vi.mock("next-auth/react", () => ({ useSession: vi.fn() }));
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));
vi.mock("@/lib/api", () => ({ createComment: vi.fn(), likeComment: vi.fn() }));

import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { createComment, likeComment } from "@/lib/api";
import type { Comment } from "@/lib/api";

const mockUseSession = vi.mocked(useSession);
const mockCreateComment = vi.mocked(createComment);
const mockLikeComment = vi.mocked(likeComment);
const mockToast = { success: vi.mocked(toast.success), error: vi.mocked(toast.error) };

const loggedOut = { data: null, status: "unauthenticated" as const, update: vi.fn() };
const loggedIn = () => ({
  data: { user: { name: "Noel" }, accessToken: "token-abc", expires: "" },
  status: "authenticated" as const,
  update: vi.fn(),
});

const sampleComments: Comment[] = [
  {
    id: 1,
    author_name: "alice",
    body: "Great post!",
    like_count: 3,
    created_at: "2024-01-15T10:00:00Z",
  },
  {
    id: 2,
    author_name: "bob",
    body: "Really helpful.",
    like_count: 0,
    created_at: "2024-01-16T10:00:00Z",
  },
];

beforeEach(() => {
  vi.clearAllMocks();
  mockUseSession.mockReturnValue(loggedOut);
});

describe("CommentSection", () => {
  it("shows comment count and renders each comment", () => {
    render(<CommentSection slug="test-post" initialComments={sampleComments} />);
    expect(screen.getByText("2 Comments")).toBeInTheDocument();
    expect(screen.getByText("Great post!")).toBeInTheDocument();
    expect(screen.getByText("Really helpful.")).toBeInTheDocument();
  });

  it("shows '1 Comment' for a single comment", () => {
    render(<CommentSection slug="test-post" initialComments={[sampleComments[0]]} />);
    expect(screen.getByText("1 Comment")).toBeInTheDocument();
  });

  it("shows empty state when there are no comments", () => {
    render(<CommentSection slug="test-post" initialComments={[]} />);
    expect(screen.getByText("0 Comments")).toBeInTheDocument();
    expect(screen.getByText(/No comments yet/)).toBeInTheDocument();
  });

  it("shows Sign in link when logged out", () => {
    render(<CommentSection slug="test-post" initialComments={[]} />);
    expect(screen.getByRole("link", { name: "Sign in" })).toBeInTheDocument();
  });

  it("shows comment form when logged in", () => {
    mockUseSession.mockReturnValue(loggedIn());
    render(<CommentSection slug="test-post" initialComments={[]} />);
    expect(screen.getByPlaceholderText("Leave a comment...")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Post comment" })).toBeInTheDocument();
  });

  it("does nothing when session has no access token", async () => {
    mockUseSession.mockReturnValue({
      data: { user: { name: "Noel" }, expires: "" },
      status: "authenticated" as const,
      update: vi.fn(),
    });
    render(<CommentSection slug="test-post" initialComments={[]} />);
    await userEvent.type(screen.getByPlaceholderText("Leave a comment..."), "hi");
    await userEvent.click(screen.getByRole("button", { name: "Post comment" }));
    expect(mockCreateComment).not.toHaveBeenCalled();
  });

  it("does nothing when body is empty on submit", () => {
    mockUseSession.mockReturnValue(loggedIn());
    const { container } = render(<CommentSection slug="test-post" initialComments={[]} />);
    fireEvent.submit(container.querySelector("form")!);
    expect(mockCreateComment).not.toHaveBeenCalled();
  });

  it("disables Post comment button when body is empty", () => {
    mockUseSession.mockReturnValue(loggedIn());
    render(<CommentSection slug="test-post" initialComments={[]} />);
    expect(screen.getByRole("button", { name: "Post comment" })).toBeDisabled();
  });

  it("posts a comment, appends it to the list, clears the form", async () => {
    const newComment: Comment = {
      id: 3,
      author_name: "noel",
      body: "Nice write-up!",
      like_count: 0,
      created_at: "2024-01-17T10:00:00Z",
    };
    mockCreateComment.mockResolvedValueOnce(newComment);
    mockUseSession.mockReturnValue(loggedIn());
    render(<CommentSection slug="test-post" initialComments={[]} />);
    await userEvent.type(screen.getByPlaceholderText("Leave a comment..."), "Nice write-up!");
    await userEvent.click(screen.getByRole("button", { name: "Post comment" }));
    await waitFor(() => expect(screen.getByText("Nice write-up!")).toBeInTheDocument());
    expect(mockToast.success).toHaveBeenCalledWith("Comment posted!");
    expect(screen.getByPlaceholderText("Leave a comment...")).toHaveValue("");
  });

  it("shows 'Posting...' while the request is in flight", async () => {
    let resolve!: (c: Comment) => void;
    mockCreateComment.mockReturnValueOnce(new Promise<Comment>((res) => (resolve = res)));
    mockUseSession.mockReturnValue(loggedIn());
    render(<CommentSection slug="test-post" initialComments={[]} />);
    await userEvent.type(screen.getByPlaceholderText("Leave a comment..."), "hi");
    await userEvent.click(screen.getByRole("button", { name: "Post comment" }));
    expect(screen.getByText("Posting...")).toBeInTheDocument();
    resolve({
      id: 4,
      author_name: "noel",
      body: "hi",
      like_count: 0,
      created_at: "2024-01-18T10:00:00Z",
    });
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Post comment" })).toBeInTheDocument()
    );
  });

  it("shows like button when logged in and like count as span when logged out", () => {
    render(<CommentSection slug="test-post" initialComments={sampleComments} />);
    expect(screen.queryByLabelText("Like")).not.toBeInTheDocument();
    expect(screen.getAllByText(/♥/).length).toBeGreaterThan(0);
  });

  it("liking a comment updates the count and toggles to Unlike", async () => {
    mockLikeComment.mockResolvedValueOnce({ like_count: 4, liked: true });
    mockUseSession.mockReturnValue(loggedIn());
    render(<CommentSection slug="test-post" initialComments={sampleComments} />);
    await userEvent.click(screen.getAllByLabelText("Like")[0]);
    await waitFor(() => expect(screen.getAllByLabelText("Unlike")[0]).toBeInTheDocument());
    expect(mockLikeComment).toHaveBeenCalledWith("test-post", 1, "token-abc");
  });

  it("unliking a comment updates the count and toggles back to Like", async () => {
    mockLikeComment
      .mockResolvedValueOnce({ like_count: 4, liked: true })
      .mockResolvedValueOnce({ like_count: 3, liked: false });
    mockUseSession.mockReturnValue(loggedIn());
    render(<CommentSection slug="test-post" initialComments={sampleComments} />);
    await userEvent.click(screen.getAllByLabelText("Like")[0]);
    await waitFor(() => screen.getAllByLabelText("Unlike")[0]);
    await userEvent.click(screen.getAllByLabelText("Unlike")[0]);
    await waitFor(() => expect(screen.getAllByLabelText("Like")[0]).toBeInTheDocument());
  });

  it("does nothing on handleLike when session has no access token", async () => {
    mockUseSession.mockReturnValue({
      data: { user: { name: "Noel" }, expires: "" },
      status: "authenticated" as const,
      update: vi.fn(),
    });
    render(<CommentSection slug="test-post" initialComments={sampleComments} />);
    await userEvent.click(screen.getAllByLabelText("Like")[0]);
    expect(mockLikeComment).not.toHaveBeenCalled();
  });

  it("shows error toast when likeComment throws an Error", async () => {
    mockLikeComment.mockRejectedValueOnce(new Error("Failed to like comment"));
    mockUseSession.mockReturnValue(loggedIn());
    render(<CommentSection slug="test-post" initialComments={sampleComments} />);
    await userEvent.click(screen.getAllByLabelText("Like")[0]);
    await waitFor(() => expect(mockToast.error).toHaveBeenCalledWith("Failed to like comment"));
  });

  it("shows fallback error toast when likeComment throws a non-Error", async () => {
    mockLikeComment.mockRejectedValueOnce("nope");
    mockUseSession.mockReturnValue(loggedIn());
    render(<CommentSection slug="test-post" initialComments={sampleComments} />);
    await userEvent.click(screen.getAllByLabelText("Like")[0]);
    await waitFor(() => expect(mockToast.error).toHaveBeenCalledWith("Failed to like comment."));
  });

  it("shows error toast with message when createComment throws an Error", async () => {
    mockCreateComment.mockRejectedValueOnce(new Error("Failed to post comment"));
    mockUseSession.mockReturnValue(loggedIn());
    render(<CommentSection slug="test-post" initialComments={[]} />);
    await userEvent.type(screen.getByPlaceholderText("Leave a comment..."), "oops");
    await userEvent.click(screen.getByRole("button", { name: "Post comment" }));
    await waitFor(() => expect(mockToast.error).toHaveBeenCalledWith("Failed to post comment"));
  });

  it("shows fallback error message when a non-Error is thrown", async () => {
    mockCreateComment.mockRejectedValueOnce("unexpected");
    mockUseSession.mockReturnValue(loggedIn());
    render(<CommentSection slug="test-post" initialComments={[]} />);
    await userEvent.type(screen.getByPlaceholderText("Leave a comment..."), "oops");
    await userEvent.click(screen.getByRole("button", { name: "Post comment" }));
    await waitFor(() => expect(mockToast.error).toHaveBeenCalledWith("Failed to post comment."));
  });
});
