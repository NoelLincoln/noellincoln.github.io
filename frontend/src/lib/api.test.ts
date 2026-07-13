import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  getPosts,
  getPost,
  createPost,
  getCategories,
  createCategory,
  getComments,
  createComment,
  likeComment,
} from "./api";

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

beforeEach(() => {
  vi.clearAllMocks();
});

function mockResponse(data: unknown, ok = true, status = 200) {
  mockFetch.mockResolvedValueOnce({
    ok,
    status,
    json: () => Promise.resolve(data),
  });
}

describe("getPosts", () => {
  it("fetches and returns posts", async () => {
    const posts = [{ id: 1, title: "Hello", slug: "hello" }];
    mockResponse(posts);
    expect(await getPosts()).toEqual(posts);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/posts/"),
      expect.any(Object)
    );
  });

  it("throws when response is not ok", async () => {
    mockResponse({}, false, 500);
    await expect(getPosts()).rejects.toThrow("Failed to fetch posts");
  });
});

describe("getPost", () => {
  it("fetches a single post by slug", async () => {
    const post = { id: 1, title: "Hello", slug: "hello" };
    mockResponse(post);
    expect(await getPost("hello")).toEqual(post);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/posts/hello/"),
      expect.any(Object)
    );
  });

  it("throws when post is not found", async () => {
    mockResponse({}, false, 404);
    await expect(getPost("missing")).rejects.toThrow("Failed to fetch post");
  });
});

describe("createPost", () => {
  const postData = {
    title: "New Post",
    slug: "new-post",
    body: "Body text",
    category_id: null,
    status: "draft",
    published_at: null,
  };

  it("sends POST with bearer token and returns created post", async () => {
    const created = { id: 2, ...postData };
    mockResponse(created);
    expect(await createPost(postData, "test-token")).toEqual(created);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/posts/"),
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({ Authorization: "Bearer test-token" }),
      })
    );
  });

  it("sends POST without Authorization header when no token provided", async () => {
    mockResponse({ id: 3, ...postData });
    await createPost(postData);
    const [, options] = mockFetch.mock.calls[0];
    expect(options.headers.Authorization).toBeUndefined();
  });

  it("throws Unauthorized on 401 response", async () => {
    mockResponse({}, false, 401);
    await expect(createPost(postData, "expired-token")).rejects.toThrow("Unauthorized");
  });

  it("throws when creation fails", async () => {
    mockResponse({}, false, 400);
    await expect(createPost(postData, "token")).rejects.toThrow("Failed to create post");
  });
});

describe("getCategories", () => {
  it("fetches and returns categories", async () => {
    const cats = [{ id: 1, name: "Django", slug: "django" }];
    mockResponse(cats);
    expect(await getCategories()).toEqual(cats);
  });

  it("throws when response is not ok", async () => {
    mockResponse({}, false, 500);
    await expect(getCategories()).rejects.toThrow("Failed to fetch categories");
  });
});

describe("getComments", () => {
  it("fetches and returns comments for a post", async () => {
    const comments = [{ id: 1, author_name: "alice", body: "hi", created_at: "2024-01-01" }];
    mockResponse(comments);
    expect(await getComments("my-post")).toEqual(comments);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/posts/my-post/comments/"),
      expect.any(Object)
    );
  });

  it("throws when response is not ok", async () => {
    mockResponse({}, false, 500);
    await expect(getComments("my-post")).rejects.toThrow("Failed to fetch comments");
  });
});

describe("createComment", () => {
  it("sends POST with bearer token and returns created comment", async () => {
    const comment = { id: 1, author_name: "noel", body: "Great!", created_at: "2024-01-01" };
    mockResponse(comment);
    expect(await createComment("my-post", "Great!", "test-token")).toEqual(comment);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/posts/my-post/comments/"),
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({ Authorization: "Bearer test-token" }),
      })
    );
  });

  it("throws Unauthorized on 401 response", async () => {
    mockResponse({}, false, 401);
    await expect(createComment("my-post", "hi", "expired-token")).rejects.toThrow("Unauthorized");
  });

  it("throws when creation fails", async () => {
    mockResponse({}, false, 500);
    await expect(createComment("my-post", "hi", "token")).rejects.toThrow("Failed to post comment");
  });
});

describe("likeComment", () => {
  it("sends POST with bearer token and returns like_count and liked", async () => {
    mockResponse({ like_count: 1, liked: true });
    const result = await likeComment("my-post", 42, "test-token");
    expect(result).toEqual({ like_count: 1, liked: true });
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/posts/my-post/comments/42/like/"),
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({ Authorization: "Bearer test-token" }),
      })
    );
  });

  it("throws Unauthorized on 401 response", async () => {
    mockResponse({}, false, 401);
    await expect(likeComment("my-post", 42, "expired-token")).rejects.toThrow("Unauthorized");
  });

  it("throws when request fails", async () => {
    mockResponse({}, false, 500);
    await expect(likeComment("my-post", 42, "token")).rejects.toThrow("Failed to like comment");
  });
});

describe("createCategory", () => {
  it("sends POST with bearer token and returns created category", async () => {
    const cat = { id: 1, name: "Django", slug: "django" };
    mockResponse(cat);
    expect(await createCategory({ name: "Django", slug: "django" }, "test-token")).toEqual(cat);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/categories/"),
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({ Authorization: "Bearer test-token" }),
      })
    );
  });

  it("sends POST without Authorization header when no token provided", async () => {
    mockResponse({ id: 1, name: "Django", slug: "django" });
    await createCategory({ name: "Django", slug: "django" });
    const [, options] = mockFetch.mock.calls[0];
    expect(options.headers.Authorization).toBeUndefined();
  });

  it("throws Unauthorized on 401 response", async () => {
    mockResponse({}, false, 401);
    await expect(
      createCategory({ name: "Django", slug: "django" }, "expired-token")
    ).rejects.toThrow("Unauthorized");
  });

  it("throws when creation fails", async () => {
    mockResponse({}, false, 400);
    await expect(createCategory({ name: "Django", slug: "django" }, "token")).rejects.toThrow(
      "Failed to create category"
    );
  });
});

// With NEXT_PUBLIC_API_URL unset, the client serves bundled static content
// (src/data/posts.json) instead of calling the backend. Re-import the module
// per test so the module-load `backendEnabled` flag reflects the unset env.
describe("static fallback when no backend is configured", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubEnv("NEXT_PUBLIC_API_URL", "");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("reports the backend as disabled", async () => {
    const api = await import("./api");
    expect(api.backendEnabled).toBe(false);
  });

  it("getPosts returns bundled static posts without calling fetch", async () => {
    const api = await import("./api");
    const posts = await api.getPosts();
    expect(posts.length).toBeGreaterThan(0);
    expect(posts[0]).toHaveProperty("slug");
    expect(typeof posts[0].body).toBe("string");
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("getPost returns a static post by slug", async () => {
    const api = await import("./api");
    const [first] = await api.getPosts();
    const post = await api.getPost(first.slug);
    expect(post.slug).toBe(first.slug);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("getPost throws when the slug is unknown", async () => {
    const api = await import("./api");
    await expect(api.getPost("no-such-post")).rejects.toThrow("Failed to fetch post");
  });

  it("getCategories returns bundled static categories", async () => {
    const api = await import("./api");
    const cats = await api.getCategories();
    expect(cats.length).toBeGreaterThan(0);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("getComments returns an empty list", async () => {
    const api = await import("./api");
    expect(await api.getComments("any-slug")).toEqual([]);
    expect(mockFetch).not.toHaveBeenCalled();
  });
});
