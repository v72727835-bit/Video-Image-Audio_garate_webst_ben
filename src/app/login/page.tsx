import { Suspense } from "react";
import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/AuthShell";
import { AuthForm } from "@/components/auth/AuthForm";

export const metadata: Metadata = { title: "Sign in — Lumina Studio" };

export default function LoginPage() {
  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to pick up where your imagination left off."
    >
      <Suspense fallback={<div className="h-80" />}>
        <AuthForm mode="login" />
      </Suspense>
    </AuthShell>
  );
}
