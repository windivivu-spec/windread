import { NextRequest, NextResponse } from "next/server";
import { getSlots } from "../../booking/supabaseServer";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const branchId = searchParams.get("branchId") ?? "";
  const serviceId = searchParams.get("serviceId") ?? "";
  const barberId = searchParams.get("barberId") ?? "any";
  const date = searchParams.get("date") ?? "";

  if (!branchId || !serviceId || !date) {
    return NextResponse.json({ message: "Thiếu thông tin để tính slot." }, { status: 400 });
  }

  try {
    return NextResponse.json(await getSlots(branchId, serviceId, barberId, date));
  } catch {
    return NextResponse.json({ message: "Không tải được khung giờ trống." }, { status: 500 });
  }
}
