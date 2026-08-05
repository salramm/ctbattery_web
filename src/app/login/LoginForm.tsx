"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { isValidLogin, setSession } from "@/lib/auth";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    setError(null);

    const u = username.trim();
    if (!isValidLogin(u, password)) {
      setError("Invalid username or password");
      return;
    }

    setSubmitting(true);
    setSession(u);
    router.push("/portal");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      {error && <div className="err">{error}</div>}

      <div className="field">
        <label htmlFor="login-user">Username</label>
        <input
          id="login-user"
          type="text"
          autoComplete="username"
          autoCapitalize="none"
          autoFocus
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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
