import { NextRequest, NextResponse } from "next/server";
import { getBooking, updateBookingStatus } from "../../../booking/supabaseServer";
import type { BookingStatus } from "../../../booking/types";
import { adminErrorResponse, assertBranchAccess, assertRole, requireAdminContext } from "../../../../lib/admin/auth";

const statuses: BookingStatus[] = ["pending", "confirmed", "cancelled", "completed"];

export async function GET(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const admin = await requireAdminContext();
    assertRole(admin, ["admin", "manager", "cashier", "employee"]);
    const { id } = await context.params;
    const booking = await getBooking(id);
    if (!booking) return NextResponse.json({ message: "Không tìm thấy booking." }, { status: 404 });
    assertBranchAccess(admin, booking.branchId);
    if (admin.role === "employee" && booking.barberId !== admin.barberId) return NextResponse.json({ message: "Bạn không có quyền xem lịch này." }, { status: 403 });
    return NextResponse.json(booking);
  } catch (error) {
    return adminErrorResponse(error);
  }
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const admin = await requireAdminContext();
    assertRole(admin, ["admin", "manager", "cashier"]);
    const { id } = await context.params;
    const booking = await getBooking(id);
    if (!booking) return NextResponse.json({ message: "Không tìm thấy booking." }, { status: 404 });
    assertBranchAccess(admin, booking.branchId);
    const body = (await request.json()) as { status?: BookingStatus };
    if (!body.status || !statuses.includes(body.status)) {
      return NextResponse.json({ message: "Trạng thái booking không hợp lệ." }, { status: 400 });
    }
    return NextResponse.json(await updateBookingStatus(id, body.status));
  } catch (error) {
    return adminErrorResponse(error);
  }
}
