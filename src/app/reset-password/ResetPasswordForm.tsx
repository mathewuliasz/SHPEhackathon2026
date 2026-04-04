"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import styles from "../auth/page.module.css";

type ResetPasswordFormProps = {
  token: string;
};

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!token) {
      setError("This reset link is missing a token.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    startTransition(async () => {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password,
        }),
      });

      const data = (await response.json().catch(() => null)) as
        | { error?: string; message?: string }
        | null;

      if (!response.ok) {
        setError(data?.error ?? "Could not reset your password.");
        return;
      }

      setSuccess(data?.message ?? "Password updated.");
      setPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        router.push("/auth");
      }, 1200);
    });
  }

  return (
    <section className={styles.formCard}>
      <div className={styles.formHeader}>
        <div className={styles.formKicker}>New Password</div>
        <h2>Reset password</h2>
        <p>Create a new password with at least 8 characters.</p>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.field}>
          <span>New Password</span>
          <input
            type="password"
            placeholder="Choose a secure password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>

        <label className={styles.field}>
          <span>Confirm Password</span>
          <input
            type="password"
            placeholder="Re-enter your password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
          />
        </label>

        {error ? <p className={styles.errorText}>{error}</p> : null}
        {success ? <p className={styles.successText}>{success}</p> : null}
        {!token ? (
          <p className={styles.helperText}>
            No reset token found. Request a new one from{" "}
            <Link href="/forgot-password">forgot password</Link>.
          </p>
        ) : null}

        <button className={styles.primaryButton} type="submit" disabled={isPending}>
          {isPending ? "Updating..." : "Update Password"}
        </button>
      </form>
    </section>
  );
}
