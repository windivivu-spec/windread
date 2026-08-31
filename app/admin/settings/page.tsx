"use client";

import { FormEvent, useEffect, useState } from "react";
import { adminFetch } from "../admin-ui";
import { AdminFrame } from "../components/AdminFrame";

type Data = {
  profiles: Array<{ id: string; login_id: string | null; display_name: string; role: string; barber_id: string | null; is_active: boolean; staff_branch_access: Array<{ branch_id: string }> | null }>;
  barbers: Array<{ id: string; name: string; branch_id: string; title: string }>;
  branches: Array<{ id: string; name: string }>;
};

const emptyForm = { displayName: "", loginId: "", password: "", role: "cashier", barberId: "", branchIds: [] as string[] };

function Settings() {
  const [data, setData] = useState<Data | null>(null);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState(emptyForm);
  const load = () => adminFetch<Data>("/api/admin/staff").then(setData).catch((reason: unknown) => setMessage(reason instanceof Error ? reason.message : "Không tải được phân quyền."));
  useEffect(() => { load(); }, []);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await adminFetch("/api/admin/staff", { method: "POST", body: JSON.stringify({ action: "create", ...form, barberId: form.barberId || null }) });
      setForm(emptyForm);
      setMessage("Đã tạo tài khoản và thiết lập quyền truy cập.");
      load();
    } catch (reason) { setMessage(reason instanceof Error ? reason.message : "Không thể tạo tài khoản."); }
  }
  return <div className="admin-two-column">
    <section className="admin-panel">
      <header><div><p className="admin-kicker">Quyền truy cập</p><h2>Tài khoản nhân viên</h2></div></header>
      {message && <p className={message.startsWith("Đã") ? "admin-form-success" : "admin-form-error"}>{message}</p>}
      <div className="admin-table-wrap"><table><thead><tr><th>ID đăng nhập</th><th>Họ tên</th><th>Vai trò</th><th>Chi nhánh</th><th>Trạng thái</th></tr></thead><tbody>{data?.profiles.map((profile) => <tr key={profile.id}><td><strong>{profile.login_id || "Chưa đặt"}</strong></td><td>{profile.display_name}</td><td>{profile.role === "admin" ? "Chủ / Admin" : profile.role === "manager" ? "Quản lý" : profile.role === "cashier" ? "Thu ngân" : "Nhân viên"}</td><td>{profile.role === "admin" ? "Tất cả" : profile.staff_branch_access?.map((access) => data.branches.find((branch) => branch.id === access.branch_id)?.name || access.branch_id).join(", ") || "Chưa cấp"}</td><td>{profile.is_active ? "Đang hoạt động" : "Tạm khóa"}</td></tr>)}</tbody></table></div>
      <div className="admin-role-notes"><p><strong>Admin</strong> quản lý mọi chi nhánh và tài khoản.</p><p><strong>Quản lý</strong> vận hành chi nhánh được cấp; <strong>Thu ngân</strong> xử lý hóa đơn và quỹ; <strong>Nhân viên</strong> xem lịch và thu nhập của mình.</p></div>
    </section>
    <aside className="admin-panel admin-form-panel"><p className="admin-kicker">Tài khoản mới</p><h2>Tạo nhân viên</h2><p className="admin-login-copy">Chỉ cần ID và mật khẩu. Không gửi email.</p><form className="admin-form-stack" onSubmit={submit}>
      <label>Họ tên<input required value={form.displayName} onChange={(event) => setForm({ ...form, displayName: event.target.value })} /></label>
      <label>ID đăng nhập<input required pattern="[a-zA-Z0-9][a-zA-Z0-9._-]{2,47}" value={form.loginId} onChange={(event) => setForm({ ...form, loginId: event.target.value })} placeholder="vd: thu-ngan-01" /></label>
      <label>Mật khẩu<input required type="password" minLength={12} value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="Tối thiểu 12 ký tự" /></label>
      <label>Vai trò<select value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value, branchIds: event.target.value === "admin" ? [] : form.branchIds })}><option value="cashier">Thu ngân</option><option value="manager">Quản lý</option><option value="employee">Nhân viên</option><option value="admin">Chủ / Admin</option></select></label>
      <label>Liên kết barber (nếu có)<select value={form.barberId} onChange={(event) => setForm({ ...form, barberId: event.target.value })}><option value="">Không liên kết</option>{data?.barbers.map((barber) => <option key={barber.id} value={barber.id}>{barber.name} · {data.branches.find((branch) => branch.id === barber.branch_id)?.name}</option>)}</select></label>
      {form.role !== "admin" && <fieldset className="admin-check-list"><legend>Được dùng tại</legend>{data?.branches.map((branch) => <label key={branch.id}><input type="checkbox" checked={form.branchIds.includes(branch.id)} onChange={(event) => setForm({ ...form, branchIds: event.target.checked ? [...form.branchIds, branch.id] : form.branchIds.filter((id) => id !== branch.id) })} />{branch.name}</label>)}</fieldset>}
      <button className="admin-button">Tạo tài khoản</button>
    </form></aside>
  </div>;
}

export default function SettingsPage() { return <AdminFrame title="Cài đặt" eyebrow="Tài khoản và phân quyền"><Settings /></AdminFrame>; }
