import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
    try {
        const authHeader = req.headers.get("authorization");
        if (!authHeader) {
            return NextResponse.json(
                { error: "Missing Authorization header" },
                { status: 401 }
            );
        }

        const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const anonKey =
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
            process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
            process.env.NEXT_PUBLIC_SUPABASE_KEY ||
            "";

        if (!url || !anonKey) {
            return NextResponse.json(
                { error: "Supabase configuration missing" },
                { status: 500 }
            );
        }

        // Create a Supabase client with the user's access token
        const supabase = createClient(url, anonKey, {
            global: {
                headers: {
                    Authorization: authHeader,
                },
            },
        });

        // Get the user to verify the token and get current metadata
        const {
            data: { user },
            error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
            return NextResponse.json(
                { error: "Invalid token or user not found" },
                { status: 401 }
            );
        }

        const name = user.user_metadata?.name;
        const icon = user.user_metadata?.icon;

        // Update posts
        const { error: postsError } = await supabase
            .from("posts")
            .update({
                author_name: name,
                author_avatar_url: icon,
            })
            .eq("author_id", user.id);

        if (postsError) {
            console.error("Error updating posts:", postsError);
            return NextResponse.json(
                { error: "Failed to update posts" },
                { status: 500 }
            );
        }

        // Update comments
        const { error: commentsError } = await supabase
            .from("comments")
            .update({
                author_name: name,
                author_avatar_url: icon,
            })
            .eq("author_id", user.id);

        if (commentsError) {
            console.error("Error updating comments:", commentsError);
            return NextResponse.json(
                { error: "Failed to update comments" },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Profile synced to posts and comments",
        });
    } catch (err: any) {
        console.error("Sync profile error:", err);
        return NextResponse.json(
            { error: err?.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
