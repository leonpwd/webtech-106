import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function DELETE(
    req: Request,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        const authHeader = req.headers.get("authorization");
        if (!authHeader) {
            return NextResponse.json(
                { error: "Missing Authorization header" },
                { status: 401 }
            );
        }

        const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const serviceKey =
            process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;

        if (!url || !serviceKey) {
            return NextResponse.json(
                { error: "Service role key not configured" },
                { status: 500 }
            );
        }

        // Verify the requester is the admin
        const supabaseAdmin = createClient(url, serviceKey);

        // Get the user from the token sent in the header
        const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(
            authHeader.replace("Bearer ", "")
        );

        if (authError || !user) {
            return NextResponse.json(
                { error: "Invalid token" },
                { status: 401 }
            );
        }

        if (user.email !== "leon.dalle@proton.me") {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 403 }
            );
        }

        const userId = params.id;
        if (!userId) {
            return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
        }

        // Prevent deleting self
        if (userId === user.id) {
            return NextResponse.json({ error: "Cannot delete your own admin account" }, { status: 400 });
        }

        // Delete the user
        const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);

        if (deleteError) {
            return NextResponse.json(
                { error: deleteError.message },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json(
            { error: err?.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
