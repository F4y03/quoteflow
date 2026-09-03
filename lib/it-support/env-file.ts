import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const ENV_PATH = path.join(process.cwd(), ".env");

function toEnvValue(value: string) {
  return JSON.stringify(value.replace(/[\r\n]/g, ""));
}

function updateValue(content: string, key: string, value: string) {
  const expression = new RegExp(`^(\\s*(?:export\\s+)?${key}\\s*=).*$`, "m");
  const line = `${key}=${toEnvValue(value)}`;
  return expression.test(content) ? content.replace(expression, line) : `${content}${content.endsWith("\n") || !content ? "" : "\n"}${line}\n`;
}

export async function writeSystemEnv(values: { allowedNetworks: string; intervalMinutes: number; demoMode: boolean; databaseUrl?: string }) {
  let current = "";
  try {
    current = await readFile(ENV_PATH, "utf8");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }

  const entries: Array<[string, string]> = [
    ["IT_SUPPORT_ALLOWED_NETWORKS", values.allowedNetworks],
    ["IT_SUPPORT_CHECK_INTERVAL_MINUTES", String(values.intervalMinutes)],
    ["IT_SUPPORT_DEMO_MODE", String(values.demoMode)],
  ];
  if (values.databaseUrl) entries.unshift(["DATABASE_URL", values.databaseUrl]);
  const next = entries.reduce((content, [key, value]) => updateValue(content, key, value), current);

  await writeFile(ENV_PATH, next, { encoding: "utf8", mode: 0o600 });
}
