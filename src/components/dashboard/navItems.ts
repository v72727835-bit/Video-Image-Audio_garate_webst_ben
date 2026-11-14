import {
  LayoutDashboard,
  Clapperboard,
  ImageIcon,
  AudioLines,
  GalleryVerticalEnd,
  CreditCard,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
}

export const navItems: NavItem[] = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Text to Video", href: "/dashboard/video", icon: Clapperboard },
  { label: "Text to Image", href: "/dashboard/image", icon: ImageIcon },
  { label: "Voice & Music", href: "/dashboard/audio", icon: AudioLines, badge: "Soon" },
  { label: "My Creations", href: "/dashboard/gallery", icon: GalleryVerticalEnd },
  { label: "Billing & Credits", href: "/dashboard/billing", icon: CreditCard },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];
