"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import type { Doctor } from "@/scheduling/types/scheduling";
import { getDoctorsBySpecialty } from "@/scheduling/lib/scheduling-data";

interface DoctorPickerProps {
  specialtyId: string;
  specialtyName: string;
  selectedDoctorId: string | null;
  onSelect: (doctor: Doctor) => void;
  onBack: () => void;
  onContinue: () => void;
}

const FILTER_KEYS = ["doctor_filterAll", "doctor_filterAvailable", "doctor_filterMale", "doctor_filterFemale", "doctor_filterSenior"] as const;

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function DoctorPicker({
  specialtyId,
  specialtyName,
  selectedDoctorId,
  onSelect,
  onBack,
  onContinue,
}: DoctorPickerProps) {
  const { t } = useLanguage();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<(typeof FILTER_KEYS)[number]>("doctor_filterAll");

  useEffect(() => {
    setLoading(true);
    getDoctorsBySpecialty(specialtyId)
      .then(setDoctors)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [specialtyId]);

  if (loading) {
    return (
      <div className="w-full max-w-6xl rounded border bg-white p-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="mb-4 h-40 rounded border bg-gray-100 animate-pulse last:mb-0" />
        ))}
      </div>
    );
  }

  if (doctors.length === 0) {
    return <p className="py-8 text-center text-gray-500">{t("doctor_noDoctors")}</p>;
  }

  const visibleDoctors = doctors.filter((doc) => {
    const normalizedQuery = query.trim().toLowerCase();
    const matchesQuery =
      !normalizedQuery ||
      doc.name.toLowerCase().includes(normalizedQuery) ||
      doc.bio.toLowerCase().includes(normalizedQuery);

    if (!matchesQuery) return false;

    if (activeFilter === "doctor_filterAll" || activeFilter === "doctor_filterAvailable") {
      return true;
    }

    return false;
  });

  return (
    <div className="w-full max-w-6xl rounded border bg-white p-8 sm:p-10 lg:translate-x-[60px]">
      <div className="mb-10">
        <h2 className="text-3xl font-semibold text-gray-900">
          {t("doctor_title")}
        </h2>
        <p className="mt-3 max-w-4xl text-lg leading-8 text-gray-600">
          {t("doctor_text_1")}<span className="font-semibold text-gray-900">{specialtyName}</span>{t("doctor_text_2")}
        </p>
      </div>

      <label className="mb-6 flex items-center gap-4 rounded border border-gray-200 px-4 py-3">
        <span className="text-xl text-gray-400">⌕</span>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t("doctor_searchPlaceholder")}
          className="w-full border-0 bg-transparent text-lg text-gray-900 outline-none placeholder:text-gray-400"
        />
      </label>

      <div className="mb-8 flex flex-wrap gap-3">
        {FILTER_KEYS.map((filterKey) => {
          const isActive = filterKey === activeFilter;

          return (
            <button
              key={filterKey}
              type="button"
              onClick={() => setActiveFilter(filterKey)}
              className={`rounded border px-4 py-2 text-base ${
                isActive
                  ? "border-gray-900 bg-gray-900 text-white"
                  : "border-gray-200 bg-white text-gray-600"
              }`}
            >
              {t(filterKey)}
            </button>
          );
        })}
      </div>

      <div className="grid gap-4">
        {visibleDoctors.map((doc) => (
          <button
            key={doc.id}
            onClick={() => onSelect(doc)}
            className={`flex w-full items-start gap-4 rounded border p-6 text-left ${
              selectedDoctorId === doc.id
                ? "border-gray-900 bg-gray-50"
                : "border-gray-200 bg-white"
            }`}
          >
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gray-100 text-base font-bold text-gray-700">
              {getInitials(doc.name)}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-2xl font-semibold text-gray-900">{doc.name}</p>
                  <p className="mt-1 text-lg text-gray-500">{doc.bio}</p>
                </div>
                <span className="inline-flex rounded border border-gray-200 px-3 py-1 text-sm font-medium text-gray-600">
                  {t("doctor_available")}
                </span>
              </div>

              <p className="mt-4 text-lg leading-8 text-gray-600">
                {t("doctor_selectText")}
              </p>
              <div className="mt-5 text-lg font-medium text-gray-900">{t("doctor_viewDates")}</div>
            </div>
          </button>
        ))}
      </div>

      {visibleDoctors.length === 0 ? (
        <div className="mt-6 rounded border border-dashed border-gray-300 px-6 py-10 text-center text-lg text-gray-500">
          {t("doctor_noMatch")}
        </div>
      ) : null}

      <div className="mt-10 flex items-center justify-between border-t pt-8">
        <button
          onClick={onBack}
          className="rounded border border-gray-300 px-6 py-3 text-base text-gray-700"
        >
          {t("doctor_back")}
        </button>
        <button
          onClick={onContinue}
          disabled={!selectedDoctorId}
          className="rounded border bg-gray-900 px-6 py-3 text-base font-medium text-white disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-100 disabled:text-gray-400"
        >
          {t("doctor_continue")}
        </button>
      </div>
    </div>
  );
}
