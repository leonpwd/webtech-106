"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import LikeButton from "./LikeButton";

interface PostCardProps {
  post: {
    id: string;
    title: string;
    content: string; // We might want to strip HTML for preview
    created_at: string;
    author_email: string;
    author_name?: string;
    author_avatar_url?: string;
    categories?: string[];
    tags?: string[];
  };
}

export default function PostCard({ post }: PostCardProps) {
  // Strip HTML tags for preview
  const preview =
    post.content.replace(/<[^>]+>/g, "").substring(0, 150) + "...";

  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-6 hover:bg-white/10 transition">
      <Link href={`/forum/${post.id}`} className="block">
        <h3 className="text-xl font-bold mb-2 text-primary">{post.title}</h3>
        <div className="flex items-center gap-2 mb-4">
          {post.author_avatar_url && (
            <img
              src={post.author_avatar_url}
              alt={post.author_name || "Author"}
              className="w-10 h-10 rounded-full object-cover border border-white/10"
            />
          )}
          <p className="text-neutral-400 text-sm">
            By{" "}
            {post.author_name || post.author_email?.split("@")[0] || "Unknown"}{" "}
            •{" "}
            {formatDistanceToNow(new Date(post.created_at), {
              addSuffix: true,
            })}
          </p>
        </div>
        <p className="text-neutral-300 mb-4">{preview}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {post.categories?.map((cat, i) => (
            <span
              key={i}
              className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full"
            >
              {cat}
            </span>
          ))}
          {post.tags?.map((tag, i) => (
            <span
              key={i}
              className="text-xs bg-neutral-700 text-neutral-300 px-2 py-1 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between mt-4">
          <LikeButton targetId={post.id} type="post" />
        </div>
      </Link>
    </div>
  );
}
