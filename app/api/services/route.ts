import { NextResponse } from "next/server";
import { getServices } from "../../booking/supabaseServer";

export async function GET() {
  try {
    return NextResponse.json(await getServices());
  } catch {
    return NextResponse.json({ message: "Không tải được danh sách dịch vụ." }, { status: 500 });
  }
}
