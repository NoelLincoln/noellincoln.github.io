"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { handleAsync } from "@/lib/handle-async";
import { getCategories, createPost } from "@/lib/api";
import type { Category } from "@/lib/api";

// Dynamic import — the markdown editor uses browser APIs so it can't run on the server
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function CreatePostPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [body, setBody] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [status, setStatus] = useState("draft");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    setSlug(slugify(val));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug || !body) {
      toast.error("Title, slug, and body are required.");
      return;
    }
    setLoading(true);
    const post = await handleAsync(
      () =>
        createPost({
          title,
          slug,
          body,
          category_id: categoryId,
          status,
          published_at: status === "published" ? new Date().toISOString() : null,
        }),
      { success: "Post created!", error: "Failed to create post. Slug may already exist." }
    );
    if (post) router.push(`/blog/${post.slug}`);
    setLoading(false);
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 pt-28 pb-24">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10"
          >
            ← Back to the blog
          </Link>

          <div className="flex items-start justify-between mb-8">
            <h1 className="text-4xl font-black uppercase tracking-tight text-primary">New Post</h1>
            {/* Temporary warning — auth not yet implemented */}
            <span className="text-xs bg-yellow-500/10 text-yellow-500 border border-yellow-500/30 rounded px-3 py-1">
              ⚠ Not yet protected — auth coming soon
            </span>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <Card>
              <CardContent className="pt-6 flex flex-col gap-5">
                {/* Title */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium">Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="My post title"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                {/* Slug */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium">Slug</label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="auto-generated"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <p className="text-xs text-muted-foreground">
                    Auto-generated from title. This becomes the URL.
                  </p>
                </div>

                {/* Category + Status row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium">Category</label>
                    <select
                      value={categoryId ?? ""}
                      onChange={(e) =>
                        setCategoryId(e.target.value ? Number(e.target.value) : null)
                      }
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="">No category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                    <Link href="/blog/categories" className="text-xs text-primary hover:underline">
                      + Manage categories
                    </Link>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium">Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                    <p className="text-xs text-muted-foreground">
                      Drafts are not shown on the blog.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Markdown editor */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Body</label>
              <div data-color-mode="dark">
                <MDEditor
                  value={body}
                  onChange={(val) => setBody(val ?? "")}
                  height={400}
                  preview="live"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Supports markdown — headings, bold, lists, code blocks.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? "Publishing..." : status === "published" ? "Publish post" : "Save draft"}
              </Button>
              <Link href="/blog" className="text-sm text-muted-foreground hover:underline">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}
