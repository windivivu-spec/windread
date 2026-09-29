import { NextResponse } from "next/server";
import { adminErrorResponse, assertRole, requireAdminContext } from "../../../../lib/admin/auth";
import { createServiceClient } from "../../../../lib/supabase/service";

export async function GET() {
  try {
    const context = await requireAdminContext();
    assertRole(context, ["admin", "manager", "cashier", "employee"]);
    const service = createServiceClient();
    let query = service.from("barbers").select("id,branch_id,name").order("name");
    if (context.role === "employee") query = query.eq("id", context.barberId ?? "");
    else if (context.role !== "admin") query = query.in("branch_id", context.branchIds);
    const { data, error } = await query;
    if (error) throw error;
    return NextResponse.json(data ?? []);
  } catch (error) {
    return adminErrorResponse(error);
  }
}
