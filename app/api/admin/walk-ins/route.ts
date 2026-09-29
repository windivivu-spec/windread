import { NextRequest, NextResponse } from "next/server";
import { adminErrorResponse, assertBranchAccess, assertRole, requireAdminContext } from "../../../../lib/admin/auth";
import { bodyJson } from "../../../../lib/admin/validation";
import { createServiceClient } from "../../../../lib/supabase/service";

export async function POST(request: NextRequest) {
  try {
    const context = await requireAdminContext();
    assertRole(context, ["admin", "manager", "cashier", "employee"]);
    const body = await bodyJson(request);
    const barberId = typeof body.barberId === "string" ? body.barberId : "";
    const durationMinutes = Number(body.durationMinutes);
    const sourceBookingId = typeof body.sourceBookingId === "string" && body.sourceBookingId ? body.sourceBookingId : null;
    const phone = typeof body.customerPhone === "string" ? body.customerPhone.replace(/\D/g, "") : "";
    const name = typeof body.customerName === "string" ? body.customerName.trim() : "";
    if (!barberId || !Number.isInteger(durationMinutes) || durationMinutes < 15 || durationMinutes > 360 || durationMinutes % 15 !== 0) {
      return NextResponse.json({ message: "Chọn thợ và thời lượng theo nấc 15 phút, từ 15 phút đến 6 giờ." }, { status: 400 });
    }
    if (name.length > 120 || (phone && (phone.length < 9 || phone.length > 15))) {
      return NextResponse.json({ message: "Tên hoặc số điện thoại khách không hợp lệ." }, { status: 400 });
    }
    if (context.role === "employee" && context.barberId !== barberId) {
      return NextResponse.json({ message: "Nhân viên chỉ được khóa giờ của mình." }, { status: 403 });
    }
    const service = createServiceClient();
    const { data: barber, error: barberError } = await service.from("barbers").select("id,branch_id").eq("id", barberId).maybeSingle();
    if (barberError) throw barberError;
    if (!barber) return NextResponse.json({ message: "Không tìm thấy thợ đã chọn." }, { status: 400 });
    const branchId = barber.branch_id;
    assertBranchAccess(context, branchId);

    let source: { id: string; branch_id: string; barber_id: string; status: string; customer_name: string; customer_phone: string; customer_email: string | null } | null = null;
    if (sourceBookingId) {
      const result = await service.from("bookings").select("id,branch_id,barber_id,status,customer_name,customer_phone,customer_email").eq("id", sourceBookingId).maybeSingle();
      if (result.error) throw result.error;
      source = result.data;
      if (!source || source.status !== "cancelled" || source.branch_id !== branchId || source.barber_id !== barberId) {
        return NextResponse.json({ message: "Lịch cũ cần được hủy trước khi tạo lượt vãng lai cùng thợ." }, { status: 409 });
      }
    }

    const start = new Date();
    const end = new Date(start.getTime() + durationMinutes * 60_000);
    const { data, error } = await service.from("bookings").insert({
      id: `WI-${crypto.randomUUID()}`,
      branch_id: branchId,
      barber_id: barberId,
      service_id: null,
      booking_origin: "walk_in",
      source_booking_id: sourceBookingId,
      customer_name: source?.customer_name || name || "Khách vãng lai",
      customer_phone: source?.customer_phone || phone || "",
      customer_email: source?.customer_email || null,
      start_time: start.toISOString(),
      end_time: end.toISOString(),
      status: "confirmed",
      note: source ? `Khách tới sau lịch ${source.id} đã hủy` : "Khóa giờ khách vãng lai"
    }).select("id,start_time,end_time").single();
    if (error) {
      if (error.code === "23505") return NextResponse.json({ message: "Thợ đã có lịch trùng giờ hoặc lượt này đã được tạo. Tải lại lịch để kiểm tra." }, { status: 409 });
      throw error;
    }
    return NextResponse.json({ booking: data }, { status: 201 });
  } catch (error) {
    return adminErrorResponse(error);
  }
}
