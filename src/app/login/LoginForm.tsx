"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    setError(null);
    setSubmitting(true);
    try {
      await signIn(email, password);
      router.push("/portal");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      {error && <div className="err">{error}</div>}

      <div className="field">
        <label htmlFor="login-email">Email</label>
        <input
          id="login-email"
          type="email"
          autoComplete="username"
          autoCapitalize="none"
          autoFocus
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="field">
        <label htmlFor="login-pass">Password</label>
        <input
          id="login-pass"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <button type="submit" className="btn-primary" disabled={submitting}>
        {submitting ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
