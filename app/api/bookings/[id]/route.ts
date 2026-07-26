import { NextRequest, NextResponse } from "next/server";
import { getBooking, updateBookingStatus } from "../../../booking/supabaseServer";
import type { BookingStatus } from "../../../booking/types";

const statuses: BookingStatus[] = ["pending", "confirmed", "cancelled", "completed"];

export async function GET(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const booking = await getBooking(id);
  if (!booking) return NextResponse.json({ message: "Không tìm thấy booking." }, { status: 404 });
  return NextResponse.json(booking);
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const body = (await request.json()) as { status?: BookingStatus };
  if (!body.status || !statuses.includes(body.status)) {
    return NextResponse.json({ message: "Trạng thái booking không hợp lệ." }, { status: 400 });
  }

  try {
    return NextResponse.json(await updateBookingStatus(id, body.status));
  } catch {
    return NextResponse.json({ message: "Không cập nhật được booking." }, { status: 500 });
  }
}
