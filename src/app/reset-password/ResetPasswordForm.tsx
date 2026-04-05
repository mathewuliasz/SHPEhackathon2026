"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import styles from "../auth/page.module.css";

type ResetPasswordFormProps = {
  token: string;
};

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const router = useRouter();
  const { t } = useLanguage();
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
      setError(t("reset_missingToken"));
      return;
    }

    if (password !== confirmPassword) {
      setError(t("reset_noMatch"));
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
        setError(data?.error ?? t("reset_error"));
        return;
      }

      setSuccess(data?.message ?? t("reset_success"));
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
        <div className={styles.formKicker}>{t("reset_formKicker")}</div>
        <h2>{t("reset_formTitle")}</h2>
        <p>{t("reset_formText")}</p>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.field}>
          <span>{t("reset_newPassword")}</span>
          <input
            type="password"
            placeholder={t("reset_newPasswordPlaceholder")}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>

        <label className={styles.field}>
          <span>{t("reset_confirmPassword")}</span>
          <input
            type="password"
            placeholder={t("reset_confirmPlaceholder")}
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
          {isPending ? t("reset_updating") : t("reset_submit")}
        </button>
      </form>
    </section>
  );
}
