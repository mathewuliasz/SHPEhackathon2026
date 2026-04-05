"use client";

import { useState, useTransition } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import styles from "./page.module.css";

type VolunteerApplicationFormProps = {
  specialties: readonly string[];
  experienceRanges: readonly string[];
  languages: readonly string[];
  availability: readonly string[];
  monthlyHours: readonly string[];
};

export function VolunteerApplicationForm({
  specialties,
  experienceRanges,
  languages,
  availability,
  monthlyHours,
}: VolunteerApplicationFormProps) {
  const { t } = useLanguage();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    medicalLicenseNumber: "",
    licensingState: "",
    primarySpecialty: "",
    yearsOfExperience: "",
    languages: [] as string[],
    availability: ["Weekend afternoons"],
    hoursPerMonth: "",
    motivation: "",
    acceptedTerms: false,
  });

  function toggleChoice(field: "languages" | "availability", value: string) {
    setForm((current) => {
      const values = current[field];
      const nextValues = values.includes(value)
        ? values.filter((item) => item !== value)
        : [...values, value];

      return {
        ...current,
        [field]: nextValues,
      };
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    startTransition(async () => {
      const response = await fetch("/api/volunteer-applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = (await response.json().catch(() => null)) as
        | { error?: string }
        | null;

      if (!response.ok) {
        setError(data?.error ?? t("volForm_error"));
        return;
      }

      setSuccess(t("volForm_success"));
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        medicalLicenseNumber: "",
        licensingState: "",
        primarySpecialty: "",
        yearsOfExperience: "",
        languages: [],
        availability: ["Weekend afternoons"],
        hoursPerMonth: "",
        motivation: "",
        acceptedTerms: false,
      });
    });
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <section className={styles.formSection}>
        <div className={styles.sectionHeader}>
          <span className={styles.stepNumber}>1</span>
          <h2>{t("volForm_section1")}</h2>
        </div>

        <div className={styles.fieldGrid}>
          <label className={styles.field}>
            <span>
              {t("volForm_firstName")} <em>*</em>
            </span>
            <input
              placeholder="Maria"
              type="text"
              value={form.firstName}
              onChange={(event) => setForm((current) => ({ ...current, firstName: event.target.value }))}
            />
          </label>
          <label className={styles.field}>
            <span>
              {t("volForm_lastName")} <em>*</em>
            </span>
            <input
              placeholder="Gonzalez"
              type="text"
              value={form.lastName}
              onChange={(event) => setForm((current) => ({ ...current, lastName: event.target.value }))}
            />
          </label>
          <label className={styles.field}>
            <span>
              {t("volForm_email")} <em>*</em>
            </span>
            <input
              placeholder="doctor@example.com"
              type="email"
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            />
          </label>
          <label className={styles.field}>
            <span>{t("volForm_phone")}</span>
            <input
              placeholder="(555) 000-0000"
              type="tel"
              value={form.phoneNumber}
              onChange={(event) => setForm((current) => ({ ...current, phoneNumber: event.target.value }))}
            />
          </label>
        </div>
      </section>

      <section className={styles.formSection}>
        <div className={styles.sectionHeader}>
          <span className={styles.stepNumber}>2</span>
          <h2>{t("volForm_section2")}</h2>
        </div>

        <div className={styles.fieldGrid}>
          <label className={styles.field}>
            <span>
              {t("volForm_license")} <em>*</em>
            </span>
            <input
              placeholder="TX-123456"
              type="text"
              value={form.medicalLicenseNumber}
              onChange={(event) =>
                setForm((current) => ({ ...current, medicalLicenseNumber: event.target.value }))
              }
            />
          </label>
          <label className={styles.field}>
            <span>
              {t("volForm_state")} <em>*</em>
            </span>
            <input
              placeholder="Texas"
              type="text"
              value={form.licensingState}
              onChange={(event) => setForm((current) => ({ ...current, licensingState: event.target.value }))}
            />
          </label>
          <label className={styles.field}>
            <span>
              {t("volForm_specialty")} <em>*</em>
            </span>
            <select
              value={form.primarySpecialty}
              onChange={(event) => setForm((current) => ({ ...current, primarySpecialty: event.target.value }))}
            >
              <option value="" disabled>
                {t("volForm_selectSpecialty")}
              </option>
              {specialties.map((specialty) => (
                <option key={specialty} value={specialty}>
                  {specialty}
                </option>
              ))}
            </select>
          </label>
          <label className={styles.field}>
            <span>{t("volForm_experience")}</span>
            <select
              value={form.yearsOfExperience}
              onChange={(event) => setForm((current) => ({ ...current, yearsOfExperience: event.target.value }))}
            >
              <option value="" disabled>
                {t("volForm_selectRange")}
              </option>
              {experienceRanges.map((range) => (
                <option key={range} value={range}>
                  {range}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <section className={styles.formSection}>
        <div className={styles.sectionHeader}>
          <span className={styles.stepNumber}>3</span>
          <h2>{t("volForm_section3")}</h2>
        </div>

        <div className={styles.choiceBlock}>
          <h3>{t("volForm_languagesSpoken")}</h3>
          <div className={styles.pillRow}>
            {languages.map((item) => (
              <label
                key={item}
                className={`${styles.choicePill} ${form.languages.includes(item) ? styles.choicePillActive : ""}`}
              >
                <input
                  type="checkbox"
                  checked={form.languages.includes(item)}
                  onChange={() => toggleChoice("languages", item)}
                />
                <span>{item}</span>
              </label>
            ))}
          </div>
        </div>

        <div className={styles.choiceBlock}>
          <h3>{t("volForm_whenAvailable")}</h3>
          <div className={styles.pillRow}>
            {availability.map((item) => (
              <label
                key={item}
                className={`${styles.choicePill} ${form.availability.includes(item) ? styles.choicePillActive : ""}`}
              >
                <input
                  type="checkbox"
                  checked={form.availability.includes(item)}
                  onChange={() => toggleChoice("availability", item)}
                />
                <span>{item}</span>
              </label>
            ))}
          </div>
        </div>

        <div className={styles.singleFieldRow}>
          <label className={styles.field}>
            <span>{t("volForm_hoursPerMonth")}</span>
            <select
              value={form.hoursPerMonth}
              onChange={(event) => setForm((current) => ({ ...current, hoursPerMonth: event.target.value }))}
            >
              <option value="" disabled>
                {t("volForm_selectHours")}
              </option>
              {monthlyHours.map((range) => (
                <option key={range} value={range}>
                  {range}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <section className={styles.formSection}>
        <div className={styles.sectionHeader}>
          <span className={styles.stepNumber}>4</span>
          <h2>{t("volForm_section4")}</h2>
        </div>

        <label className={`${styles.field} ${styles.fieldFull}`}>
          <textarea
            placeholder={t("volForm_motivationPlaceholder")}
            rows={6}
            value={form.motivation}
            onChange={(event) => setForm((current) => ({ ...current, motivation: event.target.value }))}
          />
        </label>
      </section>

      <div className={styles.formFooter}>
        <label className={styles.checkboxRow}>
          <input
            type="checkbox"
            checked={form.acceptedTerms}
            onChange={(event) => setForm((current) => ({ ...current, acceptedTerms: event.target.checked }))}
          />
          <span>{t("volForm_terms")}</span>
        </label>

        {error ? <p className={styles.errorMessage}>{error}</p> : null}
        {success ? <p className={styles.successMessage}>{success}</p> : null}

        <button className={styles.submitButton} type="submit" disabled={isPending}>
          {isPending ? t("volForm_submitting") : t("volForm_submit")} <span aria-hidden="true">→</span>
        </button>
      </div>
    </form>
  );
}
