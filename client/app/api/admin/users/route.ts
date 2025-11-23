import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(req: Request) {
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

        // Fetch all users
        const { data: users, error: listError } = await supabaseAdmin.auth.admin.listUsers();

        if (listError) {
            return NextResponse.json(
                { error: listError.message },
                { status: 500 }
            );
        }

        return NextResponse.json({ users: users.users });
    } catch (err: any) {
        return NextResponse.json(
            { error: err?.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
