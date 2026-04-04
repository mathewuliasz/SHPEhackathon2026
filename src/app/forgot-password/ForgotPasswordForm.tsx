"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import styles from "../auth/page.module.css";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [resetUrl, setResetUrl] = useState("");
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setResetUrl("");

    startTransition(async () => {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = (await response.json().catch(() => null)) as
        | { error?: string; message?: string; resetUrl?: string }
        | null;

      if (!response.ok) {
        setError(data?.error ?? "Could not generate a reset link.");
        return;
      }

      setSuccess(data?.message ?? "Reset link generated.");
      setResetUrl(data?.resetUrl ?? "");
    });
  }

  return (
    <section className={styles.formCard}>
      <div className={styles.formHeader}>
        <div className={styles.formKicker}>Forgot Password</div>
        <h2>Request reset link</h2>
        <p>Use your account email to start the password reset process.</p>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.field}>
          <span>Email Address</span>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>

        {error ? <p className={styles.errorText}>{error}</p> : null}
        {success ? <p className={styles.successText}>{success}</p> : null}
        {resetUrl ? (
          <p className={styles.helperText}>
            Dev reset link: <Link href={resetUrl}>{resetUrl}</Link>
          </p>
        ) : null}

        <button className={styles.primaryButton} type="submit" disabled={isPending}>
          {isPending ? "Generating..." : "Send Reset Link"}
        </button>
      </form>
    </section>
  );
}
