"use client";

import { useEffect, useState } from "react";
import { adminFetch, downloadCsv, formatVnd } from "../admin-ui";
import { AdminFrame, useAdminSession } from "../components/AdminFrame";

type Report = { from: string; to: string; metrics: { invoices: number; revenue: number; discounts: number; cashflow: number }; topSales: Array<{ description: string; kind: string; quantity: number; revenue: number }>; commissions: Array<{ barberId: string; amount: number }>; lowStock: Array<{ id: string; name: string; stock_on_hand: number; reorder_level: number }> };

function Reports() {
  const { branchId } = useAdminSession();
  const today = new Date().toISOString().slice(0, 10);
  const [from, setFrom] = useState(today); const [to, setTo] = useState(today); const [data, setData] = useState<Report | null>(null); const [message, setMessage] = useState("");
  const load = () => adminFetch<Report>(`/api/admin/reports?branchId=${encodeURIComponent(branchId)}&from=${from}&to=${to}`).then(setData).catch((reason: unknown) => setMessage(reason instanceof Error ? reason.message : "Không tải được báo cáo."));
  useEffect(() => { load(); }, [branchId]);
  function exportCsv() { if (!data) return; downloadCsv(`bao-cao-${data.from}-${data.to}.csv`, ["Từ ngày", "Đến ngày", "Hóa đơn", "Doanh thu", "Giảm giá", "Dòng tiền thuần"], [[data.from, data.to, data.metrics.invoices, data.metrics.revenue, data.metrics.discounts, data.metrics.cashflow], ...data.topSales.map((item) => [item.description, item.kind, item.quantity, item.revenue, "", ""])]); }
  return <><section className="admin-report-filter"><label>Từ ngày<input type="date" value={from} onChange={(event) => setFrom(event.target.value)} /></label><label>Đến ngày<input type="date" value={to} onChange={(event) => setTo(event.target.value)} /></label><button className="admin-button" onClick={load}>Xem báo cáo</button><button className="admin-text-button" disabled={!data} onClick={exportCsv}>Xuất CSV</button></section>{message && <p className="admin-form-error">{message}</p>}<section className="admin-metric-grid"><article><span>Doanh thu</span><strong>{formatVnd(data?.metrics.revenue)}</strong><small>{data?.metrics.invoices ?? 0} hóa đơn</small></article><article><span>Giảm giá</span><strong>{formatVnd(data?.metrics.discounts)}</strong><small>Trong khoảng đã chọn</small></article><article><span>Dòng tiền thuần</span><strong>{formatVnd(data?.metrics.cashflow)}</strong><small>Thu trừ chi</small></article><article className="is-muted"><span>Kho cần nhập</span><strong>{data?.lowStock.length ?? 0}</strong><small>Sản phẩm chạm mức nhắc</small></article></section><section className="admin-overview-grid"><article className="admin-panel admin-panel-large"><header><div><p className="admin-kicker">Bán chạy</p><h2>Dịch vụ & sản phẩm</h2></div></header><div className="admin-table-wrap"><table><thead><tr><th>Tên</th><th>Loại</th><th>SL</th><th>Doanh thu</th></tr></thead><tbody>{data?.topSales.map((item) => <tr key={item.description}><td>{item.description}</td><td>{item.kind}</td><td>{item.quantity}</td><td>{formatVnd(item.revenue)}</td></tr>)}</tbody></table></div></article><article className="admin-panel"><header><div><p className="admin-kicker">Hoa hồng</p><h2>Đang được tích lũy</h2></div></header><div className="admin-compact-list">{data?.commissions.map((item) => <div key={item.barberId}><span>{item.barberId}</span><strong>{formatVnd(item.amount)}</strong></div>)}{!data?.commissions.length && <p className="admin-empty">Chưa có hoa hồng trong khoảng này.</p>}</div></article></section></>;
}

export default function ReportsPage() { return <AdminFrame title="Báo cáo" eyebrow="Số liệu đủ để ra quyết định"><Reports /></AdminFrame>; }
