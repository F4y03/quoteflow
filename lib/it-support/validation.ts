import { z } from "zod";
const hostname = /^(?=.{1,253}$)[a-zA-Z0-9][a-zA-Z0-9.-]*$/;
export const diagnosticRequestSchema = z.object({ target: z.string().trim().min(1, "โปรดระบุชื่อเครื่องหรือ IP").max(253).regex(hostname, "รูปแบบชื่อเครื่องหรือ IP ไม่ถูกต้อง"), requiredPort: z.coerce.number().int().min(1).max(65535).optional() });
