"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import getSupabase from "@/lib/supabaseClient";
import { formatDistanceToNow } from "date-fns";
import CommentSection from "./CommentSection";
import { FaEdit, FaTrash, FaArrowLeft } from "react-icons/fa";
import DOMPurify from "isomorphic-dompurify";

export default function PostDetail({ id }: { id: string }) {
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) return;

    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    async function fetchPost() {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error(error);
      } else {
        setPost(data);
      }
      setLoading(false);
    }

    fetchPost();
  }, [id]);

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this post?")) return;
    const supabase = getSupabase();
    if (!supabase) return;

    await supabase.from("posts").delete().eq("id", id);
    router.push("/forum");
  }

  if (loading) return <div className="p-12 text-center">Loading...</div>;
  if (!post) return <div className="p-12 text-center">Post not found</div>;

  const isAuthor = user && user.id === post.author_id;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link
        href="/forum"
        className="inline-flex items-center gap-2 text-neutral-400 hover:text-white mb-8"
      >
        <FaArrowLeft /> Back to Forum
      </Link>

      <div className="mb-8">
        <div className="flex justify-between items-start">
          <h1 className="text-4xl font-bold mb-4 text-primary">{post.title}</h1>
          {isAuthor && (
            <div className="flex gap-2">
              <Link
                href={`/forum/edit/${post.id}`}
                className="p-2 text-neutral-400 hover:text-white bg-white/5 rounded"
              >
                <FaEdit />
              </Link>
              <button
                onClick={handleDelete}
                className="p-2 text-neutral-400 hover:text-red-500 bg-white/5 rounded"
              >
                <FaTrash />
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 text-sm text-neutral-400 mb-8">
          <span>By {post.author_email}</span>
          <span>•</span>
          <span>
            {formatDistanceToNow(new Date(post.created_at), {
              addSuffix: true,
            })}
          </span>
        </div>

        <div className="flex gap-2 mb-8">
          {post.categories?.map((cat: string, i: number) => (
            <span
              key={i}
              className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm"
            >
              {cat}
            </span>
          ))}
        </div>

        <div
          className="prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
        />
      </div>

      <CommentSection postId={post.id} />
    </div>
  );
}
