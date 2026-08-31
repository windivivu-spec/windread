"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { adminFetch, formatVnd } from "../admin-ui";
import { AdminFrame, useAdminSession } from "../components/AdminFrame";
import { getServiceCategory, serviceCategories } from "../../booking/serviceCategories";
import type { ServiceCategory } from "../../booking/types";

type Catalog = { products: Array<{ id: string; name: string; sale_price: number; stock_on_hand: number }>; services: Array<{ id: string; name: string; price: number; price_label?: string | null; service_category?: ServiceCategory | null; duration_minutes: number; is_bookable: boolean }>; packages: Array<{ id: string; name: string; sale_price: number }> };
type Barber = { id: string; name: string };
type CartLine = { key: string; kind: "service" | "product" | "package" | "other"; catalogId: string | null; description: string; unitPrice: number; quantity: number; discountAmount: number; barberId: string };
type Booking = { id: string; customerName: string; customerPhone: string; customerEmail?: string; note?: string; serviceId: string; barberId: string; branchId: string };

function Pos() {
  const { branchId } = useAdminSession();
  const params = useSearchParams();
  const [catalog, setCatalog] = useState<Catalog>({ products: [], services: [], packages: [] });
  const [serviceCategory, setServiceCategory] = useState<ServiceCategory>("barber");
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [note, setNote] = useState("");
  const [invoiceDiscount, setInvoiceDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(params.get("booking"));

  useEffect(() => {
    setCart([]); setMessage("");
    Promise.all([
      adminFetch<Catalog>(`/api/admin/catalog?branchId=${encodeURIComponent(branchId)}`),
      fetch(`/api/barbers?branchId=${encodeURIComponent(branchId)}`).then((response) => response.json() as Promise<Barber[]>)
    ]).then(([nextCatalog, nextBarbers]) => { setCatalog(nextCatalog); setBarbers(nextBarbers); }).catch((reason: unknown) => setMessage(reason instanceof Error ? reason.message : "Không tải được danh mục."));
  }, [branchId]);

  useEffect(() => {
    const nextBooking = params.get("booking");
    if (!nextBooking || !catalog.services.length) return;
    adminFetch<Booking>(`/api/bookings/${encodeURIComponent(nextBooking)}`).then((booking) => {
      if (booking.branchId !== branchId) return;
      const service = catalog.services.find((item) => item.id === booking.serviceId);
      if (!service) return;
      setCustomerName(booking.customerName); setCustomerPhone(booking.customerPhone); setCustomerEmail(booking.customerEmail ?? ""); setNote(booking.note ?? ""); setBookingId(booking.id);
      setCart((current) => current.length ? current : [{ key: crypto.randomUUID(), kind: "service", catalogId: service.id, description: service.name, unitPrice: service.price, quantity: 1, discountAmount: 0, barberId: booking.barberId }]);
    }).catch(() => setMessage("Không thể đọc booking để tạo hóa đơn."));
  }, [branchId, catalog.services, params]);

  const subtotal = useMemo(() => cart.reduce((total, line) => total + line.unitPrice * line.quantity - line.discountAmount, 0), [cart]);
  const total = Math.max(0, subtotal - invoiceDiscount);
  const bookableServices = catalog.services.filter((service) => service.is_bookable);
  const availableServiceCategories = serviceCategories.filter((category) => bookableServices.some((service) => getServiceCategory(service) === category.id));
  const visibleServiceCategory = availableServiceCategories.some((category) => category.id === serviceCategory)
    ? serviceCategory
    : (availableServiceCategories[0]?.id ?? "barber");
  const visibleServices = bookableServices.filter((service) => getServiceCategory(service) === visibleServiceCategory);
  function addLine(line: Omit<CartLine, "key" | "quantity" | "discountAmount" | "barberId">) { setCart((current) => [...current, { ...line, key: crypto.randomUUID(), quantity: 1, discountAmount: 0, barberId: "" }]); }
  function updateLine(key: string, update: Partial<CartLine>) { setCart((current) => current.map((line) => line.key === key ? { ...line, ...update } : line)); }
  async function checkout() {
    setMessage("");
    if (!cart.length) { setMessage("Thêm ít nhất một dịch vụ hoặc sản phẩm vào hóa đơn."); return; }
    setSaving(true);
    try {
      const result = await adminFetch<{ invoice: { invoice_number: string } }>("/api/admin/invoices", { method: "POST", body: JSON.stringify({ branchId, customerName, customerPhone, customerEmail, bookingId, note, discountAmount: invoiceDiscount, lines: cart.map(({ key: _key, ...line }) => line), payments: [{ method: paymentMethod, amount: total }] }) });
      setMessage(`Đã hoàn tất ${result.invoice.invoice_number}. Hóa đơn đã có trong mục Hóa đơn.`);
      setCart([]); setInvoiceDiscount(0); setBookingId(null);
    } catch (reason) { setMessage(reason instanceof Error ? reason.message : "Không thể hoàn tất hóa đơn."); } finally { setSaving(false); }
  }
  return <div className="admin-pos-grid">
    <section className="admin-pos-catalog admin-panel"><header><div><p className="admin-kicker">Chọn nhanh</p><h2>Dịch vụ, sản phẩm & gói</h2></div></header><div className="admin-catalog-section"><div className="admin-catalog-section-heading"><h3>Dịch vụ</h3><small>{visibleServices.length} lựa chọn</small></div><div className="admin-service-category-tabs" role="tablist" aria-label="Nhóm dịch vụ">{availableServiceCategories.map((category) => <button className={visibleServiceCategory === category.id ? "is-active" : ""} type="button" role="tab" aria-selected={visibleServiceCategory === category.id} key={category.id} onClick={() => setServiceCategory(category.id)}>{category.label}</button>)}</div><div className="admin-choice-grid admin-service-choice-grid">{visibleServices.map((service) => <button key={service.id} onClick={() => addLine({ kind: "service", catalogId: service.id, description: service.name, unitPrice: service.price })}><span>{service.name}</span><strong>{service.price_label ?? formatVnd(service.price)}</strong><small>{service.duration_minutes} phút</small></button>)}</div></div><div className="admin-catalog-section"><h3>Sản phẩm đang bán</h3><div className="admin-choice-grid">{catalog.products.filter((product) => product.stock_on_hand > 0).map((product) => <button key={product.id} onClick={() => addLine({ kind: "product", catalogId: product.id, description: product.name, unitPrice: product.sale_price })}><span>{product.name}</span><strong>{formatVnd(product.sale_price)}</strong><small>Còn {product.stock_on_hand}</small></button>)}</div></div>{catalog.packages.length > 0 && <div className="admin-catalog-section"><h3>Gói dịch vụ</h3><div className="admin-choice-grid">{catalog.packages.map((pack) => <button key={pack.id} onClick={() => addLine({ kind: "package", catalogId: pack.id, description: pack.name, unitPrice: pack.sale_price })}><span>{pack.name}</span><strong>{formatVnd(pack.sale_price)}</strong></button>)}</div></div>}</section>
    <aside className="admin-pos-ticket"><div className="admin-ticket-heading"><p className="admin-kicker">Hóa đơn mới</p><h2>Thu ngân</h2>{bookingId && <small>Liên kết lịch hẹn</small>}</div><div className="admin-ticket-customer"><label>Khách hàng<input value={customerName} onChange={(event) => setCustomerName(event.target.value)} placeholder="Khách vãng lai" /></label><label>Số điện thoại<input value={customerPhone} onChange={(event) => setCustomerPhone(event.target.value)} placeholder="Không bắt buộc" /></label><label>Email<input value={customerEmail} onChange={(event) => setCustomerEmail(event.target.value)} placeholder="Không bắt buộc" /></label></div><div className="admin-ticket-lines">{cart.length ? cart.map((line) => <article key={line.key}><div><strong>{line.description}</strong><button className="admin-text-button danger" onClick={() => setCart((current) => current.filter((item) => item.key !== line.key))}>Bỏ</button></div><div className="admin-line-controls"><label>SL<input type="number" min="1" value={line.quantity} onChange={(event) => updateLine(line.key, { quantity: Math.max(1, Number(event.target.value) || 1) })} /></label><label>Giảm<input type="number" min="0" max={line.unitPrice * line.quantity} value={line.discountAmount} onChange={(event) => updateLine(line.key, { discountAmount: Math.max(0, Number(event.target.value) || 0) })} /></label></div><select value={line.barberId} onChange={(event) => updateLine(line.key, { barberId: event.target.value })}><option value="">Chưa xếp nhân viên</option>{barbers.map((barber) => <option key={barber.id} value={barber.id}>{barber.name}</option>)}</select><small>{formatVnd(line.unitPrice * line.quantity - line.discountAmount)}</small></article>) : <p className="admin-empty">Chọn dịch vụ hoặc sản phẩm ở cột bên trái.</p>}</div><div className="admin-ticket-total"><label>Giảm giá hóa đơn<input type="number" min="0" max={subtotal} value={invoiceDiscount} onChange={(event) => setInvoiceDiscount(Math.min(subtotal, Math.max(0, Number(event.target.value) || 0)))} /></label><div><span>Tạm tính</span><strong>{formatVnd(subtotal)}</strong></div><div className="is-total"><span>Cần thanh toán</span><strong>{formatVnd(total)}</strong></div></div><label className="admin-payment-choice">Thanh toán<select value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value)}><option value="cash">Tiền mặt</option><option value="bank_transfer">Chuyển khoản</option><option value="card">Quẹt thẻ</option><option value="debt">Ghi công nợ</option><option value="other">Khác</option></select></label><label className="admin-ticket-note">Ghi chú<textarea value={note} onChange={(event) => setNote(event.target.value)} rows={2} /></label>{message && <p className={message.startsWith("Đã") ? "admin-form-success" : "admin-form-error"}>{message}</p>}<button className="admin-button admin-button-wide" onClick={checkout} disabled={saving || !cart.length}>{saving ? "Đang chốt hóa đơn…" : `Hoàn tất · ${formatVnd(total)}`}</button></aside>
  </div>;
}

export default function PosPage() { return <AdminFrame title="Thu ngân" eyebrow="Tạo hóa đơn trong một màn hình"><Suspense fallback={<p className="admin-empty">Đang mở hóa đơn…</p>}><Pos /></Suspense></AdminFrame>; }
