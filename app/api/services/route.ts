import { NextRequest, NextResponse } from "next/server";
import { getPricingServices, getServices } from "../../booking/supabaseServer";

export async function GET(request: NextRequest) {
  try {
    const branchId = request.nextUrl.searchParams.get("branchId") ?? undefined;
    const audience = request.nextUrl.searchParams.get("audience");
    return NextResponse.json(await (audience === "pricing" ? getPricingServices(branchId) : getServices(branchId)));
  } catch {
    return NextResponse.json({ message: "Không tải được danh sách dịch vụ." }, { status: 500 });
  }
}
