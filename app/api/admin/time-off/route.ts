import { NextRequest, NextResponse } from "next/server";
import { adminErrorResponse, assertBranchAccess, assertRole, requireAdminContext } from "../../../../lib/admin/auth";
import { createServiceClient } from "../../../../lib/supabase/service";

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

function validDate(value: unknown): value is string {
  if (typeof value !== "string" || !DATE_PATTERN.test(value)) return false;
  const date = new Date(`${value}T00:00:00+07:00`);
  return Number.isFinite(date.getTime()) && new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Ho_Chi_Minh", year: "numeric", month: "2-digit", day: "2-digit"
  }).format(date) === value;
}

function parsePeriod(body: Record<string, unknown>) {
  const dateFrom = body.dateFrom;
  const dateTo = body.dateTo;
  const allDay = body.allDay === true;
  const note = typeof body.note === "string" ? body.note.trim() : "";
  if (!validDate(dateFrom) || !validDate(dateTo) || dateTo < dateFrom || note.length > 160) return null;
  const days = (Date.parse(`${dateTo}T00:00:00+07:00`) - Date.parse(`${dateFrom}T00:00:00+07:00`)) / 86_400_000;
  if (days > 30) return null;
  if (!allDay && (dateFrom !== dateTo || typeof body.startHour !== "string" || typeof body.endHour !== "string" || !TIME_PATTERN.test(body.startHour) || !TIME_PATTERN.test(body.endHour) || body.endHour <= body.startHour)) return null;
  const start = new Date(`${dateFrom}T${allDay ? "00:00" : body.startHour}:00+07:00`);
  const end = allDay
    ? new Date(Date.parse(`${dateTo}T00:00:00+07:00`) + 86_400_000)
    : new Date(`${dateTo}T${body.endHour}:00+07:00`);
  if (end <= new Date() || end <= start) return null;
  return { start_time: start.toISOString(), end_time: end.toISOString(), all_day: allDay, note };
}

async function findConflictingBookings(barberId: string, start: string, end: string) {
  const service = createServiceClient();
  const { data, error } = await service.from("bookings")
    .select("id,start_time,end_time,customer_name")
    .eq("barber_id", barberId)
    .neq("status", "cancelled")
    .gt("end_time", new Date().toISOString())
    .lt("start_time", end)
    .gt("end_time", start)
    .order("start_time");
  if (error) throw error;
  return data ?? [];
}

async function authorizedBarber(barberId: string, context: Awaited<ReturnType<typeof requireAdminContext>>) {
  const service = createServiceClient();
  const { data, error } = await service.from("barbers").select("id,branch_id").eq("id", barberId).maybeSingle();
  if (error) throw error;
  if (!data) return null;
  assertBranchAccess(context, data.branch_id);
  return data;
}

export async function GET() {
  try {
    const context = await requireAdminContext();
    assertRole(context, ["admin", "manager", "cashier", "employee"]);
    const service = createServiceClient();
    const { data: barbers, error: barberError } = await service.from("barbers").select("id,branch_id");
    if (barberError) throw barberError;
    const allowedIds = (barbers ?? []).filter((barber) =>
      (context.role === "admin" || context.branchIds.includes(barber.branch_id)) &&
      (context.role !== "employee" || context.barberId === barber.id)
    ).map((barber) => barber.id);
    if (!allowedIds.length) return NextResponse.json([]);
    const { data, error } = await service.from("barber_time_off")
      .select("id,barber_id,start_time,end_time,all_day,note,created_at")
      .in("barber_id", allowedIds).order("start_time", { ascending: true });
    if (error) throw error;
    return NextResponse.json(data ?? []);
  } catch (error) {
    return adminErrorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const context = await requireAdminContext();
    assertRole(context, ["admin", "manager"]);
    const body = await request.json() as Record<string, unknown>;
    const barberId = typeof body.barberId === "string" ? body.barberId : "";
    const period = parsePeriod(body);
    if (!barberId || !period) return NextResponse.json({ message: "Chọn thợ và khoảng nghỉ hợp lệ (tối đa 31 ngày)." }, { status: 400 });
    if (!await authorizedBarber(barberId, context)) return NextResponse.json({ message: "Không tìm thấy thợ." }, { status: 404 });
    const conflicts = await findConflictingBookings(barberId, period.start_time, period.end_time);
    if (conflicts.length) return NextResponse.json({ message: "Thợ đã có lịch khách trong khoảng nghỉ. Hãy xử lý các lịch này trước.", conflicts }, { status: 409 });
    const service = createServiceClient();
    const { data, error } = await service.from("barber_time_off").insert({ barber_id: barberId, ...period, created_by: context.id }).select().single();
    if (error) {
      if (error.code === "23505") return NextResponse.json({ message: "Khoảng nghỉ trùng lịch khách hoặc ngày nghỉ đã có. Tải lại lịch để kiểm tra." }, { status: 409 });
      throw error;
    }
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return adminErrorResponse(error);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const context = await requireAdminContext();
    assertRole(context, ["admin", "manager"]);
    const body = await request.json() as Record<string, unknown>;
    const id = typeof body.id === "string" ? body.id : "";
    const barberId = typeof body.barberId === "string" ? body.barberId : "";
    const period = parsePeriod(body);
    if (!id || !barberId || !period) return NextResponse.json({ message: "Thông tin ngày nghỉ không hợp lệ." }, { status: 400 });
    const service = createServiceClient();
    const { data: existing, error: lookupError } = await service.from("barber_time_off").select("id,barber_id").eq("id", id).maybeSingle();
    if (lookupError) throw lookupError;
    if (!existing) return NextResponse.json({ message: "Ngày nghỉ không còn tồn tại." }, { status: 404 });
    if (!await authorizedBarber(existing.barber_id, context) || !await authorizedBarber(barberId, context)) return NextResponse.json({ message: "Không tìm thấy thợ." }, { status: 404 });
    const conflicts = await findConflictingBookings(barberId, period.start_time, period.end_time);
    if (conflicts.length) return NextResponse.json({ message: "Thợ đã có lịch khách trong khoảng nghỉ. Hãy xử lý các lịch này trước.", conflicts }, { status: 409 });
    const { data, error } = await service.from("barber_time_off").update({ barber_id: barberId, ...period }).eq("id", id).select().single();
    if (error) {
      if (error.code === "23505") return NextResponse.json({ message: "Khoảng nghỉ trùng lịch khách hoặc ngày nghỉ đã có. Tải lại lịch để kiểm tra." }, { status: 409 });
      throw error;
    }
    return NextResponse.json(data);
  } catch (error) {
    return adminErrorResponse(error);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const context = await requireAdminContext();
    assertRole(context, ["admin", "manager"]);
    const id = request.nextUrl.searchParams.get("id") ?? "";
    if (!id) return NextResponse.json({ message: "Thiếu ngày nghỉ cần gỡ." }, { status: 400 });
    const service = createServiceClient();
    const { data: existing, error: lookupError } = await service.from("barber_time_off").select("id,barber_id").eq("id", id).maybeSingle();
    if (lookupError) throw lookupError;
    if (!existing) return NextResponse.json({ message: "Ngày nghỉ không còn tồn tại." }, { status: 404 });
    if (!await authorizedBarber(existing.barber_id, context)) return NextResponse.json({ message: "Không tìm thấy thợ." }, { status: 404 });
    const { error } = await service.from("barber_time_off").delete().eq("id", id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (error) {
    return adminErrorResponse(error);
  }
}
