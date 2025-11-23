"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import getSupabase from "@/lib/supabaseClient";
import Link from "next/link";
import { FaTrash, FaEye } from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";

export default function AdminDashboard() {
    const [posts, setPosts] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [activeTab, setActiveTab] = useState<"posts" | "users">("posts");
    const router = useRouter();

    useEffect(() => {
        const supabase = getSupabase();
        if (!supabase) return;

        // Check admin status
        supabase.auth.getUser().then(({ data }) => {
            if (data.user?.email === "leon.dalle@proton.me") {
                setIsAdmin(true);
                fetchPosts();
            } else {
                router.push("/");
            }
        });
    }, [router]);

    useEffect(() => {
        if (isAdmin && activeTab === "users" && users.length === 0) {
            fetchUsers();
        }
    }, [isAdmin, activeTab]);

    async function fetchPosts() {
        const supabase = getSupabase();
        if (!supabase) return;
        const { data, error } = await supabase
            .from("posts")
            .select("*")
            .order("created_at", { ascending: false });

        if (data) setPosts(data);
        setLoading(false);
    }

    async function fetchUsers() {
        const supabase = getSupabase();
        if (!supabase) return;
        const { data: sessionData } = await supabase.auth.getSession();
        const token = sessionData.session?.access_token;

        if (!token) return;

        try {
            const res = await fetch("/api/admin/users", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await res.json();
            if (data.users) {
                setUsers(
                    data.users.filter((u: any) => u.email !== "leon.dalle@proton.me")
                );
            }
        } catch (err) {
            console.error("Failed to fetch users", err);
        }
    }

    const handleDelete = async (id: string) => {
        if (
            !confirm(
                "Are you sure you want to delete this post? This action cannot be undone."
            )
        )
            return;

        const supabase = getSupabase();
        if (!supabase) return;

        const { error } = await supabase.from("posts").delete().eq("id", id);

        if (error) {
            alert("Failed to delete post: " + error.message);
        } else {
            setPosts((prev) => prev.filter((p) => p.id !== id));
        }
    };

    const handleDeleteUser = async (id: string) => {
        if (
            !confirm(
                "Are you sure you want to delete this user? This action cannot be undone."
            )
        )
            return;

        const supabase = getSupabase();
        if (!supabase) return;
        const { data: sessionData } = await supabase.auth.getSession();
        const token = sessionData.session?.access_token;

        if (!token) return;

        try {
            const res = await fetch(`/api/admin/users/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.ok) {
                setUsers((prev) => prev.filter((u) => u.id !== id));
            } else {
                const data = await res.json();
                alert("Failed to delete user: " + (data.error || "Unknown error"));
            }
        } catch (err) {
            console.error("Failed to delete user", err);
            alert("Failed to delete user");
        }
    };

    if (loading) return <div className="p-10 text-center">Loading...</div>;

    if (!isAdmin) return null;

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

            <div className="flex gap-4 mb-6 border-b border-white/10">
                <button
                    onClick={() => setActiveTab("posts")}
                    className={`px-4 py-2 border-b-2 transition-colors ${activeTab === "posts"
                        ? "border-primary text-primary"
                        : "border-transparent text-neutral-400 hover:text-white"
                        }`}
                >
                    Posts
                </button>
                <button
                    onClick={() => setActiveTab("users")}
                    className={`px-4 py-2 border-b-2 transition-colors ${activeTab === "users"
                        ? "border-primary text-primary"
                        : "border-transparent text-neutral-400 hover:text-white"
                        }`}
                >
                    Users
                </button>
            </div>

            {activeTab === "posts" ? (
                <div className="bg-white/5 rounded-lg border border-white/10 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-white/5 text-neutral-400">
                            <tr>
                                <th className="p-4">Title</th>
                                <th className="p-4">Author</th>
                                <th className="p-4">Date</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {posts.map((post) => (
                                <tr key={post.id} className="hover:bg-white/5 transition">
                                    <td className="p-4">
                                        <div className="font-medium text-white">{post.title}</div>
                                        <div className="text-sm text-neutral-500 truncate max-w-md">
                                            {post.id}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            {post.author_avatar_url && (
                                                <img
                                                    src={post.author_avatar_url}
                                                    alt=""
                                                    className="w-6 h-6 rounded-full"
                                                />
                                            )}
                                            <span>{post.author_name || post.author_email}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-neutral-400 text-sm">
                                        {formatDistanceToNow(new Date(post.created_at), {
                                            addSuffix: true,
                                        })}
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Link
                                                href={`/forum/${post.id}`}
                                                className="p-2 text-neutral-400 hover:text-white bg-white/5 rounded"
                                                title="View"
                                            >
                                                <FaEye />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(post.id)}
                                                className="p-2 text-neutral-400 hover:text-red-500 bg-white/5 rounded"
                                                title="Delete"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="bg-white/5 rounded-lg border border-white/10 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-white/5 text-neutral-400">
                            <tr>
                                <th className="p-4">Name</th>
                                <th className="p-4">Email</th>
                                <th className="p-4">Provider</th>
                                <th className="p-4">Last Sign In</th>
                                <th className="p-4">Created At</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {users.map((u) => (
                                <tr key={u.id} className="hover:bg-white/5 transition">
                                    <td className="p-4">
                                        <div className="font-medium text-white">
                                            {u.user_metadata?.name ||
                                                u.user_metadata?.full_name ||
                                                "N/A"}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="text-neutral-300">{u.email}</div>
                                        <div className="text-sm text-neutral-500 text-xs">{u.id}</div>
                                    </td>
                                    <td className="p-4 text-neutral-300">
                                        {u.app_metadata?.provider || "email"}
                                    </td>
                                    <td className="p-4 text-neutral-400 text-sm">
                                        {u.last_sign_in_at
                                            ? formatDistanceToNow(new Date(u.last_sign_in_at), {
                                                addSuffix: true,
                                            })
                                            : "Never"}
                                    </td>
                                    <td className="p-4 text-neutral-400 text-sm">
                                        {formatDistanceToNow(new Date(u.created_at), {
                                            addSuffix: true,
                                        })}
                                    </td>
                                    <td className="p-4 text-right">
                                        <button
                                            onClick={() => handleDeleteUser(u.id)}
                                            className="p-2 text-neutral-400 hover:text-red-500 bg-white/5 rounded"
                                            title="Delete User"
                                        >
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
