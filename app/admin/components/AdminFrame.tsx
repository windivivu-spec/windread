"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { createClient } from "../../../lib/supabase/client";

type Role = "admin" | "manager" | "cashier" | "employee";
type Branch = { id: string; name: string; address: string; phone: string };
type Session = { user: { id: string; displayName: string; role: Role; barberId: string | null; branchIds: string[] }; branches: Branch[] };
type AdminSessionValue = Session & { branchId: string; setBranchId: (branchId: string) => void; reload: () => void };

const AdminSessionContext = createContext<AdminSessionValue | null>(null);

const navigation: Array<{ href: string; icon: string; label: string; roles: Role[] }> = [
  { href: "/admin/bookings", icon: "◷", label: "Lịch hẹn", roles: ["admin", "manager", "cashier", "employee"] },
  { href: "/admin/news", icon: "✍", label: "Bài viết", roles: ["admin", "manager"] },
  { href: "/admin/settings", icon: "◌", label: "Cài đặt", roles: ["admin"] }
];

const hiddenAdminPaths = ["/admin", "/admin/pos", "/admin/invoices", "/admin/customers", "/admin/catalog", "/admin/finance", "/admin/payroll", "/admin/reports"];

export function useAdminSession() {
  const value = useContext(AdminSessionContext);
  if (!value) throw new Error("AdminFrame chưa sẵn sàng.");
  return value;
}

export function AdminFrame({ title, eyebrow, children, actions }: { title: string; eyebrow?: string; children: ReactNode; actions?: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [branchId, setCurrentBranchId] = useState("");
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (hiddenAdminPaths.includes(pathname)) router.replace("/admin/bookings");
  }, [pathname, router]);

  useEffect(() => {
    let alive = true;
    fetch("/api/admin/session")
      .then(async (response) => {
        const body = (await response.json()) as Session & { message?: string };
        if (!response.ok) throw new Error(body.message || "Không tải được phiên đăng nhập.");
        return body;
      })
      .then((next) => {
        if (!alive) return;
        setSession(next);
        const saved = window.localStorage.getItem("windread-admin-branch");
        const canViewAll = next.user.role === "admin";
        setCurrentBranchId(canViewAll && saved === "all" ? "all" : next.branches.some((branch) => branch.id === saved) ? saved! : canViewAll ? "all" : next.branches[0]?.id ?? "");
      })
      .catch((reason: unknown) => alive && setError(reason instanceof Error ? reason.message : "Không tải được Admin."));
    return () => {
      alive = false;
    };
  }, [refreshKey]);

  const value = useMemo<AdminSessionValue | null>(() => {
    if (!session) return null;
    return {
      ...session,
      branchId,
      setBranchId: (next) => {
        setCurrentBranchId(next);
        window.localStorage.setItem("windread-admin-branch", next);
        window.dispatchEvent(new CustomEvent("windread-admin-branch-change", { detail: { branchId: next } }));
      },
      reload: () => setRefreshKey((current) => current + 1)
    };
  }, [session, branchId]);

  async function signOut() {
    try {
      await createClient().auth.signOut();
    } finally {
      router.replace("/admin/login");
      router.refresh();
    }
  }

  if (error) {
    return <main className="admin-gate"><div><p className="admin-kicker">WINDREAD / ADMIN</p><h1>Chưa thể mở khu vực vận hành</h1><p>{error}</p><Link className="admin-button" href="/admin/login">Đăng nhập lại</Link></div></main>;
  }
  if (!value) {
    return <main className="admin-gate"><div className="admin-loading-block" /><p>Đang mở bảng vận hành…</p></main>;
  }

  return (
    <AdminSessionContext.Provider value={value}>
      <div className="admin-app">
        <aside className="admin-rail" aria-label="Điều hướng quản trị">
          <Link className="admin-brand" href="/admin"><Image className="admin-brand-mark" src="/images/windread-mark.png" alt="" width={1420} height={1414} /><strong>WINDREAD</strong><small>OPERATIONS</small></Link>
          <nav>
            {navigation.filter((item) => item.roles.includes(value.user.role)).map((item) => {
              const active = item.href === "/admin" ? pathname === item.href : pathname.startsWith(item.href);
              return <Link className={active ? "is-active" : ""} href={item.href} key={item.href}><i>{item.icon}</i><span>{item.label}</span></Link>;
            })}
          </nav>
          <div className="admin-rail-foot"><span>{value.user.role === "admin" ? "Chủ hệ thống" : value.user.role === "manager" ? "Quản lý" : value.user.role === "cashier" ? "Thu ngân" : "Nhân viên"}</span><button onClick={signOut}>Đăng xuất</button></div>
        </aside>
        <section className="admin-workspace">
          <header className="admin-topbar">
            <div><p className="admin-kicker">{eyebrow || "Vận hành hôm nay"}</p><h1>{title}</h1></div>
            <div className="admin-topbar-actions">
              {value.branches.length > 1 && <label className="admin-branch-select"><span>Chi nhánh</span><select value={value.branchId} onChange={(event) => value.setBranchId(event.target.value)}>{value.user.role === "admin" && <option value="all">Tất cả chi nhánh</option>}{value.branches.map((branch) => <option key={branch.id} value={branch.id}>{branch.name}</option>)}</select></label>}
              <div className="admin-user-mark" title={value.user.displayName} aria-label={`Tài khoản ${value.user.displayName}`}>{value.user.displayName}</div>
              {actions}
            </div>
          </header>
          <main id="main-content" className="admin-main">{children}</main>
        </section>
      </div>
    </AdminSessionContext.Provider>
  );
}
