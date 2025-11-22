import { NextResponse } from "next/server";

export async function GET() {
  try {
    const serviceKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;
    return NextResponse.json({ enabled: !!serviceKey });
  } catch (err: any) {
    return NextResponse.json(
      { enabled: false, error: err?.message || String(err) },
      { status: 500 },
    );
  }
}
