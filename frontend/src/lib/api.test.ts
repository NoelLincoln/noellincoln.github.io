import { describe, it, expect, vi, beforeEach } from "vitest";
import { getPosts, getPost, createPost, getCategories, createCategory } from "./api";

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
