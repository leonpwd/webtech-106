"use client"

import { useState, useEffect } from 'react';
import getSupabase from '@/lib/supabaseClient';
import PostForm from '@/components/forum/PostForm';
import { useRouter } from 'next/navigation';

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
    const [post, setPost] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [id, setId] = useState<string>('');
    const router = useRouter();

    useEffect(() => {
        params.then(p => {
            setId(p.id);
            fetchPost(p.id);
        });
    }, [params]);

    async function fetchPost(postId: string) {
        const supabase = getSupabase();
        if (!supabase) return;

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            router.push('/auth/login');
            return;
        }

        const { data, error } = await supabase
            .from('posts')
            .select('*')
            .eq('id', postId)
            .single();

        if (error || !data) {
            router.push('/forum');
            return;
        }

        if (data.author_id !== user.id) {
            alert("You are not authorized to edit this post.");
            router.push(`/forum/${postId}`);
            return;
        }

        setPost(data);
        setLoading(false);
    }

    if (loading) return <div className="p-12 text-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-background text-foreground py-12">
            <div className="max-w-4xl mx-auto px-4">
                <h1 className="text-3xl font-bold mb-8 text-center">Edit Post</h1>
                <PostForm initialData={post} isEditing={true} />
            </div>
        </div>
    );
}
