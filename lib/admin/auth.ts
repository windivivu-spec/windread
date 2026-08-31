import { NextResponse } from "next/server";
import { createClient as createRequestClient } from "../supabase/server";
import { createServiceClient } from "../supabase/service";

export const adminRoles = ["admin", "manager", "cashier", "employee"] as const;
export type AdminRole = (typeof adminRoles)[number];

export type AdminContext = {
  id: string;
  displayName: string;
  role: AdminRole;
  barberId: string | null;
  branchIds: string[];
};

export class AdminAccessError extends Error {
  constructor(
    message: string,
    public status = 403
  ) {
    super(message);
  }
}

function branchIdsFromProfile(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!item || typeof item !== "object" || !("branch_id" in item)) return [];
    const branchId = (item as { branch_id?: unknown }).branch_id;
    return typeof branchId === "string" ? [branchId] : [];
  });
}

export async function getAdminContext(): Promise<AdminContext | null> {
  const supabase = await createRequestClient();
  const { data: claimData, error: claimError } = await supabase.auth.getClaims();
  const userId = claimData?.claims?.sub;
  if (claimError || typeof userId !== "string") return null;

  const { data, error } = await supabase
    .from("staff_profiles")
    .select("id, display_name, role, barber_id, is_active, staff_branch_access(branch_id)")
    .eq("id", userId)
    .maybeSingle();

  if (error || !data || !data.is_active || !adminRoles.includes(data.role as AdminRole)) return null;
  return {
    id: data.id,
    displayName: data.display_name,
    role: data.role as AdminRole,
    barberId: data.barber_id,
    branchIds: branchIdsFromProfile(data.staff_branch_access)
  };
}

export async function requireAdminContext() {
  const context = await getAdminContext();
  if (!context) throw new AdminAccessError("Tài khoản chưa được cấp quyền vào Admin.", 401);
  return context;
}

export function assertRole(context: AdminContext, roles: readonly AdminRole[]) {
  if (!roles.includes(context.role)) {
    throw new AdminAccessError("Bạn không có quyền thực hiện thao tác này.");
  }
}

export function assertBranchAccess(context: AdminContext, branchId: string) {
  if (context.role !== "admin" && !context.branchIds.includes(branchId)) {
    throw new AdminAccessError("Bạn không có quyền trên chi nhánh này.");
  }
}

export async function allowedBranches(context: AdminContext) {
  const service = createServiceClient();
  let query = service.from("branches").select("id,name,address,phone").order("name");
  if (context.role !== "admin") query = query.in("id", context.branchIds);
  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export function adminErrorResponse(error: unknown) {
  if (error instanceof AdminAccessError) {
    return NextResponse.json({ message: error.message }, { status: error.status });
  }
  console.error("Admin API error:", error);
  return NextResponse.json({ message: "Không thể hoàn tất thao tác. Vui lòng thử lại." }, { status: 500 });
}
