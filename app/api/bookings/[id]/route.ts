import { NextRequest, NextResponse } from "next/server";
import { getBooking } from "../../../booking/supabaseServer";
import type { BookingStatus } from "../../../booking/types";
import { adminErrorResponse, assertBranchAccess, assertRole, requireAdminContext } from "../../../../lib/admin/auth";
import { createServiceClient } from "../../../../lib/supabase/service";

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
    assertRole(admin, ["admin", "manager", "cashier", "employee"]);
    const { id } = await context.params;
    const booking = await getBooking(id);
    if (!booking) return NextResponse.json({ message: "Không tìm thấy booking." }, { status: 404 });
    assertBranchAccess(admin, booking.branchId);
    if (admin.role === "employee" && booking.barberId !== admin.barberId) {
      return NextResponse.json({ message: "Bạn chỉ được cập nhật lịch của mình." }, { status: 403 });
    }
    const body = (await request.json()) as { status?: BookingStatus; reason?: string };
    if (!body.status || !statuses.includes(body.status)) {
      return NextResponse.json({ message: "Trạng thái booking không hợp lệ." }, { status: 400 });
    }
    if (admin.role === "employee" && body.status !== "completed" && !(body.status === "cancelled" && body.reason === "late")) {
      return NextResponse.json({ message: "Nhân viên chỉ được hoàn tất lịch hoặc hủy lịch đến trễ của mình." }, { status: 403 });
    }
    if (body.status === "completed" && Date.now() < new Date(booking.startTime).getTime()) {
      return NextResponse.json({ message: "Chưa thể hoàn tất lịch trước giờ khách đến." }, { status: 400 });
    }
    if (booking.status === "completed" && body.status !== "completed" || booking.status === "cancelled" && body.status !== "cancelled") {
      return NextResponse.json({ message: "Lịch đã hoàn tất hoặc đã hủy không thể đổi trạng thái." }, { status: 409 });
    }
    if (body.reason === "late") {
      if (body.status !== "cancelled" || Date.now() < new Date(booking.startTime).getTime() + 15 * 60_000) {
        return NextResponse.json({ message: "Chỉ hủy do đến trễ sau giờ hẹn ít nhất 15 phút." }, { status: 400 });
      }
    }
    const service = createServiceClient();
    const { data, error } = await service.from("bookings")
      .update({ status: body.status, cancel_reason: body.status === "cancelled" ? body.reason === "late" ? "late" : "other" : null })
      .eq("id", id).eq("status", booking.status)
      .select("id");
    if (error) throw error;
    if (!data?.length) return NextResponse.json({ message: "Lịch vừa thay đổi. Vui lòng tải lại." }, { status: 409 });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return adminErrorResponse(error);
  }
}
