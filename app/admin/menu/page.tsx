"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { adminFetch, formatVnd } from "../admin-ui";
import { AdminFrame, useAdminSession } from "../components/AdminFrame";

type Category = "barber" | "dreadlocks" | "braids" | "afro";
type MenuService = {
  id: string;
  branch_id: string;
  name: string;
  description: string;
  price: number;
  price_label: string | null;
  service_category: Category;
  duration_minutes: number;
  is_bookable: boolean;
  menu_order: number | null;
  menu_group: string;
  menu_position: number;
};
type ServiceDraft = {
  id?: string;
  branchId: string;
  name: string;
  description: string;
  price: string;
  priceLabel: string;
  category: Category;
  durationMinutes: string;
  isBookable: boolean;
};
type Visibility = "all" | "active" | "paused";

const categoryLabels: Record<Category, string> = {
  barber: "Barber",
  dreadlocks: "Dreadlocks",
  braids: "Braids",
  afro: "Afro"
};
const categories = Object.keys(categoryLabels) as Category[];

function emptyDraft(branchId: string): ServiceDraft {
  return { branchId: branchId === "all" ? "" : branchId, name: "", description: "", price: "", priceLabel: "", category: "barber", durationMinutes: "45", isBookable: true };
}

function MenuContent() {
  const { branchId: workspaceBranchId, branches } = useAdminSession();
  const [selectedBranchId, setSelectedBranchId] = useState("");
  const [services, setServices] = useState<MenuService[]>([]);
  const [category, setCategory] = useState<Category | "all">("all");
  const [visibility, setVisibility] = useState<Visibility>("all");
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState<ServiceDraft | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!branches.length) return;
    if (workspaceBranchId !== "all" && branches.some((branch) => branch.id === workspaceBranchId)) {
      setSelectedBranchId(workspaceBranchId);
      return;
    }
    setSelectedBranchId((current) => branches.some((branch) => branch.id === current) ? current : branches[0].id);
  }, [branches, workspaceBranchId]);

  const load = useCallback(async () => {
    if (!selectedBranchId) return;
    setLoading(true);
    setError("");
    try {
      const result = await adminFetch<{ services: MenuService[] }>(`/api/admin/menu?branchId=${encodeURIComponent(selectedBranchId)}`);
      setServices(result.services);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Không tải được menu dịch vụ.");
    } finally {
      setLoading(false);
    }
  }, [selectedBranchId]);

  useEffect(() => { void load(); }, [load]);

  useEffect(() => {
    if (!draft) return;
    function handleDialogKeys(event: KeyboardEvent) {
      if (event.key === "Escape" && !saving) {
        setDraft(null);
        return;
      }
      if (event.key !== "Tab") return;
      const dialog = document.querySelector<HTMLElement>(".admin-menu-modal");
      if (!dialog) return;
      const controls = [...dialog.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])')];
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }
    document.addEventListener("keydown", handleDialogKeys);
    return () => document.removeEventListener("keydown", handleDialogKeys);
  }, [draft, saving]);

  const visibleServices = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("vi");
    return services.filter((service) => {
      if (category !== "all" && service.service_category !== category) return false;
      if (visibility === "active" && !service.is_bookable) return false;
      if (visibility === "paused" && service.is_bookable) return false;
      if (!query) return true;
      return `${service.name} ${service.description}`.toLocaleLowerCase("vi").includes(query);
    });
  }, [category, search, services, visibility]);

  const activeCount = services.filter((service) => service.is_bookable).length;
  const pausedCount = services.length - activeCount;
  const usedCategoryCount = new Set(services.map((service) => service.service_category)).size;

  function beginEdit(service: MenuService) {
    setMessage("");
    setDraft({
      id: service.id,
      branchId: service.branch_id,
      name: service.name,
      description: service.description,
      price: String(service.price),
      priceLabel: service.price_label ?? "",
      category: service.service_category,
      durationMinutes: String(service.duration_minutes),
      isBookable: service.is_bookable
    });
  }

  async function saveService(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft) return;
    setSaving(true);
    setMessage("");
    setError("");
    try {
      await adminFetch("/api/admin/menu", {
        method: "POST",
        body: JSON.stringify({ action: draft.id ? "update" : "create", ...draft, price: Number(draft.price), durationMinutes: Number(draft.durationMinutes) })
      });
      setDraft(null);
      setMessage(draft.id ? `Đã cập nhật “${draft.name}”.` : `Đã thêm “${draft.name}” vào menu.`);
      await load();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Không thể lưu dịch vụ.");
    } finally {
      setSaving(false);
    }
  }

  async function setBookable(service: MenuService) {
    const nextStatus = !service.is_bookable;
    if (!nextStatus && !window.confirm(`Tạm ngưng “${service.name}”? Dịch vụ sẽ rời khỏi trang đặt lịch mới; các lịch sử cũ vẫn được giữ.`)) return;
    setError("");
    setMessage("");
    try {
      await adminFetch("/api/admin/menu", {
        method: "POST",
        body: JSON.stringify({
          action: "update", id: service.id, branchId: service.branch_id,
          name: service.name, description: service.description, price: service.price,
          priceLabel: service.price_label ?? "", category: service.service_category,
          durationMinutes: service.duration_minutes, isBookable: nextStatus
        })
      });
      setMessage(nextStatus ? `Đã mở lại “${service.name}”.` : `Đã tạm ngưng “${service.name}”.`);
      await load();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Không thể đổi trạng thái dịch vụ.");
    }
  }

  async function moveService(service: MenuService, direction: -1 | 1) {
    const siblings = services
      .filter((item) => item.branch_id === service.branch_id && item.menu_group === service.menu_group)
      .sort((a, b) => a.menu_position - b.menu_position);
    const currentIndex = siblings.findIndex((item) => item.id === service.id);
    const targetIndex = currentIndex + direction;
    if (currentIndex < 0 || targetIndex < 0 || targetIndex >= siblings.length) return;
    [siblings[currentIndex], siblings[targetIndex]] = [siblings[targetIndex], siblings[currentIndex]];
    setSaving(true);
    setError("");
    setMessage("");
    try {
      await adminFetch("/api/admin/menu", {
        method: "POST",
        body: JSON.stringify({ action: "reorder", branchId: service.branch_id, category: service.service_category, serviceIds: siblings.map((item) => item.id) })
      });
      setMessage(`Đã đổi thứ tự trong nhóm ${categoryLabels[service.service_category]}.`);
      await load();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Không thể đổi thứ tự menu.");
    } finally {
      setSaving(false);
    }
  }

  const branchName = (id: string) => branches.find((branch) => branch.id === id)?.name ?? id;

  return <>
    <div className="admin-menu-intro">
      <div>
        <p className="admin-kicker">NỘI DUNG HIỂN THỊ TRÊN WEBSITE</p>
        <h2>Menu dịch vụ & bảng giá</h2>
        <p>Chỉnh dịch vụ một lần, menu đặt lịch và bảng giá sẽ dùng cùng dữ liệu.</p>
      </div>
      <button className="admin-button" disabled={saving || !selectedBranchId} onClick={() => { setMessage(""); setDraft(emptyDraft(selectedBranchId)); }}>+ Thêm dịch vụ</button>
    </div>

    <section className="admin-menu-metrics" aria-label="Tổng quan menu">
      <article><span>Đang mở đặt lịch</span><strong>{activeCount}</strong><small>dịch vụ trên menu</small></article>
      <article><span>Tạm ngưng</span><strong>{pausedCount}</strong><small>vẫn giữ lịch sử cũ</small></article>
      <article><span>Nhóm dịch vụ</span><strong>{usedCategoryCount}</strong><small>Barber, locs, braids, afro</small></article>
    </section>

    <section className="admin-panel admin-menu-panel">
      <header className="admin-menu-toolbar">
        <div><p className="admin-kicker">DANH SÁCH MENU</p><h2>{branchName(selectedBranchId)}</h2></div>
        <label className="admin-menu-branch-filter">Cơ sở<select value={selectedBranchId} disabled={saving} onChange={(event) => { setSelectedBranchId(event.target.value); setDraft(null); setMessage(""); setError(""); }} aria-label="Lọc menu theo cơ sở">{branches.map((branch) => <option key={branch.id} value={branch.id}>{branch.name}</option>)}</select></label>
        <label className="admin-menu-search">Tìm dịch vụ<input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Tên hoặc mô tả" /></label>
      </header>

      <div className="admin-menu-controls">
        <div className="admin-menu-filters" aria-label="Lọc nhóm dịch vụ">
          <button className={category === "all" ? "is-active" : ""} onClick={() => setCategory("all")}>Tất cả nhóm</button>
          {categories.map((item) => <button key={item} className={category === item ? "is-active" : ""} onClick={() => setCategory(item)}>{categoryLabels[item]}</button>)}
        </div>
        <label className="admin-menu-status-filter"><span>Trạng thái</span><select value={visibility} onChange={(event) => setVisibility(event.target.value as Visibility)}><option value="all">Tất cả</option><option value="active">Đang mở</option><option value="paused">Tạm ngưng</option></select></label>
      </div>

      {message && <p className="admin-form-success" role="status">{message}</p>}
      {error && <p className="admin-form-error" role="alert">{error}</p>}
      {loading ? <div className="admin-menu-loading" role="status">Đang tải menu…</div> : visibleServices.length ? (
        <div className="admin-menu-list">
          {visibleServices.map((service, index) => {
            const siblings = services.filter((item) => item.branch_id === service.branch_id && item.menu_group === service.menu_group)
              .sort((a, b) => a.menu_position - b.menu_position);
            const position = siblings.findIndex((item) => item.id === service.id);
            const previous = visibleServices[index - 1];
            return <div className="admin-menu-entry" key={service.id}>
              {(!previous || previous.branch_id !== service.branch_id || previous.menu_group !== service.menu_group) && <div className="admin-menu-group-heading"><strong>{service.menu_group}</strong></div>}
              <article className={`admin-menu-row${service.is_bookable ? "" : " is-paused"}`}>
              <div className="admin-menu-order" aria-label={`Vị trí ${position + 1}`}>
                <button aria-label={`Đưa ${service.name} lên`} disabled={saving || position <= 0} onClick={() => void moveService(service, -1)}>↑</button>
                <span>{String(position + 1).padStart(2, "0")}</span>
                <button aria-label={`Đưa ${service.name} xuống`} disabled={saving || position >= siblings.length - 1} onClick={() => void moveService(service, 1)}>↓</button>
              </div>
              <div className="admin-menu-service-copy">
                <div className="admin-menu-title-line"><h3>{service.name}</h3><span className={`admin-status ${service.is_bookable ? "is-open" : "is-closed"}`}>{service.is_bookable ? "Đang mở" : "Tạm ngưng"}</span></div>
                <p>{service.description || "Chưa có mô tả."}</p>
                <div className="admin-menu-meta"><span>{categoryLabels[service.service_category]}</span><span>{service.duration_minutes} phút</span></div>
              </div>
              <div className="admin-menu-price"><strong>{service.price_label || formatVnd(service.price)}</strong><small>{formatVnd(service.price)}</small></div>
              <div className="admin-menu-actions">
                <button className="admin-text-button" disabled={saving} onClick={() => beginEdit(service)}>Chỉnh sửa</button>
                <button className="admin-text-button" disabled={saving} onClick={() => void setBookable(service)}>{service.is_bookable ? "Tạm ngưng" : "Mở lại"}</button>
              </div>
              </article>
            </div>;
          })}
        </div>
      ) : <div className="admin-menu-empty"><strong>Chưa có dịch vụ phù hợp.</strong><span>Thử đổi bộ lọc hoặc thêm dịch vụ mới cho chi nhánh.</span></div>}
      <p className="admin-menu-footnote">Tạm ngưng sẽ ẩn dịch vụ khỏi đặt lịch mới. Lịch hẹn cũ vẫn giữ nguyên để tra cứu.</p>
    </section>

    {draft && <div className="admin-menu-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget && !saving) setDraft(null); }}>
      <section className="admin-menu-modal" role="dialog" aria-modal="true" aria-labelledby="menu-editor-title">
        <header><div><p className="admin-kicker">{draft.id ? "CẬP NHẬT MENU" : "MENU MỚI"}</p><h2 id="menu-editor-title">{draft.id ? "Chỉnh sửa dịch vụ" : "Thêm dịch vụ"}</h2></div><button type="button" className="admin-menu-close" aria-label="Đóng" disabled={saving} onClick={() => setDraft(null)}>×</button></header>
        <form className="admin-form-stack" onSubmit={saveService}>
          {!draft.id && <label>Cơ sở<input readOnly value={branchName(draft.branchId)} /></label>}
          <label>Tên dịch vụ<input autoFocus required maxLength={120} value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} /></label>
          <label>Mô tả<textarea required rows={3} maxLength={600} value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} /></label>
          <label>Nhóm dịch vụ<select value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value as Category })}>{categories.map((item) => <option key={item} value={item}>{categoryLabels[item]}</option>)}</select></label>
          <div className="admin-form-pair"><label>Giá (đ)<input required type="number" min="0" step="1000" inputMode="numeric" value={draft.price} onChange={(event) => setDraft({ ...draft, price: event.target.value })} /></label><label>Thời lượng (phút)<input required type="number" min="1" step="5" inputMode="numeric" value={draft.durationMinutes} onChange={(event) => setDraft({ ...draft, durationMinutes: event.target.value })} /></label></div>
          <label>Nhãn giá hiển thị <small>Để trống nếu giá cố định.</small><input maxLength={80} value={draft.priceLabel} onChange={(event) => setDraft({ ...draft, priceLabel: event.target.value })} placeholder="VD: Từ 250.000đ" /></label>
          <label className="admin-menu-toggle"><input type="checkbox" checked={draft.isBookable} onChange={(event) => setDraft({ ...draft, isBookable: event.target.checked })} /><span><strong>Hiển thị để khách đặt lịch</strong><small>Tắt để tạm ngưng; lịch sử hiện có vẫn được giữ.</small></span></label>
          <div className="admin-menu-modal-actions"><button type="button" className="admin-menu-cancel" disabled={saving} onClick={() => setDraft(null)}>Hủy</button><button className="admin-button" disabled={saving}>{saving ? "Đang lưu…" : "Lưu dịch vụ"}</button></div>
        </form>
      </section>
    </div>}
  </>;
}

export default function MenuPage() {
  return <AdminFrame title="Menu & giá" eyebrow="Quản lý menu công khai" showBranchSelector={false}><MenuContent /></AdminFrame>;
}
