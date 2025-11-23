"use client";

import { useState, useEffect } from "react";
import getSupabase from "@/lib/supabaseClient";
import PostCard from "./PostCard";
import { FaSpinner } from "react-icons/fa";

export default function PostList({
  searchParams,
}: {
  searchParams?: { q?: string; categories?: string; tags?: string };
}) {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const PAGE_SIZE = 10;

  const query = searchParams?.q || "";
  const categories = searchParams?.categories || "";
  const tags = searchParams?.tags || "";

  useEffect(() => {
    fetchPosts();
  }, [page, query, categories, tags]);

  async function fetchPosts() {
    setLoading(true);
    const supabase = getSupabase();
    if (!supabase) {
      // Supabase not configured: gracefully show empty list instead of hanging
      console.warn("Supabase client not available — PostList will show no posts.");
      setPosts([]);
      setHasMore(false);
      setLoading(false);
      return;
    }

    let queryBuilder = supabase
      .from("posts")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

    if (query.trim()) {
      // Simple text search on title or content
      queryBuilder = queryBuilder.or(
        `title.ilike.%${query.trim()}%,content.ilike.%${query.trim()}%`,
      );
    }

    if (categories && categories.trim()) {
      const categoryArray = categories.split(',').map(c => c.trim()).filter(Boolean);
      if (categoryArray.length > 0) {
        queryBuilder = queryBuilder.overlaps('categories', categoryArray);
      }
    }

    if (tags && tags.trim()) {
      const tagArray = tags.split(',').map(t => t.trim()).filter(Boolean);
      if (tagArray.length > 0) {
        queryBuilder = queryBuilder.overlaps('tags', tagArray);
      }
    }

    const { data, error, count } = await queryBuilder;

    if (error) {
      console.error("Error fetching posts:", JSON.stringify(error, null, 2));
    } else {
      setPosts(data || []);
      setHasMore((count || 0) > (page + 1) * PAGE_SIZE);
    }
    setLoading(false);
  }

  return (
    <div>
      {loading && posts.length === 0 ? (
        <div className="flex justify-center p-12">
          <FaSpinner className="animate-spin text-4xl text-primary" />
        </div>
      ) : (
        <div className="space-y-4">
          {posts.length === 0 ? (
            <div className="text-center py-12 text-neutral-400">
              No posts found. Be the first to create one!
            </div>
          ) : (
            posts.map((post) => <PostCard key={post.id} post={post} />)
          )}
        </div>
      )}

      <div className="flex justify-center gap-4 mt-8">
        <button
          disabled={page === 0}
          onClick={() => setPage((p) => p - 1)}
          className="px-4 py-2 rounded bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          disabled={!hasMore}
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 rounded bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
}
