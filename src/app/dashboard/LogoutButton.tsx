"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import styles from "./layout.module.css";

export default function LogoutButton() {
  const router = useRouter();
  const { t } = useLanguage();
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  async function handleLogout() {
    setError("");

    startTransition(async () => {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (!response.ok) {
        setError(t("logout_error"));
        return;
      }

      router.push("/auth");
      router.refresh();
    });
  }

  return (
    <div className={styles.sidebarFooter}>
      <button
        type="button"
        className={styles.logoutButton}
        onClick={handleLogout}
        disabled={isPending}
      >
        {isPending ? t("logout_signingOut") : t("logout_button")}
      </button>
      {error ? <p className={styles.logoutError}>{error}</p> : null}
    </div>
  );
}
