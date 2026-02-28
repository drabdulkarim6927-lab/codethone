import crypto from "crypto";

export function generateToken(): string {
  return crypto.randomBytes(32).toString("hex");
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
