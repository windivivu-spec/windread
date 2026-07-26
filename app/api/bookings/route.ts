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

  const result = await createBooking(draft);
  if (!result.booking) return NextResponse.json(result, { status: 409 });
  return NextResponse.json(result, { status: 201 });
}
