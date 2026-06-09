import Link from "next/link";
import Header from "@/components/layout/Header";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getPosts } from "@/lib/api";

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        {/* Page hero */}
        <section className="text-center pt-32 pb-16 px-4">
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tight text-primary mb-4">
            Blog
          </h1>
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-6">
            Thoughts on software engineering &amp; learning in public
          </p>
          <Link
            href="/blog/create"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary border border-primary/40 rounded-full px-4 py-1.5 hover:bg-primary/10 transition-colors"
          >
            + Write a post
          </Link>
        </section>

        {/* Posts grid */}
        <section className="max-w-6xl mx-auto px-4 pb-24">
          {posts.length === 0 ? (
            <p className="text-center text-muted-foreground py-20">No posts yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {posts.map((post) => (
                <Card key={post.id} className="group pt-0 flex flex-col">
                  {/* Image / placeholder — first child so Card removes top padding */}
                  <Link
                    href={`/blog/${post.slug}`}
                    className="relative aspect-video rounded-t-xl overflow-hidden bg-linear-to-br from-accent to-background block"
                  >
                    {/* Subtle grid texture */}
                    <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(129,140,248,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(129,140,248,0.3)_1px,transparent_1px)] bg-[size:32px_32px]" />
                    {/* Category badge overlaid on image */}
                    {post.category && (
                      <Badge className="absolute top-3 right-3 uppercase tracking-wider text-[10px] font-bold">
                        ★ {post.category.name}
                      </Badge>
                    )}
                  </Link>

                  {/* Card body */}
                  <CardContent className="flex flex-col flex-1 pt-5">
                    {post.published_at && (
                      <p className="text-xs text-muted-foreground mb-2">
                        📅{" "}
                        {new Date(post.published_at).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    )}
                    <Link href={`/blog/${post.slug}`}>
                      <h2 className="text-lg font-black uppercase tracking-tight leading-snug mb-3 group-hover:text-primary transition-colors">
                        {post.title}
                      </h2>
                    </Link>
                    <p className="text-sm text-muted-foreground line-clamp-3">{post.body}</p>
                  </CardContent>

                  {/* Card footer — "Read article" CTA */}
                  <CardFooter>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-primary text-xs font-bold uppercase tracking-widest hover:underline underline-offset-4"
                    >
                      Read the article →
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
