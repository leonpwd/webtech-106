"use client";

import { useState, useEffect } from "react";
import getSupabase from "@/lib/supabaseClient";
import { formatDistanceToNow } from "date-fns";
import { FaTrash, FaEdit, FaSave, FaTimes } from "react-icons/fa";

export default function CommentSection({ postId }: { postId: string }) {
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [email, setEmail] = useState(""); // For guest/fallback
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) return;

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      if (data.user?.email) setEmail(data.user.email);
    });

    fetchComments();

    // Subscribe to new comments
    const channel = supabase
      .channel("comments")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "comments",
          filter: `post_id=eq.${postId}`,
        },
        (payload) => {
          setComments((prev) => [...prev, payload.new]);
        },
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "comments",
          filter: `post_id=eq.${postId}`,
        },
        (payload) => {
          setComments((prev) => prev.filter((c) => c.id !== payload.old.id));
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [postId]);

  async function fetchComments() {
    const supabase = getSupabase();
    if (!supabase) return;

    const { data } = await supabase
      .from("comments")
      .select("*")
      .eq("post_id", postId)
      .order("created_at", { ascending: true });

    if (data) setComments(data);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!newComment.trim() || !email.trim()) return;
    setLoading(true);

    const supabase = getSupabase();
    if (!supabase) return;

    // Use only the provider/raw metadata `name` field as requested.
    // Fall back to email local-part if not present.
    // `raw_user_meta_data` isn't in the typed `User` interface from supabase-js,
    // cast to `any` to access provider/raw metadata without TypeScript errors.
    const nameFromUser = (user as any)?.raw_user_meta_data?.name ?? email.split("@")[0];

    const { data: insertedComment, error } = await supabase
      .from("comments")
      .insert({
        post_id: postId,
        content: newComment,
        author_id: user?.id || null,
        author_email: email,
        author_name: nameFromUser,
        author_avatar_url: user?.user_metadata?.icon || null,
      })
      .select()
      .single();

    if (!error && insertedComment) {
      setNewComment("");
      setComments((prev) => [...prev, insertedComment]);
      if (!user) setEmail(""); // clear email if guest
    }
    setLoading(false);
  }

  async function handleDelete(commentId: string) {
    if (!confirm("Are you sure you want to delete this comment?")) return;
    const supabase = getSupabase();
    if (!supabase) return;
    const { error } = await supabase
      .from("comments")
      .delete()
      .eq("id", commentId);
    if (!error) {
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    }
  }

  async function handleSaveEdit(commentId: string) {
    if (!editingContent.trim()) return;
    setEditLoading(true);
    const supabase = getSupabase();
    if (!supabase) {
      // If Supabase isn't configured, apply the edit locally so the UI stays responsive,
      // but surface a clear message that the change won't be persisted.
      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId
            ? { ...c, content: editingContent, updated_at: new Date().toISOString() }
            : c,
        ),
      );
      setEditingId(null);
      setEditingContent("");
      setEditError("Supabase not configured — changes applied locally only.");
      setEditLoading(false);
      return;
    }

    // Avoid updating `updated_at` column directly — some schemas may not have it.
    // Log payload and auth state to help debug why updates may silently not apply.
    console.debug("Updating comment payload", {
      commentId,
      content: editingContent,
      userId: user?.id ?? null,
    });

    // Use the raw response and normalize `data` which may be an array or object.
    const res = await supabase
      .from("comments")
      .update({ content: editingContent })
      .eq("id", commentId)
      .select();

    // Log the raw Supabase response for debugging (body, error, status-like fields)
    try {
      console.debug("Supabase update response", res);
    } catch (e) {
      console.warn("Failed to stringify Supabase response for debug:", e);
    }

    let updated: any = null;
    const error = (res as any).error ?? null;
    if (res && (res as any).data) {
      if (Array.isArray((res as any).data)) {
        updated = (res as any).data[0] ?? null;
      } else {
        updated = (res as any).data ?? null;
      }
    }

    if (error) {
      // Update failed — show detailed error and keep edit open so user can retry
      // Log a readable error message. Some Supabase errors are plain objects.
      try {
        const text = error?.message ?? error?.msg ?? JSON.stringify(error);
        console.error("Supabase update failed for comment", commentId, text);
      } catch (e) {
        console.error("Supabase update failed for comment", commentId, error);
      }
      const message = (error && (error.message || error.msg || JSON.stringify(error))) || "Failed to update comment";
      setEditError(message as string);
    } else if (updated) {
      // Success: server returned the updated row
      setComments((prev) => prev.map((c) => (c.id === commentId ? updated : c)));
      setEditingId(null);
      setEditingContent("");
      setEditError(null);
    } else {
      // No error, but server didn't return the updated row (could be PostgREST config).
      // Re-fetch comments to verify persistence, then close edit if changes are present.
      try {
        await fetchComments();
        // After refetch, clear editing state — if the change wasn't persisted the user can try again.
        setEditingId(null);
        setEditingContent("");
        setEditError(null);
      } catch (e) {
        console.error("Update returned no row and refetch failed:", e);
        setEditError("Update may not have been saved; please try again.");
      }
    }

    setEditLoading(false);
  }

  return (
    <div className="mt-12 pt-8 border-t border-neutral-200 dark:border-white/10">
      <h3 className="text-2xl font-bold mb-6 text-neutral-900 dark:text-white">
        Comments ({comments.length})
      </h3>

      <div className="space-y-6 mb-8">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="bg-neutral-100 dark:bg-white/5 rounded-lg p-4"
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                {/* Gravatar could go here */}
                {comment.author_avatar_url ? (
                  <img
                    src={comment.author_avatar_url}
                    alt={comment.author_name || "User"}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                    {(comment.author_email?.[0] || "A").toUpperCase()}
                  </div>
                )}
                <div>
                  <div className="font-bold text-sm text-neutral-900 dark:text-white">
                    {comment.author_name || comment.author_email}
                  </div>
                  <div className="text-xs text-neutral-500 dark:text-neutral-400">
                    {formatDistanceToNow(new Date(comment.created_at), {
                      addSuffix: true,
                    })}
                  </div>
                </div>
              </div>
              {user && user.id === comment.author_id && (
                <div className="flex items-center gap-2">
                  {editingId === comment.id ? (
                    <>
                      <button
                        onClick={() => handleSaveEdit(comment.id)}
                        className="text-neutral-500 hover:text-green-500"
                        disabled={editLoading}
                      >
                        <FaSave />
                      </button>
                      <button
                        onClick={() => {
                          setEditingId(null);
                          setEditingContent("");
                        }}
                        className="text-neutral-500 hover:text-yellow-500"
                        disabled={editLoading}
                      >
                        <FaTimes />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setEditingId(comment.id);
                          setEditingContent(comment.content || "");
                        }}
                        className="text-neutral-500 hover:text-primary"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(comment.id)}
                        className="text-neutral-500 hover:text-red-500"
                      >
                        <FaTrash />
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
            <div className="pl-10">
              {editingId === comment.id ? (
                <div>
                  <textarea
                    value={editingContent}
                    onChange={(e) => setEditingContent(e.target.value)}
                    className="w-full bg-white dark:bg-black/20 border border-neutral-300 dark:border-white/10 rounded px-3 py-2 h-24 text-neutral-900 dark:text-white"
                  />
                  {editingId === comment.id && editError && (
                    <div className="mt-2 text-sm text-red-600">{editError}</div>
                  )}
                </div>
              ) : (
                <p className="text-neutral-700 dark:text-neutral-300 text-sm">
                  {comment.content}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-neutral-100 dark:bg-white/5 rounded-lg p-6"
      >
        <h4 className="text-lg font-bold mb-4 text-neutral-900 dark:text-white">
          Leave a comment
        </h4>
        {!user && (
          <div className="mb-4">
            <label className="block text-sm mb-1 text-neutral-700 dark:text-neutral-300">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white dark:bg-black/20 border border-neutral-300 dark:border-white/10 rounded px-3 py-2 text-neutral-900 dark:text-white"
              required
            />
          </div>
        )}
        <div className="mb-4">
          <label className="block text-sm mb-1 text-neutral-700 dark:text-neutral-300">
            Comment
          </label>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full bg-white dark:bg-black/20 border border-neutral-300 dark:border-white/10 rounded px-3 py-2 h-24 text-neutral-900 dark:text-white"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 disabled:opacity-50"
        >
          {loading ? "Posting..." : "Post Comment"}
        </button>
      </form>
    </div>
  );
}
