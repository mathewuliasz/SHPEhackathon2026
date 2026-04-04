"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import styles from "./page.module.css";

type AuthCardProps = {
  initialMode: "signin" | "signup";
};

export function AuthCard({ initialMode }: AuthCardProps) {
  const router = useRouter();
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
          };

    startTransition(async () => {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await response.json().catch(() => null)) as
        | { error?: string }
        | null;

      if (!response.ok) {
        setError(data?.error ?? "Something went wrong. Please try again.");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    });
  }

  const isSignUp = mode === "signup";

  return (
    <section className={styles.formCard}>
      <div className={styles.formHeader}>
        <div className={styles.formKicker}>{isSignUp ? "Sign Up" : "Sign In"}</div>
        <h2>{isSignUp ? "Create your account" : "Welcome back"}</h2>
        <p>
          {isSignUp
            ? "Set up your patient profile to request and manage care."
            : "Access your appointments, records, and provider messages."}
        </p>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        {isSignUp ? (
          <label className={styles.field}>
            <span>Full Name</span>
            <input
              type="text"
              placeholder="Enter your full name"
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
          <span>Email Address</span>
          <input
            type="email"
            placeholder="you@example.com"
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
          <span>{isSignUp ? "Create Password" : "Password"}</span>
          <input
            type="password"
            placeholder={isSignUp ? "Choose a secure password" : "Enter your password"}
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
              <span>I agree to the patient privacy and care terms.</span>
            </label>

            <div className={styles.memberPrompt}>
              <span>Already a member?</span>
              <Link
                href="/auth"
                onClick={(event) => {
                  event.preventDefault();
                  switchMode("signin");
                }}
              >
                Sign in
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
              <span>Keep me signed in</span>
            </label>

            <div className={styles.signInMetaRow}>
              <Link className={styles.helperLink} href="/forgot-password">
                Forgot password?
              </Link>

              <div className={styles.memberPrompt}>
                <span>Not a member?</span>
                <Link
                  href="/auth?mode=signup"
                  onClick={(event) => {
                    event.preventDefault();
                    switchMode("signup");
                  }}
                >
                  Sign up
                </Link>
              </div>
            </div>
          </div>
        )}

        {error ? <p className={styles.errorText}>{error}</p> : null}

        <button className={styles.primaryButton} type="submit" disabled={isPending}>
          {isPending
            ? "Please wait..."
            : isSignUp
              ? "Create Account"
              : "Sign In"}
        </button>
      </form>
    </section>
  );
}
