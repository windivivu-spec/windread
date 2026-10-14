import { NextRequest, NextResponse } from "next/server";
import { getSlots } from "../../booking/supabaseServer";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const branchId = searchParams.get("branchId") ?? "";
  const serviceIds = (searchParams.get("serviceIds") ?? searchParams.get("serviceId") ?? "")
    .split(",")
    .map((serviceId) => serviceId.trim())
    .filter(Boolean);
  const barberId = searchParams.get("barberId") ?? "any";
  const date = searchParams.get("date") ?? "";

  if (!branchId || serviceIds.length === 0 || !date) {
    return NextResponse.json({ message: "Thiếu thông tin để tính slot." }, { status: 400 });
  }

  try {
    return NextResponse.json(await getSlots(branchId, serviceIds, barberId, date));
  } catch {
    return NextResponse.json({ message: "Không tải được khung giờ trống." }, { status: 500 });
  }
}
