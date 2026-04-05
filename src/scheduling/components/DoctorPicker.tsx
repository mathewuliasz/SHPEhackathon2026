"use client";

import { useEffect, useState } from "react";
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

const FILTERS = ["All", "Available", "Male", "Female", "Senior (10+ yrs)"] as const;

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
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<(typeof FILTERS)[number]>("All");

  useEffect(() => {
    setLoading(true);
    getDoctorsBySpecialty(specialtyId)
      .then(setDoctors)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [specialtyId]);

  if (loading) {
    return (
      <div className="rounded-[32px] border border-[#dbe2ec] bg-white p-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="mb-4 h-40 rounded-[24px] bg-[#eef2f6] animate-pulse last:mb-0" />
        ))}
      </div>
    );
  }

  if (doctors.length === 0) {
    return <p className="py-8 text-center text-gray-500">No doctors found for this specialty.</p>;
  }

  const visibleDoctors = doctors.filter((doc) => {
    const normalizedQuery = query.trim().toLowerCase();
    const matchesQuery =
      !normalizedQuery ||
      doc.name.toLowerCase().includes(normalizedQuery) ||
      doc.bio.toLowerCase().includes(normalizedQuery);

    if (!matchesQuery) return false;

    if (activeFilter === "All" || activeFilter === "Available") {
      return true;
    }

    return false;
  });

  return (
    <div className="rounded-[32px] border border-[#dbe2ec] bg-white p-8 shadow-[0_12px_32px_rgba(34,49,73,0.06)] sm:p-10">
      <div className="mb-10">
        <h2 className="text-3xl font-semibold tracking-[-0.04em] text-[#27313f]">
          Choose a Doctor
        </h2>
        <p className="mt-3 max-w-4xl text-lg leading-8 text-[#7f8a98]">
          Providers in <span className="font-semibold text-[#414d60]">{specialtyName}</span> are
          listed below. Select the doctor you want to schedule with.
        </p>
      </div>

      <label className="mb-6 flex items-center gap-4 rounded-full border border-[#dbe2ec] px-5 py-4">
        <span className="text-2xl text-[#a4acb7]">⌕</span>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by name or keyword..."
          className="w-full border-0 bg-transparent text-lg text-[#27313f] outline-none placeholder:text-[#b0b8c3]"
        />
      </label>

      <div className="mb-8 flex flex-wrap gap-3">
        {FILTERS.map((filter) => {
          const isActive = filter === activeFilter;

          return (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              className={`rounded-full px-6 py-3 text-lg transition-colors ${
                isActive
                  ? "bg-[#4a84ec] text-white"
                  : "border border-[#dbe2ec] bg-[#f4f7fa] text-[#667282]"
              }`}
            >
              {filter}
            </button>
          );
        })}
      </div>

      <div className="grid gap-4">
        {visibleDoctors.map((doc) => (
          <button
            key={doc.id}
            onClick={() => onSelect(doc)}
            className={`flex w-full items-start gap-4 rounded-[24px] border p-6 text-left transition-all ${
              selectedDoctorId === doc.id
                ? "border-[#6f9cff] shadow-[0_0_0_1px_#6f9cff]"
                : "border-[#dbe2ec] hover:border-[#c8d4e4]"
            }`}
          >
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#eef4fb] text-base font-bold text-[#4a84ec]">
              {getInitials(doc.name)}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-2xl font-semibold text-[#27313f]">{doc.name}</p>
                  <p className="mt-1 text-lg text-[#8a94a2]">{doc.bio}</p>
                </div>
                <span className="inline-flex rounded-full border border-[#d8eee2] bg-[#eefaf3] px-4 py-2 text-sm font-semibold uppercase tracking-[0.08em] text-[#74bf8d]">
                  Available
                </span>
              </div>

              <p className="mt-4 text-lg leading-8 text-[#7f8a98]">
                Select this doctor to continue to available visit dates.
              </p>
              <div className="mt-5 text-xl font-medium text-[#4a84ec]">View dates →</div>
            </div>
          </button>
        ))}
      </div>

      {visibleDoctors.length === 0 ? (
        <div className="mt-6 rounded-[24px] border border-dashed border-[#dbe2ec] px-6 py-10 text-center text-lg text-[#98a2ad]">
          No doctors match this search yet.
        </div>
      ) : null}

      <div className="mt-10 flex items-center justify-between border-t border-[#edf1f5] pt-8">
        <button
          onClick={onBack}
          className="rounded-full border border-[#dbe2ec] px-6 py-3 text-lg text-[#647083]"
        >
          ← Back
        </button>
        <button
          onClick={onContinue}
          disabled={!selectedDoctorId}
          className="rounded-full bg-[#4a84ec] px-8 py-4 text-xl font-medium text-white transition-opacity disabled:cursor-not-allowed disabled:bg-[#f0f3f7] disabled:text-[#c2c9d2]"
        >
          Continue →
        </button>
      </div>
    </div>
  );
}
