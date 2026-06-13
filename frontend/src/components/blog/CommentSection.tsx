"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { createComment, likeComment, type Comment } from "@/lib/api";

interface Props {
  slug: string;
  initialComments: Comment[];
}

export default function CommentSection({ slug, initialComments }: Props) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [likedIds, setLikedIds] = useState<Set<number>>(new Set());
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim() || !session?.accessToken) return;
    setLoading(true);
    try {
      const comment = await createComment(slug, body, session.accessToken);
      setComments((prev) => [...prev, comment]);
      setBody("");
      toast.success("Comment posted!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to post comment.");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (commentId: number) => {
    if (!session?.accessToken) return;
    try {
      const result = await likeComment(slug, commentId, session.accessToken);
      setComments((prev) =>
        prev.map((c) => (c.id === commentId ? { ...c, like_count: result.like_count } : c))
      );
      setLikedIds((prev) => {
        const next = new Set(prev);
        if (result.liked) next.add(commentId);
        else next.delete(commentId);
        return next;
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to like comment.");
    }
  };

  const heading = comments.length === 1 ? "1 Comment" : `${comments.length} Comments`;

  return (
    <section className="mt-16">
      <h2 className="text-xl font-black uppercase tracking-tight text-primary mb-6">{heading}</h2>

      {comments.length === 0 ? (
        <p className="text-sm text-muted-foreground mb-8">No comments yet. Be the first!</p>
      ) : (
        <div className="flex flex-col gap-4 mb-8">
          {comments.map((comment) => (
            <div key={comment.id} className="border border-border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-semibold">{comment.author_name}</span>
                <span className="text-xs text-muted-foreground">
                  {new Date(comment.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <p className="text-sm">{comment.body}</p>
              <div className="mt-3">
                {session ? (
                  <button
                    onClick={() => handleLike(comment.id)}
                    aria-label={likedIds.has(comment.id) ? "Unlike" : "Like"}
                    className={`text-xs flex items-center gap-1 transition-colors ${
                      likedIds.has(comment.id)
                        ? "text-pink-500"
                        : "text-muted-foreground hover:text-pink-500"
                    }`}
                  >
                    ♥ {comment.like_count}
                  </button>
                ) : (
                  <span className="text-xs text-muted-foreground">♥ {comment.like_count}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {session ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Leave a comment..."
            rows={3}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
          />
          <Button type="submit" disabled={loading || !body.trim()} className="self-start">
            {loading ? "Posting..." : "Post comment"}
          </Button>
        </form>
      ) : (
        <p className="text-sm text-muted-foreground">
          <Link href="/login" className="text-primary hover:underline">
            Sign in
          </Link>{" "}
          to leave a comment.
        </p>
      )}
    </section>
  );
}
