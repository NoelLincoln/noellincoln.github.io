"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { handleAsync } from "@/lib/handle-async";
import { getCategories, createCategory } from "@/lib/api";
import type { Category } from "@/lib/api";

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // kept for form-level validation only

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  const handleNameChange = (val: string) => {
    setName(val);
    setSlug(slugify(val));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !slug) return;
    setLoading(true);
    setError("");
    const created = await handleAsync(() => createCategory({ name, slug }), {
      success: `Category created.`,
      error: "Failed to create category. Slug may already exist.",
    });
    if (created) {
      setCategories((prev) => [...prev, created]);
      setName("");
      setSlug("");
    }
    setLoading(false);
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="max-w-2xl mx-auto px-4 pt-28 pb-24">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10"
          >
            ← Back to the blog
          </Link>

          <h1 className="text-4xl font-black uppercase tracking-tight text-primary mb-2">
            Categories
          </h1>
          <p className="text-sm text-muted-foreground mb-10">
            Create categories to organise your posts.
          </p>

          {/* Create form */}
          <Card className="mb-10">
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g. Django"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
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
                    Auto-generated from name. Edit if needed.
                  </p>
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <Button type="submit" disabled={loading} className="w-fit">
                  {loading ? "Creating..." : "Create category"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Category list */}
          {categories.length === 0 ? (
            <p className="text-muted-foreground text-sm">No categories yet.</p>
          ) : (
            <div className="flex flex-wrap gap-3">
              {categories.map((cat) => (
                <Badge key={cat.id} variant="secondary" className="text-sm px-3 py-1">
                  {cat.name}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
