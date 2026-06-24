import { NextRequest, NextResponse } from "next/server";
import { getAdminSupabase } from "@/lib/supabase";

// Site settings are a single row (id = 1) — GET returns it, PUT updates it.
// No POST/DELETE: there's only ever one settings row.

export async function GET() {
  const supabase = getAdminSupabase();
  const { data, error } = await supabase.from("site_settings").select("*").eq("id", 1).single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ settings: data });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const supabase = getAdminSupabase();
  const { data, error } = await supabase
    .from("site_settings")
    .update({ ...body, updated_at: new Date().toISOString() })
    .eq("id", 1)
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ settings: data });
}
