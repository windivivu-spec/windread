import { NextRequest, NextResponse } from "next/server";
import { adminErrorResponse, assertBranchAccess, assertRole, requireAdminContext } from "../../../../lib/admin/auth";
import { hcmDate } from "../../../../lib/admin/dates";
import { createServiceClient } from "../../../../lib/supabase/service";

export async function GET(request: NextRequest) {
  try {
    const context = await requireAdminContext();
    assertRole(context, ["admin", "manager"]);
    const branchId = request.nextUrl.searchParams.get("branchId");
    if (!branchId) throw new Error("Chọn chi nhánh để xem báo cáo.");
    assertBranchAccess(context, branchId);
    const from = request.nextUrl.searchParams.get("from") || hcmDate();
    const to = request.nextUrl.searchParams.get("to") || from;
    const start = `${from}T00:00:00+07:00`;
    const end = `${to}T23:59:59.999+07:00`;
    const service = createServiceClient();
    const [invoiceResult, ledgerResult, productResult] = await Promise.all([
      service.from("invoices").select("id,invoice_number,total_amount,discount_amount,completed_at,invoice_lines(description,kind,quantity,line_total,invoice_line_staff(barber_id,commission_amount,reversed_at))").eq("branch_id", branchId).eq("status", "completed").gte("completed_at", start).lte("completed_at", end).order("completed_at", { ascending: false }),
      service.from("ledger_entries").select("direction,method,amount,category").eq("branch_id", branchId).gte("occurred_at", start).lte("occurred_at", end),
      service.from("products").select("id,name,stock_on_hand,reorder_level").eq("branch_id", branchId).eq("is_active", true).order("stock_on_hand")
    ]);
    for (const result of [invoiceResult, ledgerResult, productResult]) if (result.error) throw result.error;
    const invoices = invoiceResult.data ?? [];
    const ledger = ledgerResult.data ?? [];
    const revenue = invoices.reduce((sum, invoice) => sum + Number(invoice.total_amount), 0);
    const discounts = invoices.reduce((sum, invoice) => sum + Number(invoice.discount_amount), 0);
    const cashflow = ledger.reduce((sum, item) => sum + (item.direction === "in" ? Number(item.amount) : -Number(item.amount)), 0);
    const topSales = new Map<string, { description: string; kind: string; quantity: number; revenue: number }>();
    const staff = new Map<string, number>();
    invoices.forEach((invoice) => (invoice.invoice_lines ?? []).forEach((line) => {
      const current = topSales.get(line.description) ?? { description: line.description, kind: line.kind, quantity: 0, revenue: 0 };
      current.quantity += Number(line.quantity); current.revenue += Number(line.line_total); topSales.set(line.description, current);
      (line.invoice_line_staff ?? []).forEach((assignment) => { if (!assignment.reversed_at) staff.set(assignment.barber_id, (staff.get(assignment.barber_id) ?? 0) + Number(assignment.commission_amount)); });
    }));
    return NextResponse.json({ from, to, metrics: { invoices: invoices.length, revenue, discounts, cashflow }, invoices, topSales: [...topSales.values()].sort((a,b) => b.revenue - a.revenue).slice(0, 10), commissions: [...staff.entries()].map(([barberId, amount]) => ({ barberId, amount })).sort((a,b) => b.amount-a.amount), lowStock: (productResult.data ?? []).filter((product) => product.stock_on_hand <= product.reorder_level) });
  } catch (error) {
    return adminErrorResponse(error);
  }
}
