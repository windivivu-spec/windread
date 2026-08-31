import { NextRequest, NextResponse } from "next/server";
import { adminErrorResponse, allowedBranches, assertRole, requireAdminContext } from "../../../../lib/admin/auth";
import { asText, bodyJson } from "../../../../lib/admin/validation";
import { createServiceClient } from "../../../../lib/supabase/service";
import { authEmailForLoginId, normalizeLoginId } from "../../../../lib/admin/login";

const roles = ["admin", "manager", "cashier", "employee"] as const;

export async function GET() {
  try {
    const context = await requireAdminContext();
    assertRole(context, ["admin"]);
    const service = createServiceClient();
    const [profileResult, barberResult, branchResult] = await Promise.all([
      service.from("staff_profiles").select("id,login_id,barber_id,display_name,role,is_active,staff_branch_access(branch_id)").order("display_name"),
      service.from("barbers").select("id,name,branch_id,title").order("name"),
      allowedBranches(context)
    ]);
    if (profileResult.error || barberResult.error) throw profileResult.error ?? barberResult.error;
    return NextResponse.json({ profiles: profileResult.data ?? [], barbers: barberResult.data ?? [], branches: branchResult });
  } catch (error) {
    return adminErrorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const context = await requireAdminContext();
    assertRole(context, ["admin"]);
    const body = await bodyJson(request);
    const action = asText(body.action, "Thao tác", { max: 30 });
    const service = createServiceClient();
    if (action === "create") {
      const loginId = normalizeLoginId(body.loginId);
      const password = asText(body.password, "Mật khẩu", { max: 200 });
      if (password.length < 12) throw new Error("Mật khẩu cần tối thiểu 12 ký tự.");
      const role = asText(body.role, "Vai trò", { max: 20 });
      if (!roles.includes(role as (typeof roles)[number])) throw new Error("Vai trò không hợp lệ.");
      const branchIds = Array.isArray(body.branchIds) ? body.branchIds.filter((item): item is string => typeof item === "string") : [];
      const barberId = typeof body.barberId === "string" && body.barberId ? body.barberId : null;
      const displayName = asText(body.displayName, "Họ tên", { max: 120 });
      const { data: created, error: createError } = await service.auth.admin.createUser({ email: authEmailForLoginId(loginId), password, email_confirm: true, user_metadata: { display_name: displayName } });
      if (createError || !created.user) throw createError ?? new Error("Không thể tạo tài khoản.");
      const { error: profileError } = await service.from("staff_profiles").upsert({ id: created.user.id, login_id: loginId, display_name: displayName, role, barber_id: barberId }, { onConflict: "id" });
      if (profileError) throw profileError;
      const { error: deleteAccessError } = await service.from("staff_branch_access").delete().eq("staff_id", created.user.id);
      if (deleteAccessError) throw deleteAccessError;
      if (role !== "admin" && branchIds.length) {
        const { error: accessError } = await service.from("staff_branch_access").insert(branchIds.map((branchId) => ({ staff_id: created.user!.id, branch_id: branchId })));
        if (accessError) throw accessError;
      }
      return NextResponse.json({ created: true });
    }
    throw new Error("Thao tác nhân sự không được hỗ trợ.");
  } catch (error) {
    return adminErrorResponse(error);
  }
}
