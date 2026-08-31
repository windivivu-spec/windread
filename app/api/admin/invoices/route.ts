import { NextRequest, NextResponse } from "next/server";
import { adminErrorResponse, assertBranchAccess, assertRole, requireAdminContext } from "../../../../lib/admin/auth";
import { bodyJson } from "../../../../lib/admin/validation";
import { createServiceClient } from "../../../../lib/supabase/service";

const paymentMethods = ["cash", "bank_transfer", "card", "debt", "other"] as const;
const lineKinds = ["service", "product", "package", "other"] as const;

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function checkoutPayload(body: Record<string, unknown>) {
  const branchId = body.branchId;
  const lines = body.lines;
  const payments = body.payments;
  if (!isString(branchId) || !Array.isArray(lines) || !Array.isArray(payments)) throw new Error("Thiếu dữ liệu hóa đơn.");
  const cleanLines = lines.map((line) => {
    if (!line || typeof line !== "object") throw new Error("Dòng hóa đơn không hợp lệ.");
    const item = line as Record<string, unknown>;
    if (!lineKinds.includes(item.kind as (typeof lineKinds)[number])) throw new Error("Loại dòng bán không hợp lệ.");
    const quantity = Number(item.quantity ?? 1);
    const discountAmount = Number(item.discountAmount ?? 0);
    if (!Number.isSafeInteger(quantity) || quantity < 1 || !Number.isSafeInteger(discountAmount) || discountAmount < 0) {
      throw new Error("Số lượng hoặc giảm giá không hợp lệ.");
    }
    return {
      kind: item.kind,
      catalogId: isString(item.catalogId) ? item.catalogId : null,
      description: isString(item.description) ? item.description : null,
      quantity,
      discountAmount,
      unitPrice: Number(item.unitPrice ?? 0),
      barberId: isString(item.barberId) && item.barberId ? item.barberId : null
    };
  });
  const cleanPayments = payments.map((payment) => {
    if (!payment || typeof payment !== "object") throw new Error("Thanh toán không hợp lệ.");
    const item = payment as Record<string, unknown>;
    const amount = Number(item.amount);
    if (!paymentMethods.includes(item.method as (typeof paymentMethods)[number]) || !Number.isSafeInteger(amount) || amount <= 0) {
      throw new Error("Phương thức hoặc số tiền thanh toán không hợp lệ.");
    }
    return { method: item.method, amount, note: isString(item.note) ? item.note : null };
  });
  if (!cleanLines.length || !cleanPayments.length) throw new Error("Hóa đơn cần dịch vụ/sản phẩm và thanh toán.");
  const discountAmount = Number(body.discountAmount ?? 0);
  if (!Number.isSafeInteger(discountAmount) || discountAmount < 0) throw new Error("Giảm giá hóa đơn không hợp lệ.");
  return {
    branchId,
    lines: cleanLines,
    payments: cleanPayments,
    discountAmount,
    customerPhone: isString(body.customerPhone) ? body.customerPhone : null,
    customerName: isString(body.customerName) ? body.customerName : null,
    customerEmail: isString(body.customerEmail) ? body.customerEmail : null,
    bookingId: isString(body.bookingId) && body.bookingId ? body.bookingId : null,
    note: isString(body.note) ? body.note : null
  };
}

export async function GET(request: NextRequest) {
  try {
    const context = await requireAdminContext();
    assertRole(context, ["admin", "manager", "cashier"]);
    const branchId = request.nextUrl.searchParams.get("branchId");
    if (branchId) assertBranchAccess(context, branchId);
    const service = createServiceClient();
    let query = service
      .from("invoices")
      .select("id,invoice_number,branch_id,status,subtotal,discount_amount,total_amount,note,booking_id,completed_at,created_at,customers(name,phone),payments(id,method,direction,amount)")
      .order("created_at", { ascending: false })
      .limit(100);
    if (branchId) query = query.eq("branch_id", branchId);
    else if (context.role !== "admin") query = query.in("branch_id", context.branchIds);
    const { data, error } = await query;
    if (error) throw error;
    return NextResponse.json({ invoices: data ?? [] });
  } catch (error) {
    return adminErrorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const context = await requireAdminContext();
    assertRole(context, ["admin", "manager", "cashier"]);
    const payload = checkoutPayload(await bodyJson(request));
    assertBranchAccess(context, payload.branchId);
    const service = createServiceClient();
    const { data: invoiceId, error } = await service.rpc("complete_windread_invoice", {
      p_branch_id: payload.branchId,
      p_customer_phone: payload.customerPhone,
      p_customer_name: payload.customerName,
      p_customer_email: payload.customerEmail,
      p_booking_id: payload.bookingId,
      p_note: payload.note,
      p_discount_amount: payload.discountAmount,
      p_lines: payload.lines,
      p_payments: payload.payments,
      p_actor_id: context.id
    });
    if (error) throw error;
    const { data: invoice, error: invoiceError } = await service
      .from("invoices")
      .select("id,invoice_number,branch_id,status,total_amount,discount_amount,note,completed_at,customers(name,phone),invoice_lines(id,kind,catalog_id,description,quantity,unit_price,discount_amount,line_total,invoice_line_staff(barber_id,commission_rate,commission_amount)),payments(method,direction,amount,note)")
      .eq("id", invoiceId)
      .single();
    if (invoiceError) throw invoiceError;
    return NextResponse.json({ invoice }, { status: 201 });
  } catch (error) {
    return adminErrorResponse(error);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const context = await requireAdminContext();
    assertRole(context, ["admin", "manager"]);
    const body = await bodyJson(request);
    const invoiceId = body.invoiceId;
    const reason = body.reason;
    if (!isString(invoiceId) || !isString(reason) || !reason.trim()) throw new Error("Cần chọn hóa đơn và nhập lý do hoàn tiền.");
    const service = createServiceClient();
    const { data: invoice, error: findError } = await service.from("invoices").select("branch_id").eq("id", invoiceId).single();
    if (findError) throw findError;
    assertBranchAccess(context, invoice.branch_id);
    const { error } = await service.rpc("refund_windread_invoice", { p_invoice_id: invoiceId, p_reason: reason.trim(), p_actor_id: context.id });
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (error) {
    return adminErrorResponse(error);
  }
}
