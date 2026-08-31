"use client";

import { Suspense, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "../../../lib/supabase/client";
import { authIdentifier } from "../../../lib/admin/login";

function AdminLoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true); setMessage("");
    try {
      const { error } = await createClient().auth.signInWithPassword({ email: authIdentifier(loginId), password });
      if (error) throw error;
      router.replace(params.get("next") || "/admin/bookings");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Không thể đăng nhập.");
    } finally { setSaving(false); }
  }
  return <main className="admin-login"><section><p className="admin-kicker">WINDREAD / OPERATIONS</p><h1>Quản trị barber</h1><p className="admin-login-copy">Thu ngân, lịch hẹn, sổ quỹ và lương thưởng cho hai cơ sở.</p><form onSubmit={submit}><label>ID đăng nhập<input type="text" autoComplete="username" required value={loginId} onChange={(event) => setLoginId(event.target.value)} placeholder="vd: thu-ngan-01" /></label><label>Mật khẩu<input type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} placeholder="••••••••" /></label>{message && <p className="admin-form-error">{message}</p>}<button className="admin-button" disabled={saving}>{saving ? "Đang kiểm tra…" : "Vào Admin"}</button></form><p className="admin-login-help">Chưa có Admin? <Link href="/admin/setup">Thiết lập chủ hệ thống lần đầu</Link>.</p></section><aside><span className="admin-login-orbit orbit-a"/><span className="admin-login-orbit orbit-b"/><Image className="admin-login-mark" src="/images/windread-mark.png" alt="WINDREAD" width={1420} height={1414} priority /><small>WINDREAD<br/>BARBER CLUB</small></aside></main>;
}

export default function AdminLoginPage() {
  return <Suspense fallback={<main className="admin-gate"><div className="admin-loading-block" /></main>}><AdminLoginForm /></Suspense>;
}
