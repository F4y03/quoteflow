import { z } from "zod";
const hostname = /^(?=.{1,253}$)[a-zA-Z0-9][a-zA-Z0-9.-]*$/;
export const diagnosticRequestSchema = z.object({ target: z.string().trim().min(1, "โปรดระบุชื่อเครื่องหรือ IP").max(253).regex(hostname, "รูปแบบชื่อเครื่องหรือ IP ไม่ถูกต้อง"), requiredPort: z.coerce.number().int().min(1).max(65535).optional() });

export const systemSettingsSchema = z.object({
  allowedNetworks: z.string().trim().min(1, "โปรดระบุเครือข่ายที่อนุญาต").max(1000, "รายการเครือข่ายยาวเกินไป"),
  intervalMinutes: z.coerce.number().int().min(5, "ตั้งรอบตรวจสอบอย่างน้อย 5 นาที").max(1440, "ตั้งรอบตรวจสอบได้ไม่เกิน 1,440 นาที"),
  demoMode: z.boolean(),
  databaseUrl: z.string().trim().max(2000).optional().refine((value) => !value || /^postgres(?:ql)?:\/\//i.test(value), "DATABASE_URL ต้องขึ้นต้นด้วย postgresql:// หรือ postgres://"),
});
