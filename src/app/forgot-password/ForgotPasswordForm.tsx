"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import styles from "../auth/page.module.css";

export function ForgotPasswordForm() {
  const { t } = useLanguage();
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
        setError(data?.error ?? t("forgot_error"));
        return;
      }

      setSuccess(data?.message ?? t("forgot_success"));
      setResetUrl(data?.resetUrl ?? "");
    });
  }

  return (
    <section className={styles.formCard}>
      <div className={styles.formHeader}>
        <div className={styles.formKicker}>{t("forgot_formKicker")}</div>
        <h2>{t("forgot_formTitle")}</h2>
        <p>{t("forgot_formText")}</p>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.field}>
          <span>{t("auth_email")}</span>
          <input
            type="email"
            placeholder={t("auth_emailPlaceholder")}
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
          {isPending ? t("forgot_generating") : t("forgot_sendLink")}
        </button>
      </form>
    </section>
  );
}
