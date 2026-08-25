import type { Metadata } from "next";
import { SystemSettings } from "./system-settings";

export const metadata: Metadata = { title: "ตั้งค่าระบบ | IT Support Assistant" };
export default function SystemSettingsPage() { return <SystemSettings />; }
