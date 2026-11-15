import {
  LayoutDashboard,
  Clapperboard,
  ImageIcon,
  AudioLines,
  LayoutPanelTop,
  GalleryVerticalEnd,
  Users,
  FolderOpen,
  Palette,
  ChartNoAxesColumn,
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

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const navGroups: NavGroup[] = [
  {
    label: "Create",
    items: [
      { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
      { label: "Text to Video", href: "/dashboard/video", icon: Clapperboard },
      { label: "Text to Image", href: "/dashboard/image", icon: ImageIcon },
      { label: "Voice & Music", href: "/dashboard/audio", icon: AudioLines, badge: "Soon" },
      { label: "Storyboard", href: "/dashboard/storyboard", icon: LayoutPanelTop, badge: "New" },
    ],
  },
  {
    label: "Library",
    items: [
      { label: "My Creations", href: "/dashboard/gallery", icon: GalleryVerticalEnd },
      { label: "Characters", href: "/dashboard/characters", icon: Users },
      { label: "Assets", href: "/dashboard/assets", icon: FolderOpen },
      { label: "Brand Kit", href: "/dashboard/brand", icon: Palette },
    ],
  },
  {
    label: "Insights",
    items: [
      { label: "Analytics", href: "/dashboard/insights", icon: ChartNoAxesColumn, badge: "Pro" },
      { label: "Billing & Credits", href: "/dashboard/billing", icon: CreditCard },
    ],
  },
  {
    label: "Account",
    items: [{ label: "Settings", href: "/dashboard/settings", icon: Settings }],
  },
];

// flat list (used for quick lookups)
export const navItems: NavItem[] = navGroups.flatMap((g) => g.items);
