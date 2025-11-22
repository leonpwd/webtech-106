import { NextResponse } from "next/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader)
      return NextResponse.json(
        { error: "Missing Authorization header" },
        { status: 401 },
      );

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;
    if (!url || !serviceKey) {
      return NextResponse.json(
        { error: "Service role key not configured" },
        { status: 500 },
      );
    }

    // Prefer the canonical anon key env var name but fall back to other names used in this repo
    const anonKey =
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_KEY ||
      "";

    // Verify the provided access token by calling Supabase auth endpoint. Some Supabase projects
    // require the public anon/publishable key to be sent as `apikey` alongside Authorization.
    const verify = await fetch(`${url}/auth/v1/user`, {
      headers: {
        Authorization: authHeader,
        ...(anonKey ? { apikey: anonKey } : {}),
      },
    });
    if (!verify.ok) {
      const body = await verify.json().catch(() => ({}));
      return NextResponse.json(
        { error: body?.message || "Invalid token" },
        { status: 401 },
      );
    }
    const user = await verify.json();
    const userId = user?.id;
    if (!userId)
      return NextResponse.json(
        { error: "Could not verify user" },
        { status: 401 },
      );

    const admin = createAdminClient(url, serviceKey);
    const res = await admin.auth.admin.deleteUser(userId);
    if (res.error) {
      return NextResponse.json({ error: res.error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || String(err) },
      { status: 500 },
    );
  }
}
