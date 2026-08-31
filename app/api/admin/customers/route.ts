import { NextRequest, NextResponse } from "next/server";
import { adminErrorResponse, assertRole, requireAdminContext } from "../../../../lib/admin/auth";
import { asText, bodyJson } from "../../../../lib/admin/validation";
import { createServiceClient } from "../../../../lib/supabase/service";

function normalizedPhone(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.length < 9 || digits.length > 12) throw new Error("Số điện thoại không hợp lệ.");
  return digits;
}

export async function GET(request: NextRequest) {
  try {
    const context = await requireAdminContext();
    assertRole(context, ["admin", "manager", "cashier"]);
    const search = request.nextUrl.searchParams.get("q")?.trim() ?? "";
    const service = createServiceClient();
    let query = service
      .from("customers")
      .select("id,name,phone,email,note,source,created_at,bookings(id,start_time,status,branch_id),invoices(id,total_amount,status,completed_at,branch_id)")
      .order("updated_at", { ascending: false })
      .limit(100);
    if (search) query = query.or(`name.ilike.%${search.replace(/[%_(),]/g, "") }%,phone.ilike.%${search.replace(/[%_(),]/g, "") }%`);
    const { data, error } = await query;
    if (error) throw error;
    return NextResponse.json({ customers: data ?? [] });
  } catch (error) {
    return adminErrorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const context = await requireAdminContext();
    assertRole(context, ["admin", "manager", "cashier"]);
    const body = await bodyJson(request);
    const name = asText(body.name, "Tên khách hàng", { max: 120 });
    const phone = normalizedPhone(asText(body.phone, "Số điện thoại", { max: 32 }));
    const email = typeof body.email === "string" && body.email.trim() ? body.email.trim() : null;
    const note = typeof body.note === "string" && body.note.trim() ? body.note.trim() : null;
    const service = createServiceClient();
    const { data, error } = await service
      .from("customers")
      .upsert({ phone, name, email, note, source: "Admin" }, { onConflict: "phone" })
      .select("id,name,phone,email,note,source,created_at")
      .single();
    if (error) throw error;
    return NextResponse.json({ customer: data }, { status: 201 });
  } catch (error) {
    return adminErrorResponse(error);
  }
}
