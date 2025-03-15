import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("get_url_by_id", {
      link_id: id,
    });
    if (error) {
      throw error;
    }
    return NextResponse.redirect(data);
  } catch (err) {
    console.error(err);
    return new NextResponse("Something went wrong!", { status: 500 });
  }
}
