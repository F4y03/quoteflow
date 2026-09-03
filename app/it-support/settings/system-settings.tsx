"use client";

import { FormEvent, useEffect, useState } from "react";
import { AlertTriangle, ArrowLeft, CheckCircle2, Database, LockKeyhole, Network, Save, ShieldCheck } from "lucide-react";

type Settings = { allowedNetworks: string; intervalMinutes: string; demoMode: boolean };
const defaults: Settings = { allowedNetworks: "192.168.0.0/16, 10.0.0.0/8", intervalMinutes: "15", demoMode: true };

export function SystemSettings() {
  const [settings, setSettings] = useState<Settings>(defaults);
  const [databaseUrl, setDatabaseUrl] = useState("");
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("it-support-settings");
    if (!stored) return;
    try { setSettings({ ...defaults, ...JSON.parse(stored) } as Settings); } catch { localStorage.removeItem("it-support-settings"); }
  }, []);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(null);
    setIsSaving(true);
    try {
      const response = await fetch("/api/it-support/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...settings, intervalMinutes: Number(settings.intervalMinutes), databaseUrl }),
      });
      const result = await response.json() as { message?: string; error?: string };
      if (!response.ok) throw new Error(result.error || "บันทึกไฟล์ .env ไม่สำเร็จ");
      localStorage.setItem("it-support-settings", JSON.stringify(settings));
      setDatabaseUrl("");
      setStatus({ type: "success", message: result.message || "บันทึกไฟล์ .env แล้ว" });
    } catch (error) {
      setStatus({ type: "error", message: error instanceof Error ? error.message : "บันทึกไฟล์ .env ไม่สำเร็จ" });
    } finally { setIsSaving(false); }
  }

  return <main className="its-shell its-settings-shell">
    <header className="its-topbar"><a href="/it-support" className="its-brand"><span aria-hidden="true">IT</span><b>ตั้งค่าระบบ</b><small>ผู้ดูแลระบบ</small></a><div className="its-top-status"><ShieldCheck aria-hidden="true" size={17} />สิทธิ์ผู้ดูแล: ยืนยันก่อนบันทึก</div></header>
    <section className="its-settings">
      <a className="its-back" href="/it-support"><ArrowLeft aria-hidden="true" size={17} />กลับไปหน้าภาพรวม</a>
      <header><p className="its-kicker">การตั้งค่าระบบ</p><h1>ตั้งค่าการทำงานของ IT Support</h1><p>บันทึกค่าเครือข่าย รอบตรวจสอบ และโหมดทำงานลงไฟล์ <code>.env</code> บนเครื่องเซิร์ฟเวอร์โดยตรง</p></header>
      <div className="its-admin-note"><LockKeyhole aria-hidden="true" size={22} /><div><b>บันทึกได้เฉพาะผู้ดูแลระบบ</b><span>ต้องตั้ง <code>IT_SUPPORT_ADMIN_TOKEN</code> ในไฟล์ <code>.env</code> ก่อน แล้วกรอกรหัสนั้นด้านล่าง ระบบจะไม่เก็บหรือแสดงรหัสนี้</span></div></div>
      <form onSubmit={save}>
        <section className="its-settings-card"><div><Network aria-hidden="true" size={22} /><h2>ขอบเขตเครือข่ายที่อนุญาต</h2><p>กำหนดเครือข่ายที่ระบบสามารถส่งคำขอตรวจสอบได้ เพื่อป้องกันการตรวจสอบปลายทางที่ไม่เกี่ยวข้อง</p></div><label>ช่วงเครือข่าย (คั่นด้วย comma)<input value={settings.allowedNetworks} onChange={(event) => setSettings({ ...settings, allowedNetworks: event.target.value })} aria-describedby="network-help" /></label><small id="network-help">ตัวอย่าง: 192.168.0.0/16, 10.0.0.0/8</small></section>
        <section className="its-settings-card its-token-card"><div><Database aria-hidden="true" size={22} /><h2>ฐานข้อมูล PostgreSQL</h2><p>วาง DATABASE_URL เมื่อพร้อมเชื่อมฐานข้อมูลจริง ค่านี้จะเขียนลง <code>.env</code> เท่านั้นและไม่ถูกเก็บหรือแสดงในเบราว์เซอร์</p></div><label>DATABASE_URL (เว้นว่างไว้ได้)<input type="password" autoComplete="off" value={databaseUrl} onChange={(event) => setDatabaseUrl(event.target.value)} placeholder="postgresql://user:password@host:5432/it_support" /></label></section>
        <section className="its-settings-card"><div><Save aria-hidden="true" size={22} /><h2>การตรวจสอบตามรอบ</h2><p>กำหนดความถี่ของการตรวจสุขภาพอุปกรณ์ เมื่อเชื่อม Windows Agent หรือ Monitoring API แล้ว</p></div><label>ตรวจสอบทุกกี่นาที<input type="number" min="5" max="1440" value={settings.intervalMinutes} onChange={(event) => setSettings({ ...settings, intervalMinutes: event.target.value })} /></label></section>
        <section className="its-settings-card"><div><ShieldCheck aria-hidden="true" size={22} /><h2>โหมดการทำงาน</h2><p>โหมดจำลองจะแสดงผลสาธิตเท่านั้น และจะไม่รันคำสั่งหรือเชื่อมต่อเครื่องจริง</p></div><label className="its-switch"><input type="checkbox" checked={settings.demoMode} onChange={(event) => setSettings({ ...settings, demoMode: event.target.checked })} /><span>ใช้โหมดจำลอง</span></label></section>
        {status && <div className={`its-settings-status ${status.type}`} role="status">{status.type === "success" ? <CheckCircle2 aria-hidden="true" size={19} /> : <AlertTriangle aria-hidden="true" size={19} />}{status.message}</div>}
        <div className="its-settings-footer"><span>หลังบันทึก ต้องรีสตาร์ตเซิร์ฟเวอร์ 1 ครั้งเพื่อใช้ค่าใหม่</span><button type="submit" className="its-primary" disabled={isSaving}>{isSaving ? "กำลังบันทึก…" : <><Save aria-hidden="true" size={18} />บันทึกลง .env</>}</button></div>
      </form>
    </section>
  </main>;
}
