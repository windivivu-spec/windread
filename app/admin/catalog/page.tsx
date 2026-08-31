"use client";

import { FormEvent, useEffect, useState } from "react";
import { adminFetch, formatVnd } from "../admin-ui";
import { AdminFrame, useAdminSession } from "../components/AdminFrame";

type Product = { id: string; sku: string; name: string; sale_price: number; stock_on_hand: number; reorder_level: number; unit: string };
type Service = { id: string; name: string; price: number; duration_minutes: number; is_bookable: boolean };
type Package = { id: string; name: string; sale_price: number; is_active: boolean };
type Supplier = { id: string; name: string; phone: string | null; email: string | null };
type Catalog = { products: Product[]; services: Service[]; packages: Package[]; suppliers: Supplier[] };
type Tab = "products" | "services" | "packages" | "suppliers";

function CatalogContent() {
  const { branchId } = useAdminSession();
  const [catalog, setCatalog] = useState<Catalog>({ products: [], services: [], packages: [], suppliers: [] });
  const [tab, setTab] = useState<Tab>("products");
  const [message, setMessage] = useState("");
  const [productForm, setProductForm] = useState({ sku: "", name: "", salePrice: "", costPrice: "", openingStock: "", reorderLevel: "", unit: "sp" });
  const [packageForm, setPackageForm] = useState({ name: "", salePrice: "", description: "" });
  const [supplierForm, setSupplierForm] = useState({ name: "", phone: "", email: "", address: "", note: "" });
  const [adjustment, setAdjustment] = useState<{ productId: string; name: string; quantity: string; note: string } | null>(null);
  const load = () => adminFetch<Catalog>(`/api/admin/catalog?branchId=${encodeURIComponent(branchId)}`).then(setCatalog).catch((reason: unknown) => setMessage(reason instanceof Error ? reason.message : "Không tải được danh mục."));
  useEffect(() => { load(); }, [branchId]);

  async function saveProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await adminFetch("/api/admin/catalog", { method: "POST", body: JSON.stringify({ action: "product", branchId, ...productForm, salePrice: Number(productForm.salePrice), costPrice: Number(productForm.costPrice || 0), openingStock: Number(productForm.openingStock || 0), reorderLevel: Number(productForm.reorderLevel || 0) }) });
      setProductForm({ sku: "", name: "", salePrice: "", costPrice: "", openingStock: "", reorderLevel: "", unit: "sp" });
      setMessage("Đã thêm sản phẩm và tồn đầu.");
      load();
    } catch (reason) { setMessage(reason instanceof Error ? reason.message : "Không thể thêm sản phẩm."); }
  }

  async function savePackage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await adminFetch("/api/admin/catalog", { method: "POST", body: JSON.stringify({ action: "package", branchId, ...packageForm, salePrice: Number(packageForm.salePrice) }) });
      setPackageForm({ name: "", salePrice: "", description: "" });
      setMessage("Đã thêm gói bán hàng.");
      load();
    } catch (reason) { setMessage(reason instanceof Error ? reason.message : "Không thể thêm gói."); }
  }

  async function saveSupplier(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await adminFetch("/api/admin/catalog", { method: "POST", body: JSON.stringify({ action: "supplier", ...supplierForm }) });
      setSupplierForm({ name: "", phone: "", email: "", address: "", note: "" });
      setMessage("Đã thêm nhà cung cấp.");
      load();
    } catch (reason) { setMessage(reason instanceof Error ? reason.message : "Không thể thêm nhà cung cấp."); }
  }

  async function saveAdjustment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!adjustment) return;
    try {
      await adminFetch("/api/admin/catalog", { method: "POST", body: JSON.stringify({ action: "stock", productId: adjustment.productId, quantity: Number(adjustment.quantity), note: adjustment.note }) });
      setAdjustment(null);
      setMessage("Đã ghi điều chỉnh tồn kho.");
      load();
    } catch (reason) { setMessage(reason instanceof Error ? reason.message : "Không thể điều chỉnh tồn kho."); }
  }

  const tabs: Array<{ id: Tab; label: string }> = [
    { id: "products", label: "Sản phẩm" }, { id: "services", label: "Dịch vụ" }, { id: "packages", label: "Gói" }, { id: "suppliers", label: "Nhà cung cấp" }
  ];

  return <div className="admin-two-column catalog-layout">
    <section className="admin-panel">
      <header><div><p className="admin-kicker">Danh mục bán hàng</p><h2>Dịch vụ, sản phẩm & gói</h2></div><div className="admin-tabs">{tabs.map((item) => <button key={item.id} className={tab === item.id ? "is-active" : ""} onClick={() => setTab(item.id)}>{item.label}</button>)}</div></header>
      {message && <p className={message.startsWith("Đã") ? "admin-form-success" : "admin-form-error"}>{message}</p>}
      <div className="admin-table-wrap">
        {tab === "products" && <table><thead><tr><th>Sản phẩm</th><th>Giá bán</th><th>Tồn</th><th>Mức nhắc</th><th /></tr></thead><tbody>{catalog.products.map((item) => <tr key={item.id}><td><strong>{item.name}</strong><small>{item.sku} · {item.unit}</small></td><td>{formatVnd(item.sale_price)}</td><td className={item.stock_on_hand <= item.reorder_level ? "is-warning" : ""}>{item.stock_on_hand}</td><td>{item.reorder_level}</td><td><button className="admin-text-button" onClick={() => setAdjustment({ productId: item.id, name: item.name, quantity: "", note: "" })}>Điều chỉnh</button></td></tr>)}</tbody></table>}
        {tab === "services" && <table><thead><tr><th>Dịch vụ</th><th>Thời lượng</th><th>Giá</th><th>Trạng thái</th></tr></thead><tbody>{catalog.services.map((item) => <tr key={item.id}><td><strong>{item.name}</strong></td><td>{item.duration_minutes} phút</td><td>{formatVnd(item.price)}</td><td>{item.is_bookable ? "Đang bán" : "Tạm ngưng"}</td></tr>)}</tbody></table>}
        {tab === "packages" && <table><thead><tr><th>Gói dịch vụ</th><th>Giá</th><th>Trạng thái</th></tr></thead><tbody>{catalog.packages.map((item) => <tr key={item.id}><td><strong>{item.name}</strong></td><td>{formatVnd(item.sale_price)}</td><td>{item.is_active ? "Đang bán" : "Tạm ngưng"}</td></tr>)}</tbody></table>}
        {tab === "suppliers" && <table><thead><tr><th>Nhà cung cấp</th><th>Điện thoại</th><th>Email</th></tr></thead><tbody>{catalog.suppliers.map((item) => <tr key={item.id}><td><strong>{item.name}</strong></td><td>{item.phone || "—"}</td><td>{item.email || "—"}</td></tr>)}</tbody></table>}
      </div>
      {adjustment && <form className="admin-inline-adjustment" onSubmit={saveAdjustment}><div><strong>Điều chỉnh tồn: {adjustment.name}</strong><small>Dùng số dương để nhập thêm, số âm để xuất/hao hụt.</small></div><label>Số lượng<input required type="number" step="1" value={adjustment.quantity} onChange={(event) => setAdjustment({ ...adjustment, quantity: event.target.value })} /></label><label>Lý do<input required value={adjustment.note} onChange={(event) => setAdjustment({ ...adjustment, note: event.target.value })} /></label><button className="admin-button">Lưu điều chỉnh</button><button type="button" className="admin-text-button" onClick={() => setAdjustment(null)}>Hủy</button></form>}
    </section>
    <aside className="admin-panel admin-form-panel">
      {tab === "products" && <><p className="admin-kicker">Kho hàng</p><h2>Thêm sản phẩm</h2><form className="admin-form-stack" onSubmit={saveProduct}><label>Mã sản phẩm<input required value={productForm.sku} onChange={(event) => setProductForm({ ...productForm, sku: event.target.value })} placeholder="VD: WD-POM-01" /></label><label>Tên sản phẩm<input required value={productForm.name} onChange={(event) => setProductForm({ ...productForm, name: event.target.value })} /></label><div className="admin-form-pair"><label>Giá bán<input required type="number" min="0" value={productForm.salePrice} onChange={(event) => setProductForm({ ...productForm, salePrice: event.target.value })} /></label><label>Giá vốn<input type="number" min="0" value={productForm.costPrice} onChange={(event) => setProductForm({ ...productForm, costPrice: event.target.value })} /></label></div><div className="admin-form-pair"><label>Tồn đầu<input type="number" min="0" value={productForm.openingStock} onChange={(event) => setProductForm({ ...productForm, openingStock: event.target.value })} /></label><label>Mức nhắc<input type="number" min="0" value={productForm.reorderLevel} onChange={(event) => setProductForm({ ...productForm, reorderLevel: event.target.value })} /></label></div><label>Đơn vị<input value={productForm.unit} onChange={(event) => setProductForm({ ...productForm, unit: event.target.value })} /></label><button className="admin-button">Lưu sản phẩm</button></form></>}
      {tab === "packages" && <><p className="admin-kicker">Gói bán hàng</p><h2>Thêm gói</h2><form className="admin-form-stack" onSubmit={savePackage}><label>Tên gói<input required value={packageForm.name} onChange={(event) => setPackageForm({ ...packageForm, name: event.target.value })} placeholder="VD: Gói chăm sóc tháng" /></label><label>Giá gói<input required type="number" min="0" value={packageForm.salePrice} onChange={(event) => setPackageForm({ ...packageForm, salePrice: event.target.value })} /></label><label>Mô tả<textarea rows={4} value={packageForm.description} onChange={(event) => setPackageForm({ ...packageForm, description: event.target.value })} /></label><button className="admin-button">Lưu gói</button></form></>}
      {tab === "suppliers" && <><p className="admin-kicker">Nguồn hàng</p><h2>Thêm nhà cung cấp</h2><form className="admin-form-stack" onSubmit={saveSupplier}><label>Tên nhà cung cấp<input required value={supplierForm.name} onChange={(event) => setSupplierForm({ ...supplierForm, name: event.target.value })} /></label><label>Điện thoại<input value={supplierForm.phone} onChange={(event) => setSupplierForm({ ...supplierForm, phone: event.target.value })} /></label><label>Email<input type="email" value={supplierForm.email} onChange={(event) => setSupplierForm({ ...supplierForm, email: event.target.value })} /></label><label>Địa chỉ<input value={supplierForm.address} onChange={(event) => setSupplierForm({ ...supplierForm, address: event.target.value })} /></label><label>Ghi chú<textarea rows={2} value={supplierForm.note} onChange={(event) => setSupplierForm({ ...supplierForm, note: event.target.value })} /></label><button className="admin-button">Lưu nhà cung cấp</button></form></>}
      {tab === "services" && <><p className="admin-kicker">Dịch vụ gốc</p><h2>Quản lý dịch vụ</h2><p className="admin-muted">Dịch vụ đang dùng chung với trang đặt lịch WINDREAD. Chỉnh giá và thời lượng trong cấu hình dịch vụ hiện có để lịch hẹn và POS luôn khớp nhau.</p></>}
    </aside>
  </div>;
}

export default function CatalogPage() { return <AdminFrame title="Dịch vụ & kho" eyebrow="Danh mục đúng để thu ngân không nhầm giá"><CatalogContent /></AdminFrame>; }
