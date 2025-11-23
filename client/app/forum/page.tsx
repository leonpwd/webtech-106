import PostList from "@/components/forum/PostList";
import SearchFilters from "@/components/forum/SearchFilters";
import Link from "next/link";
import { FaPlus } from "react-icons/fa";

export default async function ForumPage({
  searchParams,
}: {
  searchParams?: { q?: string; categories?: string; tags?: string } | Promise<{ q?: string; categories?: string; tags?: string } | undefined>;
}) {
  // Next may provide `searchParams` as a Promise in some runtimes — await to be safe
  const params = await (searchParams as any);
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent mb-2">
              Community Forum
            </h1>
            <p className="text-neutral-400">
              Join the discussion, share your builds, and connect with other
              players.
            </p>
          </div>
          <Link
            href="/forum/create"
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition shadow-lg shadow-primary/20"
          >
            <FaPlus /> Create Post
          </Link>
        </div>

        <SearchFilters initialParams={params} />

        <PostList searchParams={params} />
      </div>
    </div>
  );
}
