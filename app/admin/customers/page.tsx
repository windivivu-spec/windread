"use client";

import { FormEvent, useEffect, useState } from "react";
import { adminFetch, formatDateTime, formatVnd } from "../admin-ui";
import { AdminFrame } from "../components/AdminFrame";

type Customer = { id: string; name: string; phone: string; email: string | null; note: string | null; created_at: string; bookings: Array<{ id: string }> | null; invoices: Array<{ total_amount: number; status: string; completed_at: string | null }> | null };

function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({ name: "", phone: "", email: "", note: "" });
  const load = (search = "") => adminFetch<{ customers: Customer[] }>(`/api/admin/customers?q=${encodeURIComponent(search)}`).then((data) => setCustomers(data.customers)).catch((reason: unknown) => setMessage(reason instanceof Error ? reason.message : "Không tải được khách hàng."));
  useEffect(() => { load(); }, []);
  async function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setMessage(""); try { await adminFetch("/api/admin/customers", { method: "POST", body: JSON.stringify(form) }); setForm({ name: "", phone: "", email: "", note: "" }); setMessage("Đã lưu khách hàng."); load(query); } catch (reason) { setMessage(reason instanceof Error ? reason.message : "Không thể lưu khách hàng."); } }
  return <div className="admin-two-column">
    <section className="admin-panel"><header><div><p className="admin-kicker">Hồ sơ khách</p><h2>Khách hàng & lịch sử</h2></div><form className="admin-inline-search" onSubmit={(event) => { event.preventDefault(); load(query); }}><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm tên hoặc số điện thoại"/><button>Tìm</button></form></header><div className="admin-table-wrap"><table><thead><tr><th>Khách hàng</th><th>Liên hệ</th><th>Lịch hẹn</th><th>Đã chi</th><th>Lần gần nhất</th></tr></thead><tbody>{customers.map((customer) => { const completed = (customer.invoices ?? []).filter((invoice) => invoice.status === "completed"); const spend = completed.reduce((total, invoice) => total + Number(invoice.total_amount), 0); const latest = completed.sort((a,b) => String(b.completed_at).localeCompare(String(a.completed_at)))[0]; return <tr key={customer.id}><td><strong>{customer.name}</strong>{customer.note && <small>{customer.note}</small>}</td><td><span>{customer.phone}</span><small>{customer.email || "—"}</small></td><td>{customer.bookings?.length ?? 0}</td><td>{formatVnd(spend)}</td><td>{formatDateTime(latest?.completed_at)}</td></tr>; })}</tbody></table>{!customers.length && <p className="admin-empty">Chưa có khách phù hợp.</p>}</div></section>
    <aside className="admin-panel admin-form-panel"><p className="admin-kicker">Nhập nhanh</p><h2>Thêm khách hàng</h2><form className="admin-form-stack" onSubmit={submit}><label>Họ tên<input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label><label>Số điện thoại<input required inputMode="tel" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} /></label><label>Email<input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></label><label>Ghi chú<textarea rows={3} value={form.note} onChange={(event) => setForm({ ...form, note: event.target.value })} /></label>{message && <p className={message.startsWith("Đã") ? "admin-form-success" : "admin-form-error"}>{message}</p>}<button className="admin-button">Lưu khách hàng</button></form></aside>
  </div>;
}

export default function CustomersPage() { return <AdminFrame title="Khách hàng" eyebrow="Mỗi lần ghé đều có lịch sử"><Customers /></AdminFrame>; }
