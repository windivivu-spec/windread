import { NextRequest, NextResponse } from "next/server";
import { getBarbers } from "../../booking/supabaseServer";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  try {
    return NextResponse.json(
      await getBarbers(searchParams.get("branchId") ?? undefined, searchParams.get("serviceId") ?? undefined)
    );
  } catch {
    return NextResponse.json({ message: "Không tải được danh sách thợ." }, { status: 500 });
  }
}
