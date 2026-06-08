import Link from "next/link";
import ReactMarkdown from "react-markdown";
import Header from "@/components/layout/Header";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getPost } from "@/lib/api";

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="max-w-3xl mx-auto px-4 pt-28 pb-24">
          {/* Back link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10"
          >
            ← Back to the blog
          </Link>

          {/* Title */}
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-primary leading-tight mb-6">
            {post.title}
          </h1>

          {/* Metadata row */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8">
            {post.published_at && (
              <span className="flex items-center gap-1.5">
                📅{" "}
                {new Date(post.published_at).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            )}
            {post.category && (
              <Badge variant="secondary" className="uppercase tracking-wider text-[10px]">
                {post.category.name}
              </Badge>
            )}
          </div>

          <Separator className="mb-10" />

          {/* Body */}
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <ReactMarkdown>{post.body}</ReactMarkdown>
          </div>
        </div>
      </main>
    </>
  );
}
