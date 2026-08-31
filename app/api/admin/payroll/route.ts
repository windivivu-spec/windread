import { NextRequest, NextResponse } from "next/server";
import { adminErrorResponse, assertBranchAccess, assertRole, requireAdminContext } from "../../../../lib/admin/auth";
import { monthRange } from "../../../../lib/admin/dates";
import { asMoney, asText, asUuid, bodyJson } from "../../../../lib/admin/validation";
import { createServiceClient } from "../../../../lib/supabase/service";

type Adjustment = { barber_id: string; kind: "bonus" | "penalty" | "advance" | "leave"; amount: number };

export async function GET(request: NextRequest) {
  try {
    const context = await requireAdminContext();
    const branchId = request.nextUrl.searchParams.get("branchId");
    if (!branchId) throw new Error("Chọn chi nhánh để xem lương.");
    assertBranchAccess(context, branchId);
    const month = request.nextUrl.searchParams.get("month") || undefined;
    const range = monthRange(month);
    const service = createServiceClient();
    let barbersQuery = service
      .from("barbers")
      .select("id,name,branch_id,barber_compensation(default_commission_rate,base_salary)")
      .eq("branch_id", branchId)
      .order("name");
    if (context.role === "employee") {
      if (!context.barberId) throw new Error("Tài khoản nhân viên chưa được liên kết với hồ sơ thợ.");
      barbersQuery = barbersQuery.eq("id", context.barberId);
    } else {
      assertRole(context, ["admin", "manager"]);
    }
    const [barberResult, invoiceResult, adjustmentResult, periodResult] = await Promise.all([
      barbersQuery,
      service.from("invoices").select("id").eq("branch_id", branchId).eq("status", "completed").gte("completed_at", range.start).lt("completed_at", range.end),
      service.from("payroll_adjustments").select("barber_id,kind,amount,occurred_on,note").eq("branch_id", branchId).gte("occurred_on", range.startDate).lte("occurred_on", range.endDate),
      service.from("payroll_periods").select("id,status,period_start,period_end,payroll_payouts(id,barber_id,commission_amount,bonus_amount,penalty_amount,advance_amount,base_salary_amount,total_amount,paid_amount,paid_at,note)").eq("branch_id", branchId).eq("period_start", range.startDate).maybeSingle()
    ]);
    for (const result of [barberResult, invoiceResult, adjustmentResult, periodResult]) if (result.error) throw result.error;
    const invoiceIds = (invoiceResult.data ?? []).map((invoice) => invoice.id);
    const { data: lines, error: lineError } = invoiceIds.length
      ? await service.from("invoice_lines").select("id,invoice_id").in("invoice_id", invoiceIds)
      : { data: [], error: null };
    if (lineError) throw lineError;
    const lineIds = (lines ?? []).map((line) => line.id);
    const { data: commissions, error: commissionError } = lineIds.length
      ? await service.from("invoice_line_staff").select("barber_id,commission_amount,reversed_at").in("invoice_line_id", lineIds)
      : { data: [], error: null };
    if (commissionError) throw commissionError;

    const adjustmentByBarber = (adjustmentResult.data ?? []).reduce<Record<string, Adjustment[]>>((result, adjustment) => {
      (result[adjustment.barber_id] ??= []).push(adjustment as Adjustment);
      return result;
    }, {});
    const commissionByBarber = (commissions ?? []).reduce<Record<string, number>>((result, commission) => {
      if (!commission.reversed_at) result[commission.barber_id] = (result[commission.barber_id] ?? 0) + Number(commission.commission_amount);
      return result;
    }, {});
    const savedPayoutByBarber = new Map((periodResult.data?.payroll_payouts ?? []).map((payout) => [payout.barber_id, payout]));
    const rows = (barberResult.data ?? []).map((barber) => {
      const adjustments = adjustmentByBarber[barber.id] ?? [];
      const totals = adjustments.reduce(
        (result, adjustment) => {
          if (adjustment.kind === "bonus") result.bonus += Number(adjustment.amount);
          if (adjustment.kind === "penalty") result.penalty += Number(adjustment.amount);
          if (adjustment.kind === "advance") result.advance += Number(adjustment.amount);
          return result;
        },
        { bonus: 0, penalty: 0, advance: 0 }
      );
      const compensation = Array.isArray(barber.barber_compensation) ? barber.barber_compensation[0] : barber.barber_compensation;
      const baseSalary = Number(compensation?.base_salary ?? 0);
      const commission = commissionByBarber[barber.id] ?? 0;
      const saved = savedPayoutByBarber.get(barber.id);
      return {
        barberId: barber.id,
        name: barber.name,
        commissionRate: Number(compensation?.default_commission_rate ?? 0),
        baseSalary,
        commission,
        ...totals,
        total: baseSalary + commission + totals.bonus - totals.penalty - totals.advance,
        payout: saved ?? null
      };
    });
    return NextResponse.json({ month: range.startDate.slice(0, 7), period: periodResult.data ?? null, rows });
  } catch (error) {
    return adminErrorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const context = await requireAdminContext();
    assertRole(context, ["admin", "manager"]);
    const body = await bodyJson(request);
    const action = asText(body.action, "Thao tác", { max: 30 });
    const branchId = asText(body.branchId, "Chi nhánh", { max: 80 });
    assertBranchAccess(context, branchId);
    const service = createServiceClient();

    if (action === "adjustment") {
      const barberId = asText(body.barberId, "Nhân viên", { max: 100 });
      const kind = asText(body.kind, "Loại điều chỉnh", { max: 20 });
      if (!["bonus", "penalty", "advance", "leave"].includes(kind)) throw new Error("Loại điều chỉnh không hợp lệ.");
      const { data: barber, error: barberError } = await service.from("barbers").select("id").eq("id", barberId).eq("branch_id", branchId).single();
      if (barberError || !barber) throw new Error("Nhân viên không thuộc chi nhánh.");
      const { data, error } = await service
        .from("payroll_adjustments")
        .insert({ branch_id: branchId, barber_id: barberId, kind, amount: asMoney(body.amount, "Số tiền"), occurred_on: typeof body.occurredOn === "string" ? body.occurredOn : undefined, note: asText(body.note, "Ghi chú", { max: 300 }), created_by: context.id })
        .select()
        .single();
      if (error) throw error;
      return NextResponse.json({ adjustment: data }, { status: 201 });
    }

    if (action === "compensation") {
      const barberId = asText(body.barberId, "Nhân viên", { max: 100 });
      const rate = Number(body.commissionRate);
      if (!Number.isFinite(rate) || rate < 0 || rate > 100) throw new Error("Tỷ lệ hoa hồng phải từ 0 đến 100%.");
      const { data: barber, error: barberError } = await service.from("barbers").select("id").eq("id", barberId).eq("branch_id", branchId).single();
      if (barberError || !barber) throw new Error("Nhân viên không thuộc chi nhánh.");
      const { error } = await service.from("barber_compensation").upsert({ barber_id: barberId, default_commission_rate: rate, base_salary: asMoney(body.baseSalary ?? 0, "Lương cơ bản") }, { onConflict: "barber_id" });
      if (error) throw error;
      return NextResponse.json({ ok: true });
    }

    if (action === "close") {
      const periodStart = asText(body.periodStart, "Ngày bắt đầu", { max: 10 });
      const periodEnd = asText(body.periodEnd, "Ngày kết thúc", { max: 10 });
      const { data, error } = await service.rpc("close_windread_payroll_period", { p_branch_id: branchId, p_period_start: periodStart, p_period_end: periodEnd, p_actor_id: context.id });
      if (error) throw error;
      return NextResponse.json({ periodId: data });
    }

    if (action === "pay") {
      const payoutId = asUuid(body.payoutId, "Bảng lương");
      const paidAmount = asMoney(body.paidAmount, "Số tiền trả");
      const method = asText(body.method ?? "bank_transfer", "Phương thức thanh toán", { max: 30 });
      if (!["cash", "bank_transfer", "card", "debt", "other"].includes(method)) throw new Error("Phương thức thanh toán không hợp lệ.");
      const { data: payout, error: payoutError } = await service.from("payroll_payouts").select("id,total_amount,payroll_periods!inner(branch_id,status)").eq("id", payoutId).single();
      if (payoutError) throw payoutError;
      const period = Array.isArray(payout.payroll_periods) ? payout.payroll_periods[0] : payout.payroll_periods;
      assertBranchAccess(context, period.branch_id);
      if (paidAmount !== Math.max(Number(payout.total_amount), 0)) throw new Error("Số tiền trả phải khớp lương thực lĩnh.");
      const { error } = await service.rpc("pay_windread_payroll_payout", { p_payout_id: payoutId, p_paid_amount: paidAmount, p_method: method, p_note: typeof body.note === "string" ? body.note : null, p_actor_id: context.id });
      if (error) throw error;
      return NextResponse.json({ ok: true });
    }

    throw new Error("Thao tác lương không được hỗ trợ.");
  } catch (error) {
    return adminErrorResponse(error);
  }
}
