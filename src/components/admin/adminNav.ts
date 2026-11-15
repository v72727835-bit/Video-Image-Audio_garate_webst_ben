import {
  LayoutDashboard,
  Users,
  GalleryVerticalEnd,
  CreditCard,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface AdminNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const adminNav: AdminNavItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Content", href: "/admin/content", icon: GalleryVerticalEnd },
  { label: "Plans", href: "/admin/plans", icon: CreditCard },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];
