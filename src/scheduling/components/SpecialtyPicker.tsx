"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import type { Specialty } from "@/scheduling/types/scheduling";
import { getSpecialties } from "@/scheduling/lib/scheduling-data";

interface SpecialtyPickerProps {
  selectedSpecialtyId: string | null;
  onSelect: (specialty: Specialty) => void;
  onContinue: () => void;
}


function getSpecialtyIcon(name: string) {
  switch (name.toLowerCase()) {
    case "cardiology":
      return "♡";
    case "neurology":
      return "◉";
    case "orthopedics":
      return "⌁";
    case "dermatology":
      return "✦";
    case "pediatrics":
      return "☺";
    case "ophthalmology":
      return "◌";
    case "oncology":
      return "⟟";
    default:
      return "⌁";
  }
}

export function SpecialtyPicker({
  selectedSpecialtyId,
  onSelect,
  onContinue,
}: SpecialtyPickerProps) {
  const { t } = useLanguage();
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSpecialties()
      .then(setSpecialties)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="w-full max-w-6xl rounded border bg-white p-8">
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-36 rounded border bg-gray-100 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const showPlaceholderCard = specialties.length % 3 !== 0;
  const placeholdersNeeded = showPlaceholderCard ? 3 - (specialties.length % 3) : 0;

  return (
    <div className="mx-auto w-full max-w-6xl rounded border bg-white p-6 sm:p-8">
      <div className="mb-8 w-full">
        <h2 className="text-2xl font-semibold text-gray-900 sm:text-3xl">
          {t("specialty_title")}
        </h2>
        <p className="mt-3 max-w-3xl text-base leading-7 text-gray-600 sm:text-lg">
          {t("specialty_text")}
        </p>
      </div>

      <div className="grid w-full gap-4 md:grid-cols-2 xl:grid-cols-3">
        {specialties.map((s) => (
          <button
            key={s.id}
            onClick={() => onSelect(s)}
            className={`flex min-h-[152px] flex-col justify-start rounded border p-5 text-left ${
              selectedSpecialtyId === s.id
                ? "border-gray-900 bg-gray-50"
                : "border-gray-200 bg-white"
            }`}
          >
            <div className="mb-5 flex h-10 w-10 items-center justify-center rounded bg-gray-100 text-xl text-gray-700">
              {getSpecialtyIcon(s.name)}
            </div>
            <div className="text-[1.1rem] font-semibold text-gray-900">{s.name}</div>
            <div className="mt-2 text-base leading-7 text-gray-600">
              {t("specialty_description")}
            </div>
          </button>
        ))}

        {Array.from({ length: placeholdersNeeded }).map((_, index) => (
          <div
            key={`placeholder-${index}`}
            className="flex min-h-[152px] flex-col justify-start rounded border border-dashed border-gray-300 bg-gray-50 p-5 text-left"
          >
            <div className="mb-5 flex h-10 w-10 items-center justify-center rounded border bg-white text-xl text-gray-400">
              +
            </div>
            <div className="text-[1.1rem] font-semibold text-gray-600">
              {t("specialty_moreSoon")}
            </div>
            <div className="mt-2 text-base leading-7 text-gray-500">
              {t("specialty_moreText")}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex w-full justify-end border-t pt-6">
        <button
          onClick={onContinue}
          disabled={!selectedSpecialtyId}
          className="inline-flex items-center justify-center rounded border bg-gray-900 px-6 py-3 text-base font-medium text-white disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-100 disabled:text-gray-400"
        >
          {t("specialty_continue")}
        </button>
      </div>
    </div>
  );
}
