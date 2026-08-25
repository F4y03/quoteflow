export type Role = "ADMIN" | "IT_SUPPORT" | "VIEWER";
export const permissions: Record<Role, readonly string[]> = { ADMIN: ["devices:read", "devices:write", "diagnostics:run", "tickets:write", "settings:write"], IT_SUPPORT: ["devices:read", "diagnostics:run", "tickets:write"], VIEWER: ["devices:read"] };
export const can = (role: Role, permission: string) => permissions[role].includes(permission);
