import { NextRequest, NextResponse } from "next/server";
import { adminErrorResponse, assertBranchAccess, assertRole, requireAdminContext } from "../../../../lib/admin/auth";
import { hcmDate } from "../../../../lib/admin/dates";
import { asMoney, asText, asUuid, bodyJson } from "../../../../lib/admin/validation";
import { createServiceClient } from "../../../../lib/supabase/service";

const methods = ["cash", "bank_transfer", "card", "debt", "other"] as const;
const directions = ["in", "out"] as const;

export async function GET(request: NextRequest) {
  try {
    const context = await requireAdminContext();
    assertRole(context, ["admin", "manager", "cashier"]);
    const branchId = request.nextUrl.searchParams.get("branchId");
    if (!branchId) throw new Error("Chọn chi nhánh để xem sổ quỹ.");
    assertBranchAccess(context, branchId);
    const date = request.nextUrl.searchParams.get("date") || hcmDate();
    const service = createServiceClient();
    const [sessionResult, ledgerResult] = await Promise.all([
      service.from("cash_sessions").select("*").eq("branch_id", branchId).eq("business_date", date).maybeSingle(),
      service.from("ledger_entries").select("id,category,direction,method,amount,note,occurred_at,invoices(invoice_number),staff_profiles(display_name)").eq("branch_id", branchId).gte("occurred_at", `${date}T00:00:00+07:00`).lt("occurred_at", `${date}T23:59:59.999+07:00`).order("occurred_at", { ascending: false })
    ]);
    if (sessionResult.error || ledgerResult.error) throw sessionResult.error ?? ledgerResult.error;
    const totals = (ledgerResult.data ?? []).reduce<Record<string, number>>((accumulator, row) => {
      const key = `${row.direction}:${row.method}`;
      accumulator[key] = (accumulator[key] ?? 0) + (row.direction === "in" ? Number(row.amount) : -Number(row.amount));
      return accumulator;
    }, {});
    return NextResponse.json({ date, cashSession: sessionResult.data, entries: ledgerResult.data ?? [], totals });
  } catch (error) {
    return adminErrorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const context = await requireAdminContext();
    assertRole(context, ["admin", "manager", "cashier"]);
    const body = await bodyJson(request);
    const action = asText(body.action, "Thao tác", { max: 30 });
    const branchId = asText(body.branchId, "Chi nhánh", { max: 80 });
    assertBranchAccess(context, branchId);
    const service = createServiceClient();

    if (action === "open") {
      const openingBalance = asMoney(body.openingBalance, "Quỹ đầu ngày");
      const businessDate = typeof body.businessDate === "string" ? body.businessDate : hcmDate();
      const { data, error } = await service
        .from("cash_sessions")
        .insert({ branch_id: branchId, business_date: businessDate, opening_balance: openingBalance, opened_by: context.id })
        .select()
        .single();
      if (error) throw error;
      return NextResponse.json({ cashSession: data }, { status: 201 });
    }

    if (action === "close") {
      const sessionId = asUuid(body.sessionId, "Phiên quỹ");
      const countedBalance = asMoney(body.countedBalance, "Tiền thực đếm");
      const note = typeof body.note === "string" ? body.note : "";
      const { data, error } = await service.rpc("close_windread_cash_session", { p_session_id: sessionId, p_counted_balance: countedBalance, p_note: note, p_actor_id: context.id });
      if (error) throw error;
      return NextResponse.json({ cashSession: data });
    }

    if (action === "entry") {
      const direction = asText(body.direction, "Loại phiếu", { max: 10 });
      const method = asText(body.method, "Phương thức", { max: 30 });
      if (!directions.includes(direction as (typeof directions)[number]) || !methods.includes(method as (typeof methods)[number])) throw new Error("Loại phiếu hoặc phương thức không hợp lệ.");
      const { data, error } = await service
        .from("ledger_entries")
        .insert({
          branch_id: branchId,
          category: asText(body.category, "Danh mục", { max: 100 }),
          direction,
          method,
          amount: asMoney(body.amount, "Số tiền", { min: 1 }),
          note: typeof body.note === "string" ? body.note.trim() || null : null,
          created_by: context.id
        })
        .select()
        .single();
      if (error) throw error;
      return NextResponse.json({ entry: data }, { status: 201 });
    }

    throw new Error("Thao tác sổ quỹ không được hỗ trợ.");
  } catch (error) {
    return adminErrorResponse(error);
  }
}
