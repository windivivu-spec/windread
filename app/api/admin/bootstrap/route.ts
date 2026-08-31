import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { asText, bodyJson } from "../../../../lib/admin/validation";
import { createServiceClient } from "../../../../lib/supabase/service";
import { authEmailForLoginId, normalizeLoginId } from "../../../../lib/admin/login";

function matchesSetupToken(value: string) {
  const expected = process.env.WINDREAD_ADMIN_SETUP_TOKEN;
  if (!expected) return false;
  const actualBuffer = Buffer.from(value);
  const expectedBuffer = Buffer.from(expected);
  return actualBuffer.length === expectedBuffer.length && timingSafeEqual(actualBuffer, expectedBuffer);
}

export async function POST(request: NextRequest) {
  try {
    const body = await bodyJson(request);
    const token = asText(body.setupToken, "Mã thiết lập", { max: 300 });
    if (!matchesSetupToken(token)) return NextResponse.json({ message: "Mã thiết lập không đúng hoặc chưa được cấu hình." }, { status: 403 });
    const loginId = normalizeLoginId(body.loginId);
    const email = authEmailForLoginId(loginId);
    const password = asText(body.password, "Mật khẩu", { max: 200 });
    if (password.length < 12) return NextResponse.json({ message: "Mật khẩu cần tối thiểu 12 ký tự." }, { status: 400 });
    const displayName = asText(body.displayName, "Họ tên", { max: 120 });
    const service = createServiceClient();
    const { count, error: countError } = await service.from("staff_profiles").select("id", { count: "exact", head: true }).eq("role", "admin");
    if (countError) throw countError;
    if ((count ?? 0) > 0) return NextResponse.json({ message: "Admin đầu tiên đã tồn tại. Hãy đăng nhập hoặc để Admin mời tài khoản mới." }, { status: 409 });
    const { data: userData, error: userError } = await service.auth.admin.createUser({ email, password, email_confirm: true, user_metadata: { display_name: displayName } });
    let user = userData.user;
    if (userError || !user) {
      // If an earlier setup attempt created the Auth account but stopped before the profile,
      // complete that same setup safely instead of leaving the owner locked out.
      const { data: users, error: listError } = await service.auth.admin.listUsers({ page: 1, perPage: 1000 });
      if (listError) throw userError ?? listError;
      user = users.users.find((candidate) => candidate.email?.toLowerCase() === email) ?? null;
      if (!user) throw userError ?? new Error("Không thể tạo tài khoản Admin.");
      const { error: updateError } = await service.auth.admin.updateUserById(user.id, { password, email_confirm: true, user_metadata: { display_name: displayName } });
      if (updateError) throw updateError;
    }
    const { error: profileError } = await service.from("staff_profiles").upsert({ id: user.id, login_id: loginId, display_name: displayName, role: "admin", is_active: true }, { onConflict: "id" });
    if (profileError) throw profileError;
    const { data: branches, error: branchError } = await service.from("branches").select("id");
    if (branchError) throw branchError;
    if (branches?.length) {
      const { error: accessError } = await service.from("staff_branch_access").upsert(branches.map((branch) => ({ staff_id: user.id, branch_id: branch.id })), { onConflict: "staff_id,branch_id" });
      if (accessError) throw accessError;
    }
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("Admin bootstrap error:", error);
    return NextResponse.json({ message: error instanceof Error ? error.message : "Không thể thiết lập Admin." }, { status: 500 });
  }
}
