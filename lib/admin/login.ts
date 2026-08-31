const INTERNAL_AUTH_DOMAIN = "auth.windread.local";

export function normalizeLoginId(value: unknown) {
  const loginId = typeof value === "string" ? value.trim().toLowerCase() : "";
  if (!/^[a-z0-9][a-z0-9._-]{2,47}$/.test(loginId)) {
    throw new Error("ID đăng nhập dùng 3–48 ký tự: chữ không dấu, số, dấu chấm, gạch ngang hoặc gạch dưới.");
  }
  return loginId;
}

export function authEmailForLoginId(loginId: string) {
  return `${loginId}@${INTERNAL_AUTH_DOMAIN}`;
}

export function authIdentifier(value: string) {
  const identifier = value.trim();
  return identifier.includes("@") ? identifier : authEmailForLoginId(normalizeLoginId(identifier));
}
