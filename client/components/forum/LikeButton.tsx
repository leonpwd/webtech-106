"use client";

import { useState, useEffect } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import getSupabase from "@/lib/supabaseClient";

interface LikeButtonProps {
    targetId: string;
    type: "post" | "comment";
    initialCount?: number;
}

export default function LikeButton({
    targetId,
    type,
    initialCount = 0,
}: LikeButtonProps) {
    const [liked, setLiked] = useState(false);
    const [count, setCount] = useState(initialCount);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState<string | null>(null);

    const table = type === "post" ? "post_likes" : "comment_likes";
    const idField = type === "post" ? "post_id" : "comment_id";

    useEffect(() => {
        const supabase = getSupabase();
        if (!supabase) return;

        supabase.auth.getUser().then(({ data }) => {
            if (data.user) {
                setUserId(data.user.id);
                checkIfLiked(data.user.id);
            } else {
                setLoading(false);
            }
        });

        fetchCount();

        async function checkIfLiked(uid: string) {
            const { data, error } = await supabase
                .from(table)
                .select("*")
                .eq("user_id", uid)
                .eq(idField, targetId)
                .single();

            if (data) setLiked(true);
            setLoading(false);
        }

        async function fetchCount() {
            const { count, error } = await supabase
                .from(table)
                .select("*", { count: "exact", head: true })
                .eq(idField, targetId);

            if (count !== null) setCount(count);
        }
    }, [targetId, type]);

    const toggleLike = async (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent link navigation if inside a card
        e.stopPropagation();

        if (!userId) {
            alert("Please login to like.");
            return;
        }

        const supabase = getSupabase();
        if (!supabase) return;

        // Optimistic update
        const previousLiked = liked;
        const previousCount = count;
        setLiked(!liked);
        setCount(liked ? count - 1 : count + 1);

        try {
            if (previousLiked) {
                // Unlike
                const { error } = await supabase
                    .from(table)
                    .delete()
                    .eq("user_id", userId)
                    .eq(idField, targetId);
                if (error) throw error;
            } else {
                // Like
                const { error } = await supabase.from(table).insert({
                    user_id: userId,
                    [idField]: targetId,
                });
                if (error) throw error;
            }
        } catch (err) {
            console.error("Error toggling like:", err);
            // Revert on error
            setLiked(previousLiked);
            setCount(previousCount);
        }
    };

    if (loading)
        return (
            <div className="w-12 h-8 bg-neutral-200 dark:bg-white/5 rounded-full animate-pulse" />
        );

    return (
        <button
            onClick={toggleLike}
            className={`group flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${liked
                    ? "bg-red-500/10 text-red-500 hover:bg-red-500/20"
                    : "bg-neutral-100 dark:bg-white/5 text-neutral-500 dark:text-neutral-400 hover:bg-red-500/10 hover:text-red-500"
                }`}
        >
            <span
                className={`transition-transform duration-300 ${liked ? "scale-110" : "group-hover:scale-110"
                    }`}
            >
                {liked ? <FaHeart /> : <FaRegHeart />}
            </span>
            <span>{count}</span>
        </button>
    );
}
