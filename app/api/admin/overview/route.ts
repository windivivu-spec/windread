import { NextRequest, NextResponse } from "next/server";
import { adminErrorResponse, allowedBranches, assertRole, requireAdminContext } from "../../../../lib/admin/auth";
import { hcmDate, hcmDayRange } from "../../../../lib/admin/dates";
import { createServiceClient } from "../../../../lib/supabase/service";

function sum(rows: Array<{ amount?: number; total_amount?: number }>, key: "amount" | "total_amount") {
  return rows.reduce((total, row) => total + Number(row[key] ?? 0), 0);
}

export async function GET(request: NextRequest) {
  try {
    const context = await requireAdminContext();
    assertRole(context, ["admin", "manager", "cashier"]);
    const branches = await allowedBranches(context);
    const branchId = request.nextUrl.searchParams.get("branchId") || "all";
    const allowedIds = branches.map((branch) => branch.id);
    const scope = branchId === "all" ? allowedIds : allowedIds.filter((id) => id === branchId);
    if (!scope.length) return NextResponse.json({ date: hcmDate(), metrics: { revenue: 0, cash: 0, invoices: 0, expenses: 0 }, lowStock: [], upcoming: [], paymentTotals: {} });

    const service = createServiceClient();
    const { start, end } = hcmDayRange();
    const [invoiceResult, ledgerResult, stockResult, bookingResult] = await Promise.all([
      service.from("invoices").select("id,invoice_number,total_amount,completed_at,branch_id").eq("status", "completed").in("branch_id", scope).gte("completed_at", start).lt("completed_at", end),
      service.from("ledger_entries").select("amount,direction,method,category,occurred_at,branch_id").in("branch_id", scope).gte("occurred_at", start).lt("occurred_at", end),
      service.from("products").select("id,name,stock_on_hand,reorder_level,branch_id").in("branch_id", scope).eq("is_active", true).order("stock_on_hand").limit(8),
      service.from("bookings").select("id,customer_name,customer_phone,start_time,status,branch_id,barber_id,service_id").in("branch_id", scope).in("status", ["pending", "confirmed"]).gte("start_time", start).order("start_time").limit(8)
    ]);
    for (const result of [invoiceResult, ledgerResult, stockResult, bookingResult]) if (result.error) throw result.error;

    const invoices = invoiceResult.data ?? [];
    const ledger = ledgerResult.data ?? [];
    const paymentTotals = ledger.reduce<Record<string, number>>((totals, item) => {
      const signed = item.direction === "in" ? Number(item.amount) : -Number(item.amount);
      totals[item.method] = (totals[item.method] ?? 0) + signed;
      return totals;
    }, {});
    const expenses = ledger.filter((item) => item.direction === "out");
    const cash = paymentTotals.cash ?? 0;
    return NextResponse.json({
      date: hcmDate(),
      metrics: { revenue: sum(invoices, "total_amount"), cash, invoices: invoices.length, expenses: sum(expenses, "amount") },
      paymentTotals,
      lowStock: (stockResult.data ?? []).filter((product) => product.stock_on_hand <= product.reorder_level),
      upcoming: bookingResult.data ?? []
    });
  } catch (error) {
    return adminErrorResponse(error);
  }
}
