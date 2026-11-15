"use client";

import { createContext, useContext } from "react";
import type { PermissionKey } from "@/lib/permissions";

export interface AdminMe {
  id: string;
  email: string;
  name: string;
  role: "super" | "sub";
  permissions: PermissionKey[];
}

const AdminContext = createContext<AdminMe | null>(null);

export function AdminProvider({ value, children }: { value: AdminMe; children: React.ReactNode }) {
  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin(): AdminMe {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used within AdminProvider");
  return ctx;
}

export function useCan() {
  const admin = useAdmin();
  return (key: PermissionKey) => admin.role === "super" || admin.permissions.includes(key);
}
