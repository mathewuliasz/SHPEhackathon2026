"use client";

import { useEffect, useState } from "react";
import type { Specialty } from "@/scheduling/types/scheduling";
import { getSpecialties } from "@/scheduling/lib/scheduling-data";

interface SpecialtyPickerProps {
  selectedSpecialtyId: string | null;
  onSelect: (specialty: Specialty) => void;
  onContinue: () => void;
}

function getSpecialtyDescription(): string {
  return "Explore doctors and available visit times.";
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
      <div className="rounded-[28px] border border-[#dbe2ec] bg-white p-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="mb-4 h-48 rounded-[28px] bg-[#eef2f6] animate-pulse last:mb-0" />
        ))}
      </div>
    );
  }

  const showPlaceholderCard = specialties.length % 2 !== 0;

  return (
    <div className="mx-auto flex w-full max-w-[78rem] justify-center rounded-[32px] border border-[#dfe6ef] bg-[#fbfcfe] p-4 shadow-[0_14px_32px_rgba(34,49,73,0.05)] sm:p-5 lg:p-6">
      <div className="w-full max-w-6xl rounded-[28px] border border-[#dbe2ec] bg-white px-6 py-7 shadow-[0_10px_24px_rgba(34,49,73,0.05)] sm:px-8 sm:py-8 lg:px-10 lg:py-10">
        <div className="mx-auto mb-8 w-full max-w-3xl">
            <div>
              <h2 className="text-2xl font-semibold tracking-[-0.03em] text-[#27313f] sm:text-3xl">
                Choose a Specialty
              </h2>
              <p className="mt-3 max-w-3xl text-base leading-7 text-[#7f8a98] sm:text-lg">
                Start with the type of care you need and we&apos;ll narrow the provider list to
                the right team.
              </p>
            </div>
        </div>

        <div className="mx-auto grid w-full max-w-5xl items-stretch gap-4 md:grid-cols-2 xl:grid-cols-3">
            {specialties.map((s) => (
              <button
                key={s.id}
                onClick={() => onSelect(s)}
                className={`flex min-h-[152px] flex-col justify-start rounded-[18px] border p-5 text-left transition-all ${
                  selectedSpecialtyId === s.id
                    ? "border-[#6f9cff] bg-[#f7fbff] shadow-[0_0_0_1px_#6f9cff]"
                    : "border-[#dbe2ec] hover:border-[#c8d4e4]"
                }`}
              >
                <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#eef4fb] text-xl text-[#4a84ec]">
                  {getSpecialtyIcon(s.name)}
                </div>
                <div className="text-[1.1rem] font-semibold text-[#27313f]">{s.name}</div>
                <div className="mt-2 text-base leading-7 text-[#7f8a98]">
                  {getSpecialtyDescription()}
                </div>
              </button>
            ))}

            {showPlaceholderCard ? (
              <div className="flex min-h-[152px] flex-col justify-start rounded-[18px] border border-[#dbe2ec] bg-[#fbfcfe] p-5 text-left">
                <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-[14px] bg-white text-xl text-[#b7c0cc] shadow-[inset_0_0_0_1px_#e5ebf3]">
                  +
                </div>
                <div className="text-[1.1rem] font-semibold text-[#7f8a98]">
                  More Specialties Soon
                </div>
                <div className="mt-2 text-base leading-7 text-[#9aa4b1]">
                  Additional care categories can be added here as the provider network grows.
                </div>
              </div>
            ) : null}
        </div>

        <div className="mx-auto mt-8 flex w-full max-w-5xl justify-end border-t border-[#edf1f5] pt-6">
          <button
            onClick={onContinue}
            disabled={!selectedSpecialtyId}
            className="inline-flex items-center justify-center rounded-full bg-[#4a84ec] px-8 py-3.5 text-lg font-medium text-white transition-opacity disabled:cursor-not-allowed disabled:bg-[#f0f3f7] disabled:text-[#c2c9d2]"
          >
            Continue →
          </button>
        </div>
      </div>
    </div>
  );
}
