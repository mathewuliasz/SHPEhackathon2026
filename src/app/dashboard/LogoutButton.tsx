"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import styles from "./layout.module.css";

export default function LogoutButton() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  async function handleLogout() {
    setError("");

    startTransition(async () => {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (!response.ok) {
        setError("Could not log out.");
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
        {isPending ? "Signing out..." : "Log Out"}
      </button>
      {error ? <p className={styles.logoutError}>{error}</p> : null}
    </div>
  );
}
