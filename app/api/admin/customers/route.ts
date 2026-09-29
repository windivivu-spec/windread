import { NextRequest, NextResponse } from "next/server";
import { adminErrorResponse, assertRole, requireAdminContext } from "../../../../lib/admin/auth";
import { createServiceClient } from "../../../../lib/supabase/service";

export async function GET(request: NextRequest) {
  try {
    const context = await requireAdminContext();
    assertRole(context, ["admin"]);
    const search = request.nextUrl.searchParams.get("q")?.trim() ?? "";
    const service = createServiceClient();
    let query = service
      .from("customers")
      .select("id,name,phone,email,note,source,created_at,bookings(id,start_time,status,branch_id),invoices(id,total_amount,status,completed_at,branch_id)")
      .eq("source", "served")
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
