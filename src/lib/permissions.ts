// Granular permission keys a sub-admin can be granted.
// A "super" admin implicitly has all of them.
export const PERMISSIONS = [
  { key: "users", label: "Users", desc: "View, edit, suspend and delete users" },
  { key: "content", label: "Content", desc: "Review and remove any creation" },
  { key: "plans", label: "Plans & credits", desc: "Manage subscription tiers and packs" },
  { key: "apikeys", label: "API keys", desc: "Add and rotate provider API keys" },
  { key: "activity", label: "Activity log", desc: "View the audit trail" },
  { key: "settings", label: "Settings", desc: "Change platform-wide settings" },
  { key: "admins", label: "Admins", desc: "Create and manage other admins" },
] as const;

export type PermissionKey = (typeof PERMISSIONS)[number]["key"];

export const ALL_PERMISSIONS: PermissionKey[] = PERMISSIONS.map((p) => p.key);
