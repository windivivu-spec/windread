import { NextRequest, NextResponse } from "next/server";
import { getServices } from "../../booking/supabaseServer";

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json(await getServices(request.nextUrl.searchParams.get("branchId") ?? undefined));
  } catch {
    return NextResponse.json({ message: "Không tải được danh sách dịch vụ." }, { status: 500 });
  }
}
