"use client"

import { useState, useEffect } from 'react';
import getSupabase from '@/lib/supabaseClient';
import PostCard from './PostCard';
import { FaSpinner } from 'react-icons/fa';

export default function PostList({ searchParams }: { searchParams?: { q?: string } }) {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(false);
    const PAGE_SIZE = 10;

    const query = searchParams?.q || '';

    useEffect(() => {
        fetchPosts();
    }, [page, query]);

    async function fetchPosts() {
        setLoading(true);
        const supabase = getSupabase();
        if (!supabase) return;

        let queryBuilder = supabase
            .from('posts')
            .select('*', { count: 'exact' })
            .order('created_at', { ascending: false })
            .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

        if (query) {
            // Simple text search on title or content
            // Note: For better search, use the SQL function search_posts if configured, 
            // but for simplicity/standard supabase, we can use ilike or textSearch
            // queryBuilder = queryBuilder.textSearch('fts', query) // requires fts setup
            // Let's use ilike for now on title
            queryBuilder = queryBuilder.or(`title.ilike.%${query}%,content.ilike.%${query}%`);
        }

        const { data, error, count } = await queryBuilder;

        if (error) {
            console.error('Error fetching posts:', JSON.stringify(error, null, 2));
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
                        posts.map(post => (
                            <PostCard key={post.id} post={post} />
                        ))
                    )}
                </div>
            )}

            <div className="flex justify-center gap-4 mt-8">
                <button
                    disabled={page === 0}
                    onClick={() => setPage(p => p - 1)}
                    className="px-4 py-2 rounded bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Previous
                </button>
                <button
                    disabled={!hasMore}
                    onClick={() => setPage(p => p + 1)}
                    className="px-4 py-2 rounded bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Next
                </button>
            </div>
        </div>
    );
}
