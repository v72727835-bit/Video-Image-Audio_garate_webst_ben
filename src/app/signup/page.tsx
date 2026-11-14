import { Suspense } from "react";
import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/AuthShell";
import { AuthForm } from "@/components/auth/AuthForm";

export const metadata: Metadata = { title: "Create account — Lumina Studio" };

export default function SignupPage() {
  return (
    <AuthShell
      title="Create your studio"
      subtitle="Start free with 150 credits. No credit card needed."
    >
      <Suspense fallback={<div className="h-96" />}>
        <AuthForm mode="signup" />
      </Suspense>
    </AuthShell>
  );
}
