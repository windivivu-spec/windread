import { NextResponse } from "next/server";
import { getBranches } from "../../booking/supabaseServer";

export async function GET() {
  try {
    return NextResponse.json(await getBranches());
  } catch {
    return NextResponse.json({ message: "Không tải được danh sách cơ sở." }, { status: 500 });
  }
}
