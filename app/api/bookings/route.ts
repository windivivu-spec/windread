import { NextRequest, NextResponse } from "next/server";
import { createBooking, getBookings } from "../../booking/supabaseServer";
import type { BookingDraft } from "../../booking/types";
import { adminErrorResponse, assertRole, requireAdminContext } from "../../../lib/admin/auth";

export async function GET() {
  try {
    const context = await requireAdminContext();
    assertRole(context, ["admin", "manager", "cashier", "employee"]);
    const bookings = await getBookings();
    const scoped = bookings.filter((booking) => {
      if (context.role === "admin") return true;
      if (!context.branchIds.includes(booking.branchId)) return false;
      return context.role !== "employee" || booking.barberId === context.barberId;
    });
    return NextResponse.json(scoped);
  } catch (error) {
    return adminErrorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  let draft: BookingDraft;

  try {
    draft = (await request.json()) as BookingDraft;
  } catch {
    return NextResponse.json({ message: "Payload đặt lịch không hợp lệ." }, { status: 400 });
  }

  try {
    const result = await createBooking(draft);
    if (!result.booking) return NextResponse.json(result, { status: 409 });
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    // Keep the provider response in server logs for Vercel debugging, while
    // returning a safe JSON response that the client will not turn into a mock
    // confirmation.
    console.error("Booking persistence failed:", error);
    return NextResponse.json(
      {
        booking: null,
        errors: {},
        message: "Không thể lưu lịch trên hệ thống. Lịch chưa được tạo; vui lòng thử lại sau."
      },
      { status: 503 }
    );
  }
}
