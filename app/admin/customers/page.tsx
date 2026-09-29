"use client";

import { useEffect, useState } from "react";
import { adminFetch, formatDateTime } from "../admin-ui";
import { AdminFrame } from "../components/AdminFrame";

type Customer = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  note: string | null;
  bookings: Array<{ id: string; status: string; start_time: string }> | null;
  invoices: Array<{ total_amount: number; status: string; completed_at: string | null }> | null;
};

function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");
  async function load(search = "") {
    try {
      const data = await adminFetch<{ customers: Customer[] }>(`/api/admin/customers?q=${encodeURIComponent(search)}`);
      setCustomers(data.customers);
      setMessage("");
    } catch (reason) {
      setMessage(reason instanceof Error ? reason.message : "Không tải được khách hàng.");
    }
  }
  useEffect(() => { void load(); }, []);
  return <section className="admin-panel">
    <header><div><p className="admin-kicker">Hồ sơ khách đã phục vụ</p><h2>Khách hàng & lịch sử</h2></div><form className="admin-inline-search" onSubmit={(event) => { event.preventDefault(); void load(query); }}><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm tên hoặc số điện thoại"/><button>Tìm</button></form></header>
    <p className="admin-customer-help">Chỉ lưu hồ sơ khách đã được phục vụ, không tạo hồ sơ khi khách mới đặt lịch. Số điện thoại giúp gộp các lần ghé vào cùng một hồ sơ.</p>
    {message && <p className="admin-form-error">{message}</p>}
    <div className="admin-table-wrap"><table><thead><tr><th>Khách hàng</th><th>Liên hệ</th><th>Lần phục vụ</th><th>Lần gần nhất</th></tr></thead><tbody>{customers.map((customer) => {
      const visits = (customer.bookings ?? []).filter((booking) => booking.status === "completed");
      const paid = (customer.invoices ?? []).filter((invoice) => invoice.status === "completed");
      const latest = [...visits.map((visit) => visit.start_time), ...paid.map((invoice) => invoice.completed_at || "")].sort().at(-1);
      return <tr key={customer.id}><td><strong>{customer.name}</strong>{customer.note && <small>{customer.note}</small>}</td><td><a href={`tel:${customer.phone}`}>{customer.phone}</a><small>{customer.email || "—"}</small></td><td>{visits.length || paid.length}</td><td>{formatDateTime(latest)}</td></tr>;
    })}</tbody></table>{!customers.length && <p className="admin-empty">Chưa có khách đã phục vụ phù hợp.</p>}</div>
  </section>;
}

export default function CustomersPage() { return <AdminFrame title="Khách hàng" eyebrow="Chỉ ghi nhận khách đã phục vụ"><Customers /></AdminFrame>; }
