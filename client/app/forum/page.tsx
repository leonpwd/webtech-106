import PostList from "@/components/forum/PostList";
import Link from "next/link";
import { FaPlus } from "react-icons/fa";

export default function ForumPage({
  searchParams,
}: {
  searchParams?: { q?: string };
}) {
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

        <div className="mb-8">
          <form className="relative">
            <input
              type="text"
              name="q"
              placeholder="Search discussions..."
              defaultValue={searchParams?.q}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-6 py-4 pl-12 focus:outline-none focus:border-primary transition"
            />
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </form>
        </div>

        <PostList searchParams={searchParams} />
      </div>
    </div>
  );
}
