"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";
import type { Specialty, Doctor } from "@/scheduling/types/scheduling";

interface ConfirmationProps {
  specialty: Specialty;
  doctor: Doctor;
  date: string;
  time: string;
  zoomLink?: string | null;
  onReset: () => void;
}

function formatDate(dateStr: string, locale: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString(locale, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatTime(time24: string): string {
  const [h, m] = time24.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}

export function Confirmation({
  specialty,
  doctor,
  date,
  time,
  zoomLink,
  onReset,
}: ConfirmationProps) {
  const { t, lang } = useLanguage();
  const locale = lang === "es" ? "es-ES" : "en-US";

  return (
    <div className="rounded-[30px] border border-[#d9eadf] bg-[linear-gradient(180deg,#f9fffb,#ffffff)] px-6 py-10 text-center shadow-[0_24px_50px_rgba(60,122,89,0.10)] sm:px-8">
      <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-[28px] bg-[linear-gradient(135deg,#dff7e7,#f4fff7)] text-[#2f8a5d] shadow-[0_14px_30px_rgba(57,145,92,0.14)]">
        <span className="text-4xl">✓</span>
      </div>
      <h2 className="mb-3 text-3xl font-bold tracking-[-0.03em] text-[#23324b]">
        {t("confirm_title")}
      </h2>
      <p className="mx-auto mb-8 max-w-xl text-sm leading-7 text-[#6d7d96] sm:text-base">
        {t("confirm_text")}
      </p>

      <div className="mx-auto mb-8 grid max-w-3xl gap-4 text-left md:grid-cols-2">
        <div className="rounded-[24px] border border-[#e2eaf5] bg-white p-5 shadow-[0_12px_26px_rgba(80,103,144,0.06)]">
          <p className="text-[11px] uppercase tracking-[0.18em] text-[#8ba0bf]">{t("confirm_labelSpecialty")}</p>
          <p className="mt-2 font-medium text-[#24334c]">
            {specialty.icon} {specialty.name}
          </p>
        </div>
        <div className="rounded-[24px] border border-[#e2eaf5] bg-white p-5 shadow-[0_12px_26px_rgba(80,103,144,0.06)]">
          <p className="text-[11px] uppercase tracking-[0.18em] text-[#8ba0bf]">{t("confirm_labelDoctor")}</p>
          <p className="mt-2 font-medium text-[#24334c]">{doctor.name}</p>
        </div>
        <div className="rounded-[24px] border border-[#e2eaf5] bg-white p-5 shadow-[0_12px_26px_rgba(80,103,144,0.06)]">
          <p className="text-[11px] uppercase tracking-[0.18em] text-[#8ba0bf]">{t("confirm_labelDate")}</p>
          <p className="mt-2 font-medium text-[#24334c]">{formatDate(date, locale)}</p>
        </div>
        <div className="rounded-[24px] border border-[#e2eaf5] bg-white p-5 shadow-[0_12px_26px_rgba(80,103,144,0.06)]">
          <p className="text-[11px] uppercase tracking-[0.18em] text-[#8ba0bf]">{t("confirm_labelTime")}</p>
          <p className="mt-2 font-medium text-[#24334c]">{formatTime(time)}</p>
        </div>
      </div>

      {zoomLink ? (
        <div className="mb-8 flex justify-center">
          <a
            href={zoomLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-[20px] bg-[#eaf3ff] px-6 py-3 font-semibold text-[#3565d8] transition-colors hover:bg-[#dcecff]"
          >
            {t("confirm_joinZoom")}
          </a>
        </div>
      ) : null}

      <p className="mb-8 text-sm text-[#6d7d96]">
        {t("confirm_emailNotice")}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link
          href={`/dashboard/consultations/${doctor.id}`}
          className="rounded-[20px] bg-[#2f8a5d] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#27744f]"
        >
          {t("confirm_goToChat")}
        </Link>
        <Link
          href="/dashboard"
          className="rounded-[20px] bg-[#3565d8] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#2b56bb]"
        >
          {t("confirm_backToDashboard")}
        </Link>
        <button
          onClick={onReset}
          className="rounded-[20px] border border-[#bfd1ee] bg-white px-6 py-3 font-semibold text-[#3565d8] transition-colors hover:bg-[#f4f8ff]"
        >
          {t("confirm_scheduleAnother")}
        </button>
      </div>
    </div>
  );
}
