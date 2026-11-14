"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2, Mail, Lock, User as UserIcon } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loginUser, registerUser, clearError } from "@/store/slices/authSlice";
import { Button } from "@/components/ui/Button";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const params = useSearchParams();
  const { status, error } = useAppSelector((s) => s.auth);
  const loading = status === "loading";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);

  const isSignup = mode === "signup";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    dispatch(clearError());
    const action = isSignup
      ? registerUser({ name, email, password })
      : loginUser({ email, password });
    const res = await dispatch(action);
    if (
      (isSignup && registerUser.fulfilled.match(res)) ||
      (!isSignup && loginUser.fulfilled.match(res))
    ) {
      const next = params.get("next") || "/dashboard";
      router.push(next);
      router.refresh();
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {isSignup && (
        <Field
          icon={<UserIcon className="h-4 w-4" />}
          label="Full name"
          type="text"
          value={name}
          onChange={setName}
          placeholder="Ava Mitchell"
          autoComplete="name"
          required
        />
      )}
      <Field
        icon={<Mail className="h-4 w-4" />}
        label="Email"
        type="email"
        value={email}
        onChange={setEmail}
        placeholder="you@studio.com"
        autoComplete="email"
        required
      />
      <div>
        <label className="mb-1.5 block text-sm font-medium text-ink-soft">
          Password
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-faint">
            <Lock className="h-4 w-4" />
          </span>
          <input
            type={show ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={isSignup ? "At least 6 characters" : "••••••••"}
            autoComplete={isSignup ? "new-password" : "current-password"}
            required
            className="w-full rounded-xl border border-line bg-base/60 py-3 pl-10 pr-11 text-sm text-ink placeholder:text-faint outline-none transition-colors focus:border-brand/60 focus:ring-2 focus:ring-brand/20"
          />
          <button
            type="button"
            onClick={() => setShow((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-faint hover:text-ink-soft"
            aria-label="Toggle password"
          >
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {error && (
        <p className="rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
          {error}
        </p>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            {isSignup ? "Creating account…" : "Signing in…"}
          </>
        ) : isSignup ? (
          "Create free account"
        ) : (
          "Sign in"
        )}
      </Button>

      <p className="pt-1 text-center text-sm text-muted">
        {isSignup ? "Already have an account? " : "New to Lumina? "}
        <Link
          href={isSignup ? "/login" : "/signup"}
          className="font-medium text-brand-light hover:text-brand"
        >
          {isSignup ? "Sign in" : "Create one free"}
        </Link>
      </p>
    </form>
  );
}

function Field({
  icon,
  label,
  type,
  value,
  onChange,
  placeholder,
  autoComplete,
  required,
}: {
  icon: React.ReactNode;
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-ink-soft">{label}</label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-faint">
          {icon}
        </span>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          className="w-full rounded-xl border border-line bg-base/60 py-3 pl-10 pr-4 text-sm text-ink placeholder:text-faint outline-none transition-colors focus:border-brand/60 focus:ring-2 focus:ring-brand/20"
        />
      </div>
    </div>
  );
}
