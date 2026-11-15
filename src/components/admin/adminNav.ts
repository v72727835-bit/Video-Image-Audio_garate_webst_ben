import {
  LayoutDashboard,
  Users,
  GalleryVerticalEnd,
  ShieldCheck,
  KeyRound,
  ScrollText,
  CreditCard,
  Settings,
  type LucideIcon,
} from "lucide-react";
import type { PermissionKey } from "@/lib/permissions";

export interface AdminNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  perm?: PermissionKey;
}

export const adminNav: AdminNavItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Users", href: "/admin/users", icon: Users, perm: "users" },
  { label: "Content", href: "/admin/content", icon: GalleryVerticalEnd, perm: "content" },
  { label: "Admins", href: "/admin/admins", icon: ShieldCheck, perm: "admins" },
  { label: "API Keys", href: "/admin/apikeys", icon: KeyRound, perm: "apikeys" },
  { label: "Activity", href: "/admin/activity", icon: ScrollText, perm: "activity" },
  { label: "Plans", href: "/admin/plans", icon: CreditCard, perm: "plans" },
  { label: "Settings", href: "/admin/settings", icon: Settings, perm: "settings" },
];
