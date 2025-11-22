"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import getSupabase from "@/lib/supabaseClient";
import RichTextEditor from "./RichTextEditor";

interface PostFormProps {
  initialData?: {
    id?: string;
    title: string;
    content: string;
    categories: string[];
    tags: string[];
  };
  isEditing?: boolean;
}

export default function PostForm({
  initialData,
  isEditing = false,
}: PostFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialData?.title || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [categories, setCategories] = useState(
    initialData?.categories?.join(", ") || "",
  );
  const [tags, setTags] = useState(initialData?.tags?.join(", ") || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = getSupabase();
    if (!supabase) {
      setError("Supabase client not initialized");
      setLoading(false);
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setError("You must be logged in to post.");
      setLoading(false);
      return;
    }

    // Use only the provider/raw metadata `name` field as requested.
    // Fall back to email local-part if not present.
    const nameFromUser =
      user?.raw_user_meta_data?.name ?? (user?.email ? user.email.split("@")[0] : null);

    const postData = {
      title,
      content,
      author_id: user.id,
      author_email: user.email,
      author_name: nameFromUser,
      categories: categories
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      tags: tags
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      updated_at: new Date().toISOString(),
    };

    let result;
    if (isEditing && initialData?.id) {
      result = await supabase
        .from("posts")
        .update(postData)
        .eq("id", initialData.id)
        .select();
    } else {
      result = await supabase.from("posts").insert(postData).select();
    }

    if (result.error) {
      console.error(
        "Error saving post:",
        JSON.stringify(result.error, null, 2),
      );
      setError(result.error.message);
    } else {
      const postId = result.data?.[0]?.id;
      router.push(`/forum/${postId}`);
      router.refresh();
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-2">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded px-4 py-2 focus:outline-none focus:border-primary"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Content</label>
        <RichTextEditor value={content} onChange={setContent} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Categories (comma separated)
          </label>
          <input
            type="text"
            value={categories}
            onChange={(e) => setCategories(e.target.value)}
            placeholder="e.g. Discussion, Help, Guide"
            className="w-full bg-white/5 border border-white/10 rounded px-4 py-2 focus:outline-none focus:border-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            Tags (comma separated)
          </label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="e.g. lol, build, patch"
            className="w-full bg-white/5 border border-white/10 rounded px-4 py-2 focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2 rounded hover:bg-white/10 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 rounded bg-primary text-white hover:bg-primary/90 transition disabled:opacity-50"
        >
          {loading ? "Saving..." : isEditing ? "Update Post" : "Create Post"}
        </button>
      </div>
    </form>
  );
}
