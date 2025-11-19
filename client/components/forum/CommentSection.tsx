"use client"

import { useState, useEffect } from 'react';
import getSupabase from '@/lib/supabaseClient';
import { formatDistanceToNow } from 'date-fns';
import { FaTrash } from 'react-icons/fa';

export default function CommentSection({ postId }: { postId: string }) {
    const [comments, setComments] = useState<any[]>([]);
    const [newComment, setNewComment] = useState('');
    const [email, setEmail] = useState(''); // For guest/fallback
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(false);

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
            .channel('comments')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'comments', filter: `post_id=eq.${postId}` }, (payload) => {
                setComments(prev => [...prev, payload.new]);
            })
            .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'comments', filter: `post_id=eq.${postId}` }, (payload) => {
                setComments(prev => prev.filter(c => c.id !== payload.old.id));
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [postId]);

    async function fetchComments() {
        const supabase = getSupabase();
        if (!supabase) return;

        const { data } = await supabase
            .from('comments')
            .select('*')
            .eq('post_id', postId)
            .order('created_at', { ascending: true });

        if (data) setComments(data);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!newComment.trim() || !email.trim()) return;
        setLoading(true);

        const supabase = getSupabase();
        if (!supabase) return;

        const { data: insertedComment, error } = await supabase.from('comments').insert({
            post_id: postId,
            content: newComment,
            author_id: user?.id || null,
            author_email: email,
            author_name: user?.user_metadata?.full_name || email.split('@')[0],
            author_avatar_url: user?.user_metadata?.icon || null
        }).select().single();

        if (!error && insertedComment) {
            setNewComment('');
            setComments(prev => [...prev, insertedComment]);
            if (!user) setEmail(''); // clear email if guest
        }
        setLoading(false);
    }

    async function handleDelete(commentId: string) {
        if (!confirm('Are you sure you want to delete this comment?')) return;
        const supabase = getSupabase();
        if (!supabase) return;
        const { error } = await supabase.from('comments').delete().eq('id', commentId);
        if (!error) {
            setComments(prev => prev.filter(c => c.id !== commentId));
        }
    }

    return (
        <div className="mt-12 pt-8 border-t border-neutral-200 dark:border-white/10">
            <h3 className="text-2xl font-bold mb-6 text-neutral-900 dark:text-white">Comments ({comments.length})</h3>

            <div className="space-y-6 mb-8">
                {comments.map(comment => (
                    <div key={comment.id} className="bg-neutral-100 dark:bg-white/5 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                                {/* Gravatar could go here */}
                                {comment.author_avatar_url ? (
                                    <img
                                        src={comment.author_avatar_url}
                                        alt={comment.author_name || 'User'}
                                        className="w-8 h-8 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                                        {(comment.author_email?.[0] || 'A').toUpperCase()}
                                    </div>
                                )}
                                <div>
                                    <div className="font-bold text-sm text-neutral-900 dark:text-white">{comment.author_name || comment.author_email}</div>
                                    <div className="text-xs text-neutral-500 dark:text-neutral-400">
                                        {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                                    </div>
                                </div>
                            </div>
                            {user && user.id === comment.author_id && (
                                <button onClick={() => handleDelete(comment.id)} className="text-neutral-500 hover:text-red-500">
                                    <FaTrash />
                                </button>
                            )}
                        </div>
                        <p className="text-neutral-700 dark:text-neutral-300 text-sm pl-10">{comment.content}</p>
                    </div>
                ))}
            </div>

            <form onSubmit={handleSubmit} className="bg-neutral-100 dark:bg-white/5 rounded-lg p-6">
                <h4 className="text-lg font-bold mb-4 text-neutral-900 dark:text-white">Leave a comment</h4>
                {!user && (
                    <div className="mb-4">
                        <label className="block text-sm mb-1 text-neutral-700 dark:text-neutral-300">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full bg-white dark:bg-black/20 border border-neutral-300 dark:border-white/10 rounded px-3 py-2 text-neutral-900 dark:text-white"
                            required
                        />
                    </div>
                )}
                <div className="mb-4">
                    <label className="block text-sm mb-1 text-neutral-700 dark:text-neutral-300">Comment</label>
                    <textarea
                        value={newComment}
                        onChange={e => setNewComment(e.target.value)}
                        className="w-full bg-white dark:bg-black/20 border border-neutral-300 dark:border-white/10 rounded px-3 py-2 h-24 text-neutral-900 dark:text-white"
                        required
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 disabled:opacity-50"
                >
                    {loading ? 'Posting...' : 'Post Comment'}
                </button>
            </form>
        </div>
    );
}
