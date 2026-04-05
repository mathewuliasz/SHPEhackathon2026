"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import styles from "./page.module.css";

type AuthCardProps = {
  initialMode: "signin" | "signup";
  loginVariant?: "default" | "doctor";
  allowSignUp?: boolean;
};

export function AuthCard({
  initialMode,
  loginVariant = "default",
  allowSignUp = true,
}: AuthCardProps) {
  const router = useRouter();
  const { t } = useLanguage();
  const [mode, setMode] = useState<"signin" | "signup">(initialMode);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const [signInForm, setSignInForm] = useState({
    email: "",
    password: "",
    keepSignedIn: true,
  });
  const [signUpForm, setSignUpForm] = useState({
    fullName: "",
    email: "",
    password: "",
    acceptedTerms: false,
  });

  function switchMode(nextMode: "signin" | "signup") {
    setError("");
    setMode(nextMode);
    startTransition(() => {
      router.replace(nextMode === "signup" ? "/auth?mode=signup" : "/auth");
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const endpoint =
      mode === "signup" ? "/api/auth/signup" : "/api/auth/login";
    const payload =
      mode === "signup"
        ? signUpForm
        : {
            email: signInForm.email,
            password: signInForm.password,
            ...(loginVariant === "doctor" ? { expectedRole: "doctor" as const } : {}),
          };

    startTransition(async () => {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await response.json().catch(() => null)) as
        | { error?: string; user?: { redirectTo?: string } }
        | null;

      if (!response.ok) {
        setError(data?.error ?? t("auth_error"));
        return;
      }

      router.push(data?.user?.redirectTo ?? "/dashboard");
      router.refresh();
    });
  }

  const isSignUp = mode === "signup";

  return (
    <section className={styles.formCard}>
      <div className={styles.formHeader}>
        <div className={styles.formKicker}>{isSignUp ? t("auth_signUp") : t("auth_signIn")}</div>
        <h2>{isSignUp ? t("auth_createAccount") : t("auth_welcomeBack")}</h2>
        <p>
          {isSignUp
            ? t("auth_createDesc")
            : loginVariant === "doctor"
              ? "Access upcoming appointments and patient messages in your doctor workspace."
              : t("auth_accessDesc")}
        </p>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        {isSignUp ? (
          <label className={styles.field}>
            <span>{t("auth_fullName")}</span>
            <input
              type="text"
              placeholder={t("auth_fullNamePlaceholder")}
              value={signUpForm.fullName}
              onChange={(event) =>
                setSignUpForm((current) => ({
                  ...current,
                  fullName: event.target.value,
                }))
              }
            />
          </label>
        ) : null}

        <label className={styles.field}>
          <span>{t("auth_email")}</span>
          <input
            type="email"
            placeholder={t("auth_emailPlaceholder")}
            value={isSignUp ? signUpForm.email : signInForm.email}
            onChange={(event) =>
              isSignUp
                ? setSignUpForm((current) => ({
                    ...current,
                    email: event.target.value,
                  }))
                : setSignInForm((current) => ({
                    ...current,
                    email: event.target.value,
                  }))
            }
          />
        </label>

        <label className={styles.field}>
          <span>{isSignUp ? t("auth_createPassword") : t("auth_password")}</span>
          <input
            type="password"
            placeholder={isSignUp ? t("auth_createPasswordPlaceholder") : t("auth_passwordPlaceholder")}
            value={isSignUp ? signUpForm.password : signInForm.password}
            onChange={(event) =>
              isSignUp
                ? setSignUpForm((current) => ({
                    ...current,
                    password: event.target.value,
                  }))
                : setSignInForm((current) => ({
                    ...current,
                    password: event.target.value,
                  }))
            }
          />
        </label>

        {isSignUp ? (
          <div className={styles.formMeta}>
            <label className={styles.checkbox}>
              <input
                type="checkbox"
                checked={signUpForm.acceptedTerms}
                onChange={(event) =>
                  setSignUpForm((current) => ({
                    ...current,
                    acceptedTerms: event.target.checked,
                  }))
                }
              />
              <span>{t("auth_agreeTerms")}</span>
            </label>

            <div className={styles.memberPrompt}>
              <span>{t("auth_alreadyMember")}</span>
              <Link
                href="/auth"
                onClick={(event) => {
                  event.preventDefault();
                  switchMode("signin");
                }}
              >
                {t("auth_signInLink")}
              </Link>
            </div>
          </div>
        ) : (
          <div className={styles.signInMeta}>
            <label className={styles.checkbox}>
              <input
                type="checkbox"
                checked={signInForm.keepSignedIn}
                onChange={(event) =>
                  setSignInForm((current) => ({
                    ...current,
                    keepSignedIn: event.target.checked,
                  }))
                }
              />
              <span>{t("auth_keepSignedIn")}</span>
            </label>

            <div className={styles.signInMetaRow}>
              <Link className={styles.helperLink} href="/forgot-password">
                {t("auth_forgotPassword")}
              </Link>

              {allowSignUp ? (
                <div className={styles.memberPrompt}>
                  <span>{t("auth_notMember")}</span>
                  <Link
                    href="/auth?mode=signup"
                    onClick={(event) => {
                      event.preventDefault();
                      switchMode("signup");
                    }}
                  >
                    {t("auth_signUpLink")}
                  </Link>
                </div>
              ) : null}
            </div>
          </div>
        )}

        {error ? <p className={styles.errorText}>{error}</p> : null}

        <button className={styles.primaryButton} type="submit" disabled={isPending}>
          {isPending
            ? t("auth_pleaseWait")
            : isSignUp
              ? t("auth_createAccountBtn")
              : t("auth_signIn")}
        </button>
      </form>
    </section>
  );
}
