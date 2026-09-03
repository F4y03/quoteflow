"use client";

import { useMemo, useState } from "react";
import { Activity, Cable, ChevronRight, CircleAlert, Clipboard, Copy, FileText, Globe2, MonitorCog, Network, RadioTower, SearchCode, Settings, ShieldCheck, Ticket, Wrench } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { devices, healthTrend, recentTickets } from "../_lib/data";
import { networkService } from "../_lib/network-service";
import type { Device, DiagnosticResult, DnsResult, PingResult, PortResult } from "../_lib/types";
import { DeviceList } from "./device-list";
import { DiagnosticTimeline } from "./diagnostic-timeline";
import { MetricCard } from "./metric-card";
import { StatusBadge } from "./status-badge";
import { ReportWorkbench } from "./report-workbench";

type View = "dashboard" | "network" | "devices" | "reports";
type Tool = "ping" | "dns" | "port" | "ip" | "diagnostic";

const nav: Array<{ id: View; label: string; icon: typeof Activity }> = [
  { id: "dashboard", label: "ภาพรวม", icon: Activity },
  { id: "network", label: "เครื่องมือตรวจสอบ", icon: Network },
  { id: "devices", label: "อุปกรณ์ในระบบ", icon: MonitorCog },
  { id: "reports", label: "รายงานตรวจสอบ", icon: FileText },
];
const tools: Array<{ id: Tool; label: string; icon: typeof Activity; description: string }> = [
  { id: "ping", label: "ทดสอบการเชื่อมต่อ (Ping)", icon: RadioTower, description: "เช็กว่าเครื่องปลายทางตอบกลับหรือไม่" },
  { id: "dns", label: "ตรวจสอบ DNS", icon: Globe2, description: "เช็กว่าชื่อเว็บไซต์แปลงเป็น IP ได้หรือไม่" },
  { id: "port", label: "ตรวจสอบ Port", icon: Cable, description: "เช็กว่าบริการ เช่น RDP หรือไฟล์แชร์ เปิดอยู่หรือไม่" },
  { id: "ip", label: "คำนวณ IP", icon: SearchCode, description: "ดู Network, Gateway และจำนวน IP ในวง" },
  { id: "diagnostic", label: "วิเคราะห์ปัญหา", icon: Activity, description: "ไล่ตรวจทีละขั้นและสรุปสาเหตุเบื้องต้น" },
];

function calculator(ip: string, cidrText: string) {
  const cidr = Math.min(32, Math.max(0, Number(cidrText.replace("/", "")) || 24));
  const parts = ip.split(".").map(Number);
  if (parts.length !== 4 || parts.some((part) => Number.isNaN(part) || part < 0 || part > 255)) return null;
  const value = parts.reduce((acc, part) => (acc << 8) + part, 0) >>> 0;
  const mask = cidr === 0 ? 0 : (0xffffffff << (32 - cidr)) >>> 0;
  const network = value & mask;
  const broadcast = (network | (~mask >>> 0)) >>> 0;
  const toIp = (number: number) => [24, 16, 8, 0].map((shift) => (number >>> shift) & 255).join(".");
  const total = 2 ** (32 - cidr);
  return { network: toIp(network), broadcast: toIp(broadcast), mask: toIp(mask), first: toIp(cidr >= 31 ? network : network + 1), last: toIp(cidr >= 31 ? broadcast : broadcast - 1), usable: cidr >= 31 ? total : total - 2 };
}

export function SupportConsole() {
  const [view, setView] = useState<View>("dashboard");
  const [tool, setTool] = useState<Tool>("ping");
  const [target, setTarget] = useState("192.168.10.10");
  const [port, setPort] = useState("445");
  const [ip, setIp] = useState("192.168.10.25");
  const [cidr, setCidr] = useState("24");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Device | null>(devices[0]);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [result, setResult] = useState<PingResult | DnsResult | PortResult | DiagnosticResult | null>(null);
  const subnet = useMemo(() => calculator(ip, cidr), [ip, cidr]);
  const activeLabel = nav.find((item) => item.id === view)?.label ?? "ภาพรวม";
  const go = (next: View, selectedTool?: Tool) => { setView(next); if (selectedTool) setTool(selectedTool); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const copy = async (value: string) => { await navigator.clipboard?.writeText(value); setNotice("คัดลอกข้อมูลแล้ว"); window.setTimeout(() => setNotice(""), 2200); };
  const run = async () => {
    if (!target.trim()) { setNotice("กรุณาระบุชื่อเครื่องหรือ IP ก่อนเริ่มตรวจสอบ"); return; }
    setBusy(true); setNotice("");
    try {
      if (tool === "ping") setResult(await networkService.ping(target));
      if (tool === "dns") setResult(await networkService.dnsLookup(target));
      if (tool === "port") setResult(await networkService.checkPort(target, Number(port)));
      if (tool === "diagnostic") setResult(await networkService.diagnose(target));
    } catch { setNotice("ไม่สามารถเรียกใช้เครื่องมือตรวจสอบได้ กรุณาลองใหม่"); }
    finally { setBusy(false); }
  };

  return <main className="its-shell">
    <header className="its-topbar"><a href="/" className="its-brand" aria-label="กลับสู่หน้าภาพรวม QuoteFlow"><span aria-hidden="true">IT</span><b>ผู้ช่วยฝ่ายไอที</b><small>ศูนย์ตรวจสอบระบบ</small></a><div className="its-top-status"><ShieldCheck aria-hidden="true" size={17} />รายงานตรวจสอบ: ใช้งานกับเครือข่ายที่อนุญาต</div><button className="its-icon-button" type="button" aria-label="คัดลอกสรุปสถานะ" onClick={() => copy("สรุปสถานะ IT Support") }><Clipboard aria-hidden="true" size={19} /></button></header>
    <div className="its-layout"><aside className="its-sidebar"><p>เมนูหลัก</p>{nav.map(({ id, label, icon: Icon }) => <button key={id} type="button" className={view === id ? "active" : ""} onClick={() => go(id)}><Icon aria-hidden="true" size={19} /><span>{label}</span><ChevronRight aria-hidden="true" size={16} /></button>)}<p>เครื่องมือเครือข่าย</p>{tools.map(({ id, label, icon: Icon }) => <button key={id} type="button" className={view === "network" && tool === id ? "active" : ""} onClick={() => go("network", id)}><Icon aria-hidden="true" size={18} /><span>{label}</span><ChevronRight aria-hidden="true" size={16} /></button>)}<p>ผู้ดูแลระบบ</p><button type="button" onClick={() => window.location.assign("/it-support/login")}><Settings aria-hidden="true" size={18} /><span>ตั้งค่าระบบ</span><ChevronRight aria-hidden="true" size={16} /></button><div className="its-sidebar-foot"><span>สถานะการติดตาม</span><strong><i /> 17 / 20 เครื่องออนไลน์</strong><small>ซิงก์ข้อมูลล่าสุด: เมื่อสักครู่</small></div></aside>
      <section className="its-content"><div className="its-page-head"><div><p className="its-kicker">{activeLabel} · {view === "reports" ? "ตรวจสอบอัตโนมัติ" : "ข้อมูลสาธิต"}</p><h1>{view === "dashboard" ? "วันนี้มีอะไรที่ต้องดูแลบ้าง?" : view === "network" ? "เลือกเครื่องมือให้ตรงกับอาการ" : view === "devices" ? "อุปกรณ์ที่ระบบกำลังติดตาม" : "สรุปปัญหาจากข้อมูลเซิร์ฟเวอร์"}</h1><span>{view === "dashboard" ? "เริ่มจากการแจ้งเตือนสีแดง แล้วใช้เครื่องมือด้านล่างเพื่อหาสาเหตุอย่างเป็นขั้นตอน" : view === "network" ? "ผลลัพธ์ในหน้านี้เป็นการจำลอง เพื่อให้ทดลองขั้นตอนอย่างปลอดภัย" : view === "devices" ? "ค้นหาและเลือกอุปกรณ์เพื่อดูข้อมูลประกอบการตรวจสอบ" : "ระบุ IP หรือชื่อเครื่อง แล้วให้ระบบตรวจ DNS, Ping และบริการที่เลือก พร้อมบันทึกรายงานไว้ให้"}</span></div>{(view === "dashboard" || view === "devices") && <button className="its-primary" type="button" onClick={() => go("network", "diagnostic")}><Wrench aria-hidden="true" size={18} />เริ่มวิเคราะห์ปัญหา</button>}</div>{notice && <div className="its-toast" role="status">{notice}</div>}{view === "dashboard" && <Dashboard go={go} />}{view === "network" && <NetworkTools tool={tool} setTool={setTool} target={target} setTarget={setTarget} port={port} setPort={setPort} ip={ip} setIp={setIp} cidr={cidr} setCidr={setCidr} subnet={subnet} busy={busy} run={run} result={result} copy={copy} />}{view === "devices" && <DeviceList devices={devices} selected={selected} onSelect={setSelected} query={query} onQuery={setQuery} />}{view === "reports" && <ReportWorkbench />}</section>
    </div>
  </main>;
}

function Dashboard({ go }: { go: (view: View, tool?: Tool) => void }) { return <>
  <section className="its-metrics" aria-label="สรุปสถานะระบบ"><MetricCard icon={MonitorCog} label="อุปกรณ์ที่ออนไลน์" value="17 / 20" detail="มี 3 เครื่องที่ควรตรวจสอบ" severity="success" /><MetricCard icon={Activity} label="ความพร้อมของเครือข่าย" value="96%" detail="ยิ่งสูง ยิ่งใช้งานได้ต่อเนื่อง" severity="info" /><MetricCard icon={Ticket} label="งานแจ้งปัญหาที่ยังเปิดอยู่" value="8" detail="2 งานมีความเร่งด่วนสูง" severity="warning" /><MetricCard icon={CircleAlert} label="การแจ้งเตือนวิกฤต" value="2" detail="ควรเริ่มตรวจสอบก่อน" severity="critical" /></section>
  <section className="its-dashboard-grid"><article className="its-panel its-chart"><div className="its-panel-head"><div><p className="its-kicker">ภาพรวมความเสถียร</p><h2>ความพร้อมใช้งานของระบบวันนี้</h2></div><button type="button" onClick={() => go("network", "diagnostic")}>ตรวจหาสาเหตุ <ChevronRight aria-hidden="true" size={16} /></button></div><p className="its-helper">ตัวเลขเป็นเปอร์เซ็นต์ของอุปกรณ์และเครือข่ายที่ทำงานได้ปกติ ช่วงที่กราฟลดลงคือเวลาที่ควรย้อนดูการแจ้งเตือน</p><div className="its-chart-body"><ResponsiveContainer width="100%" height="100%"><AreaChart data={healthTrend} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}><defs><linearGradient id="health-fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#44b84b" stopOpacity={0.42} /><stop offset="100%" stopColor="#44b84b" stopOpacity={0} /></linearGradient></defs><CartesianGrid vertical={false} stroke="#294477" strokeDasharray="3 4" /><XAxis dataKey="time" tick={{ fill: "#b9c9ea", fontSize: 11 }} axisLine={false} tickLine={false} /><YAxis domain={[88, 100]} tick={{ fill: "#b9c9ea", fontSize: 11 }} axisLine={false} tickLine={false} /><Tooltip contentStyle={{ background: "#06122e", border: "2px solid #294477", borderRadius: 2, color: "#f6f7ff" }} formatter={(value) => [`${value}%`, "ความพร้อมใช้งาน"]} /><Area type="monotone" dataKey="health" name="ความพร้อมใช้งาน" stroke="#44b84b" strokeWidth={3} fill="url(#health-fill)" /></AreaChart></ResponsiveContainer></div></article><article className="its-panel its-attention"><div className="its-panel-head"><div><p className="its-kicker">ควรทำก่อน</p><h2>งานแจ้งปัญหาล่าสุด</h2></div><Ticket aria-hidden="true" size={20} /></div><p className="its-helper">เรียงตามความสำคัญ: วิกฤต → สูง → ปานกลาง เพื่อช่วยตัดสินใจว่างานใดควรเริ่มก่อน</p><ul>{recentTickets.map((ticket) => <li key={ticket.id}><span className={`its-ticket-dot ${ticket.priority === "วิกฤต" ? "critical" : ticket.priority === "สูง" ? "high" : "medium"}`} aria-hidden="true" /><div><strong>{ticket.title}</strong><small>{ticket.id} · {ticket.time}</small></div><b>{ticket.priority}</b></li>)}</ul><button type="button" onClick={() => go("network", "diagnostic")}>เริ่มวิเคราะห์รายการที่สำคัญที่สุด <ChevronRight aria-hidden="true" size={16} /></button></article></section>
  <section className="its-quick"><div><p className="its-kicker">เริ่มต้นอย่างไรดี</p><h2>เลือกเครื่องมือให้ตรงกับอาการที่พบ</h2><span className="its-helper">ตัวอย่าง: เครื่องเข้าไม่ได้ให้เริ่ม Ping, เข้าเว็บไซต์ไม่ได้ให้ตรวจ DNS, เปิดไฟล์แชร์ไม่ได้ให้ตรวจ Port</span></div>{tools.filter((item) => item.id !== "ip" && item.id !== "port").map(({ id, label, icon: Icon, description }) => <button key={id} type="button" onClick={() => go("network", id)}><Icon aria-hidden="true" /><b>{label}</b><span>{description}</span></button>)}</section>
</> }

function NetworkTools(props: { tool: Tool; setTool: (tool: Tool) => void; target: string; setTarget: (value: string) => void; port: string; setPort: (value: string) => void; ip: string; setIp: (value: string) => void; cidr: string; setCidr: (value: string) => void; subnet: ReturnType<typeof calculator>; busy: boolean; run: () => void; result: PingResult | DnsResult | PortResult | DiagnosticResult | null; copy: (value: string) => void }) {
  const { tool, setTool, target, setTarget, port, setPort, ip, setIp, cidr, setCidr, subnet, busy, run, result, copy } = props;
  const current = tools.find((item) => item.id === tool)!;
  if (tool === "ip") return <><ToolTabs tool={tool} setTool={setTool} /><section className="its-panel its-tool"><div className="its-panel-head"><div><p className="its-kicker">เครื่องมือช่วยคำนวณ</p><h2>คำนวณช่วง IP</h2></div><StatusBadge status="info" /></div><p className="its-helper">กรอก IP และ CIDR เช่น 192.168.10.25 และ 24 เพื่อดูขอบเขตของเครือข่าย</p><div className="its-form-grid"><label>IP address<input value={ip} onChange={(event) => setIp(event.target.value)} inputMode="decimal" /></label><label>CIDR<input value={cidr} onChange={(event) => setCidr(event.target.value)} inputMode="numeric" /></label></div>{subnet ? <div className="its-result-grid">{[["Network address", subnet.network], ["Broadcast address", subnet.broadcast], ["Subnet mask", subnet.mask], ["IP เครื่องแรก", subnet.first], ["IP เครื่องสุดท้าย", subnet.last], ["จำนวน IP ที่ใช้ได้", String(subnet.usable)]].map(([label, value]) => <button type="button" key={label} onClick={() => copy(value)}><span>{label}</span><strong>{value}</strong><Copy aria-hidden="true" size={15} /></button>)}</div> : <div className="its-empty">รูปแบบ IP ไม่ถูกต้อง กรุณากรอกตัวอย่างเช่น 192.168.10.25</div>}</section></>;
  return <><ToolTabs tool={tool} setTool={setTool} /><section className="its-panel its-tool"><div className="its-panel-head"><div><p className="its-kicker">ตรวจสอบแบบปลอดภัย</p><h2>{current.label}</h2></div><span className="its-demo-badge">ข้อมูลสาธิต ไม่สั่งงานเครื่องจริง</span></div><p className="its-helper">{current.description}</p><div className="its-tool-form"><label>ชื่อเครื่อง, โดเมน หรือ IP<input value={target} onChange={(event) => setTarget(event.target.value)} placeholder="ตัวอย่าง: PC-HR-02 หรือ 192.168.10.10" /></label>{tool === "port" && <label>Port<input value={port} onChange={(event) => setPort(event.target.value)} inputMode="numeric" /></label>}<button type="button" className="its-primary" disabled={busy} onClick={run}>{busy ? "กำลังตรวจสอบ…" : "เริ่มตรวจสอบ"}</button></div><ResultPanel result={result} tool={tool} /></section></>;
}

function ToolTabs({ tool, setTool }: { tool: Tool; setTool: (tool: Tool) => void }) { return <div className="its-tool-tabs" role="tablist" aria-label="เลือกเครื่องมือเครือข่าย">{tools.map((item) => <button type="button" role="tab" aria-selected={tool === item.id} key={item.id} className={tool === item.id ? "active" : ""} onClick={() => setTool(item.id)}>{item.label}</button>)}</div>; }

function ResultPanel({ result, tool }: { result: PingResult | DnsResult | PortResult | DiagnosticResult | null; tool: Tool }) {
  if (!result) return <div className="its-empty">กรอกปลายทาง แล้วกด “เริ่มตรวจสอบ” ผลลัพธ์และคำอธิบายจะปรากฏที่นี่</div>;
  if ("steps" in result) return <DiagnosticTimeline result={result} onCopy={() => undefined} />;
  if ("records" in result) return <div className="its-result"><div><StatusBadge status="success" /><h3>{result.domain} <span>ตอบกลับใน {result.responseTime} ms</span></h3></div><dl>{result.records.map((record) => <div key={record.type}><dt>ระเบียน {record.type}</dt><dd>{record.value}</dd></div>)}</dl></div>;
  if ("open" in result) return <div className="its-result"><div><StatusBadge status={result.open ? "success" : "critical"} /><h3>{result.host}:{result.port} <span>{result.service}</span></h3></div><dl><div><dt>สถานะ Port</dt><dd>{result.open ? "เปิดใช้งาน" : "ปิด / ไม่ตอบกลับ"}</dd></div><div><dt>เวลาตอบสนอง</dt><dd>{result.latency ? `${result.latency} ms` : "—"}</dd></div></dl></div>;
  return <div className="its-result"><div><StatusBadge status={result.status === "online" ? "success" : "critical"} /><h3>{result.target} <span>{result.address}</span></h3></div><dl>{[["ส่งข้อมูล", result.sent], ["ได้รับตอบกลับ", result.received], ["ข้อมูลสูญหาย", `${result.loss}%`], ["เวลาเฉลี่ย", `${result.average} ms`], ["เร็วสุด / ช้าที่สุด", `${result.min} / ${result.max} ms`]].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl></div>;
}
