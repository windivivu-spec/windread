"use client";

import { useState } from "react";
import { toDateInputValue } from "../../booking/availabilityUtils";
import type { Branch } from "../../booking/types";

export type AdminTimeOff = {
  id: string;
  barber_id: string;
  start_time: string;
  end_time: string;
  all_day: boolean;
  note: string;
  created_at: string;
};

type BarberOption = { id: string; branchId: string; name: string };
type Draft = { barberId: string; dateFrom: string; dateTo: string; allDay: boolean; startHour: string; endHour: string; note: string };
type Conflict = { id: string; start_time: string; customer_name: string };

function localTime(iso: string) {
  return new Intl.DateTimeFormat("vi-VN", { timeZone: "Asia/Ho_Chi_Minh", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(new Date(iso));
}

function dateLabel(iso: string) {
  return new Intl.DateTimeFormat("vi-VN", { timeZone: "Asia/Ho_Chi_Minh", day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(iso));
}

function toDraft(item: AdminTimeOff): Draft {
  const lastInstant = item.all_day ? new Date(new Date(item.end_time).getTime() - 1) : new Date(item.end_time);
  return {
    barberId: item.barber_id,
    dateFrom: toDateInputValue(new Date(item.start_time)),
    dateTo: toDateInputValue(lastInstant),
    allDay: item.all_day,
    startHour: localTime(item.start_time),
    endHour: localTime(item.end_time),
    note: item.note
  };
}

export function TimeOffPanel({ items, barbers, branches, selectedDate, selectedBarberId, selectedBranchId, canManage, loadError, onRefresh }: {
  items: AdminTimeOff[];
  barbers: BarberOption[];
  branches: Branch[];
  selectedDate: string;
  selectedBarberId: string;
  selectedBranchId: string;
  canManage: boolean;
  loadError: string;
  onRefresh: () => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft>({ barberId: "", dateFrom: selectedDate, dateTo: selectedDate, allDay: true, startHour: "09:00", endHour: "18:00", note: "" });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [conflicts, setConflicts] = useState<Conflict[]>([]);
  const visibleBarbers = barbers.filter((barber) => selectedBranchId === "all" || barber.branchId === selectedBranchId);
  const visibleItems = items.filter((item) => {
    const barber = barbers.find((candidate) => candidate.id === item.barber_id);
    return barber && (selectedBranchId === "all" || barber.branchId === selectedBranchId) &&
      (selectedBarberId === "all" || selectedBarberId === item.barber_id) &&
      (new Date(item.end_time) >= new Date(`${selectedDate}T00:00:00+07:00`));
  }).slice(0, 12);

  function startNew() {
    setDraft({ barberId: selectedBarberId !== "all" ? selectedBarberId : visibleBarbers[0]?.id ?? "", dateFrom: selectedDate, dateTo: selectedDate, allDay: true, startHour: "09:00", endHour: "18:00", note: "" });
    setEditingId(null);
    setMessage("");
    setConflicts([]);
    setOpen(true);
  }

  function startEdit(item: AdminTimeOff) {
    setDraft(toDraft(item));
    setEditingId(item.id);
    setMessage("");
    setConflicts([]);
    setOpen(true);
  }

  async function save() {
    setSaving(true);
    setMessage("");
    setConflicts([]);
    try {
      const response = await fetch("/api/admin/time-off", {
        method: editingId ? "PATCH" : "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...draft, id: editingId })
      });
      const result = await response.json() as { message?: string; conflicts?: Conflict[] };
      if (!response.ok) {
        setConflicts(result.conflicts ?? []);
        throw new Error(result.message || "Không lưu được ngày nghỉ.");
      }
      await onRefresh();
      setOpen(false);
      setEditingId(null);
      setMessage("Đã lưu ngày nghỉ. Các giờ đặt online trùng khoảng này đã được ẩn.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Không lưu được ngày nghỉ.");
    } finally {
      setSaving(false);
    }
  }

  async function remove(item: AdminTimeOff) {
    if (!window.confirm(`Gỡ ngày nghỉ của ${barbers.find((barber) => barber.id === item.barber_id)?.name ?? "thợ"}?`)) return;
    setSaving(true);
    setMessage("");
    try {
      const response = await fetch(`/api/admin/time-off?id=${encodeURIComponent(item.id)}`, { method: "DELETE" });
      const result = await response.json() as { message?: string };
      if (!response.ok) throw new Error(result.message || "Không gỡ được ngày nghỉ.");
      await onRefresh();
      setMessage("Đã gỡ ngày nghỉ.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Không gỡ được ngày nghỉ.");
    } finally {
      setSaving(false);
    }
  }

  return <section className="admin-time-off-panel" aria-label="Ngày nghỉ của thợ">
    <div className="admin-walk-in-heading">
      <div><p className="admin-kicker">Lịch làm việc</p><h2>Ngày nghỉ của thợ</h2><p>Đặt trước ngày nghỉ hoặc giờ nghỉ; lịch online sẽ ẩn giờ trùng. Mỗi lần đặt tối đa 31 ngày.</p></div>
      {canManage && <button type="button" className="admin-button" onClick={() => open ? setOpen(false) : startNew()}>{open ? "Đóng" : "Đặt ngày nghỉ"}</button>}
    </div>
    {open && canManage && <div className="admin-time-off-form">
      <label>Thợ<select value={draft.barberId} onChange={(event) => setDraft({ ...draft, barberId: event.target.value })}>
        <option value="">Chọn thợ</option>{visibleBarbers.map((barber) => <option key={barber.id} value={barber.id}>{barber.name} · {branches.find((branch) => branch.id === barber.branchId)?.name}</option>)}
      </select></label>
      <label>Từ ngày<input type="date" value={draft.dateFrom} onChange={(event) => setDraft({ ...draft, dateFrom: event.target.value, dateTo: draft.allDay && event.target.value > draft.dateTo ? event.target.value : draft.dateTo })} /></label>
      {draft.allDay && <label>Đến hết ngày<input type="date" min={draft.dateFrom} value={draft.dateTo} onChange={(event) => setDraft({ ...draft, dateTo: event.target.value })} /></label>}
      <label className="admin-time-off-all-day"><input type="checkbox" checked={draft.allDay} onChange={(event) => setDraft({ ...draft, allDay: event.target.checked, dateTo: event.target.checked ? draft.dateTo : draft.dateFrom })} /> Nghỉ cả ngày</label>
      {!draft.allDay && <><label>Từ giờ<input type="time" value={draft.startHour} onChange={(event) => setDraft({ ...draft, startHour: event.target.value })} /></label><label>Đến giờ<input type="time" value={draft.endHour} onChange={(event) => setDraft({ ...draft, endHour: event.target.value })} /></label></>}
      <label className="admin-time-off-note">Ghi chú <span>(tùy chọn)</span><input maxLength={160} value={draft.note} onChange={(event) => setDraft({ ...draft, note: event.target.value })} placeholder="Ví dụ: nghỉ phép, việc riêng" /></label>
      <button type="button" className="admin-button" disabled={saving || !draft.barberId || !draft.dateFrom || !draft.dateTo} onClick={save}>{saving ? "Đang lưu…" : editingId ? "Lưu thay đổi" : "Lưu ngày nghỉ"}</button>
      {conflicts.length > 0 && <div className="admin-time-off-conflicts"><strong>Cần xử lý {conflicts.length} lịch khách trước:</strong><ul>{conflicts.map((booking) => <li key={booking.id}>{booking.customer_name} · {dateLabel(booking.start_time)} {localTime(booking.start_time)} · {booking.id}</li>)}</ul></div>}
    </div>}
    {loadError && <p className="admin-inline-alert" role="alert">{loadError}</p>}
    {message && <p className="admin-inline-alert" role="status">{message}</p>}
    <div className="admin-time-off-list">
      {visibleItems.map((item) => {
        const barber = barbers.find((candidate) => candidate.id === item.barber_id);
        const lastDay = item.all_day ? new Date(new Date(item.end_time).getTime() - 1).toISOString() : item.end_time;
        return <article key={item.id}>
          <div><strong>{barber?.name ?? item.barber_id}</strong><span>{item.all_day ? `Cả ngày · ${dateLabel(item.start_time)}${dateLabel(lastDay) !== dateLabel(item.start_time) ? ` – ${dateLabel(lastDay)}` : ""}` : `${dateLabel(item.start_time)} · ${localTime(item.start_time)}–${localTime(item.end_time)}`}</span>{item.note && <small>{item.note}</small>}</div>
          {canManage && <div className="admin-time-off-actions"><button type="button" disabled={saving} onClick={() => startEdit(item)}>Sửa</button><button type="button" disabled={saving} onClick={() => remove(item)}>Gỡ</button></div>}
        </article>;
      })}
      {!visibleItems.length && !loadError && <p className="admin-time-off-empty">Chưa có ngày nghỉ từ ngày đang xem.</p>}
    </div>
  </section>;
}
