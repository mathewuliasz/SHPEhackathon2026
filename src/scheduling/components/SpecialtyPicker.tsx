"use client";

import { useEffect, useState } from "react";
import type { Specialty } from "@/scheduling/types/scheduling";
import { getSpecialties } from "@/scheduling/lib/scheduling-data";

interface SpecialtyPickerProps {
  onSelect: (specialty: Specialty) => void;
}

export function SpecialtyPicker({ onSelect }: SpecialtyPickerProps) {
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
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-28 rounded-xl bg-gray-100 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-1">Choose a Specialty</h2>
      <p className="text-gray-500 text-sm mb-4">Select the type of care you need</p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {specialties.map((s) => (
          <button
            key={s.id}
            onClick={() => onSelect(s)}
            className="flex flex-col items-center justify-center gap-2 p-6 rounded-xl border border-gray-200 bg-white hover:shadow-lg hover:border-blue-500 transition-all cursor-pointer"
          >
            <span className="text-3xl">{s.icon}</span>
            <span className="text-sm font-medium text-gray-800">{s.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
