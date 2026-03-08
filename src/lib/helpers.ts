export function generateToken(): string {
  // Use Web Crypto API (available in Node.js 18+ and all modern browsers)
  return Array.from(
    globalThis.crypto.getRandomValues(new Uint8Array(32))
  ).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export const ROLES = {
  MEMBER: "MEMBER",
  MODERATOR: "MODERATOR",
  ADMIN: "ADMIN",
  SUPER_ADMIN: "SUPER_ADMIN",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const ROLE_LABELS: Record<string, string> = {
  MEMBER: "عضو",
  MODERATOR: "مشرف",
  ADMIN: "مدير",
  SUPER_ADMIN: "مدير عام",
};

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("ar-SA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
