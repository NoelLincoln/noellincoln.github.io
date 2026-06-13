const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface Post {
  id: number;
  title: string;
  slug: string;
  body: string;
  category: Category | null;
  status: string;
  published_at: string | null;
  created_at: string;
}

export async function getPosts(): Promise<Post[]> {
  const res = await fetch(`${API_URL}/api/posts/`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch posts");
  return res.json();
}

export async function getPost(slug: string): Promise<Post> {
  const res = await fetch(`${API_URL}/api/posts/${slug}/`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch post");
  return res.json();
}

export async function createPost(
  data: {
    title: string;
    slug: string;
    body: string;
    category_id: number | null;
    status: string;
    published_at: string | null;
  },
  token?: string
): Promise<Post> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${API_URL}/api/posts/`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });
  if (res.status === 401) throw new Error("Unauthorized");
  if (!res.ok) throw new Error("Failed to create post");
  return res.json();
}

export async function getCategories(): Promise<Category[]> {
  const res = await fetch(`${API_URL}/api/categories/`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
}

export interface Comment {
  id: number;
  author_name: string;
  body: string;
  like_count: number;
  created_at: string;
}

export async function getComments(slug: string): Promise<Comment[]> {
  const res = await fetch(`${API_URL}/api/posts/${slug}/comments/`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch comments");
  return res.json();
}

export async function createComment(slug: string, body: string, token: string): Promise<Comment> {
  const res = await fetch(`${API_URL}/api/posts/${slug}/comments/`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ body }),
  });
  if (res.status === 401) throw new Error("Unauthorized");
  if (!res.ok) throw new Error("Failed to post comment");
  return res.json();
}

export async function likeComment(
  slug: string,
  commentId: number,
  token: string
): Promise<{ like_count: number; liked: boolean }> {
  const res = await fetch(`${API_URL}/api/posts/${slug}/comments/${commentId}/like/`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status === 401) throw new Error("Unauthorized");
  if (!res.ok) throw new Error("Failed to like comment");
  return res.json();
}

export async function createCategory(
  data: { name: string; slug: string },
  token?: string
): Promise<Category> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${API_URL}/api/categories/`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });
  if (res.status === 401) throw new Error("Unauthorized");
  if (!res.ok) throw new Error("Failed to create category");
  return res.json();
}
