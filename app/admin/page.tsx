"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { adminFetch, formatDateTime, formatVnd } from "./admin-ui";
import { AdminFrame, useAdminSession } from "./components/AdminFrame";

type Overview = { date: string; metrics: { revenue: number; cash: number; invoices: number; expenses: number }; paymentTotals: Record<string, number>; lowStock: Array<{ id: string; name: string; stock_on_hand: number; reorder_level: number }>; upcoming: Array<{ id: string; customer_name: string; start_time: string; status: string }> };

function Dashboard() {
  const { branchId } = useAdminSession();
  const [data, setData] = useState<Overview | null>(null);
  const [error, setError] = useState("");
  useEffect(() => { setData(null); adminFetch<Overview>(`/api/admin/overview?branchId=${encodeURIComponent(branchId)}`).then(setData).catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "Không tải được tổng quan.")); }, [branchId]);
  const metrics = data?.metrics;
  return <>
    {error && <p className="admin-form-error">{error}</p>}
    <section className="admin-metric-grid">
      <article><span>Doanh thu hôm nay</span><strong>{metrics ? formatVnd(metrics.revenue) : "-"}</strong><small>Hóa đơn đã hoàn tất</small></article>
      <article><span>Tiền mặt thuần</span><strong>{metrics ? formatVnd(metrics.cash) : "-"}</strong><small>Sau các khoản chi tiền mặt</small></article>
      <article><span>Số hóa đơn</span><strong>{metrics ? metrics.invoices : "-"}</strong><small>Đang ghi nhận trong ngày</small></article>
      <article className="is-muted"><span>Khoản chi</span><strong>{metrics ? formatVnd(metrics.expenses) : "-"}</strong><small>Chi trong ngày</small></article>
    </section>
    <section className="admin-overview-grid">
      <article className="admin-panel admin-panel-large"><header><div><p className="admin-kicker">Dòng tiền</p><h2>Theo phương thức thanh toán</h2></div><Link href="/admin/finance">Mở sổ quỹ →</Link></header><div className="admin-payment-list">{data && Object.entries(data.paymentTotals).length ? Object.entries(data.paymentTotals).map(([method, amount]) => <div key={method}><span>{method === "cash" ? "Tiền mặt" : method === "bank_transfer" ? "Chuyển khoản" : method === "card" ? "Quẹt thẻ" : method === "debt" ? "Công nợ" : "Khác"}</span><strong>{formatVnd(amount)}</strong></div>) : <p className="admin-empty">Chưa có giao dịch trong ngày.</p>}</div></article>
      <article className="admin-panel"><header><div><p className="admin-kicker">Lịch sắp tới</p><h2>Khách cần phục vụ</h2></div><Link href="/admin/bookings">Lịch hẹn →</Link></header><div className="admin-compact-list">{data?.upcoming.length ? data.upcoming.map((booking) => <div key={booking.id}><span>{booking.customer_name}</span><small>{formatDateTime(booking.start_time)}</small></div>) : <p className="admin-empty">Không có lịch chờ.</p>}</div></article>
      <article className="admin-panel"><header><div><p className="admin-kicker">Nhắc việc</p><h2>Tồn kho cần xem</h2></div><Link href="/admin/catalog">Kho →</Link></header><div className="admin-compact-list">{data?.lowStock.length ? data.lowStock.map((product) => <div key={product.id}><span>{product.name}</span><small>{product.stock_on_hand} còn lại / mức {product.reorder_level}</small></div>) : <p className="admin-empty">Tồn kho đang an toàn.</p>}</div></article>
    </section>
  </>;
}

export default function AdminDashboardPage() { return <AdminFrame title="Tổng quan" eyebrow="Sổ vận hành theo ngày"><Dashboard /></AdminFrame>; }
