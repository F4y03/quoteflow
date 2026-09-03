"use client";

import { FormEvent, useState } from "react";
import { KeyRound, LockKeyhole, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";

export function AdminLogin() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setLoading(true);
    try {
      const response = await fetch("/api/it-support/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token }) });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error || "เข้าสู่ระบบไม่สำเร็จ");
      router.replace("/it-support/settings"); router.refresh();
    } catch (cause) { setError(cause instanceof Error ? cause.message : "เข้าสู่ระบบไม่สำเร็จ"); }
    finally { setLoading(false); }
  }
  return <main className="its-shell its-login-shell"><form className="its-login-card" onSubmit={submit}><span className="its-login-icon"><ShieldCheck aria-hidden="true" size={28} /></span><p className="its-kicker">พื้นที่สำหรับผู้ดูแล</p><h1>เข้าสู่ระบบตั้งค่าระบบ</h1><p>ใช้รหัสที่กำหนดใน <code>IT_SUPPORT_ADMIN_TOKEN</code> เพื่อเข้าถึงการตั้งค่า</p><label><KeyRound aria-hidden="true" size={18} />รหัสผู้ดูแลระบบ<input type="password" autoComplete="current-password" autoFocus value={token} onChange={(event) => setToken(event.target.value)} required /></label>{error && <div className="its-login-error" role="alert"><LockKeyhole aria-hidden="true" size={17} />{error}</div>}<button className="its-primary" disabled={loading}>{loading ? "กำลังตรวจสอบ…" : "เข้าสู่ระบบ"}</button><a href="/it-support">กลับสู่หน้า IT Support</a></form></main>;
}
