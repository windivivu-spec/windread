import { NextRequest, NextResponse } from "next/server";
import { createBooking, getBookings } from "../../booking/supabaseServer";
import type { BookingDraft } from "../../booking/types";

export async function GET() {
  try {
    return NextResponse.json(await getBookings());
  } catch {
    return NextResponse.json({ message: "Không tải được danh sách booking." }, { status: 500 });
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
