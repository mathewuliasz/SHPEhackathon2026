"use client";

import { useEffect, useState } from "react";
import type { Doctor } from "@/scheduling/types/scheduling";
import { getDoctorsBySpecialty } from "@/scheduling/lib/scheduling-data";

interface DoctorPickerProps {
  specialtyId: string;
  onSelect: (doctor: Doctor) => void;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function DoctorPicker({ specialtyId, onSelect }: DoctorPickerProps) {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getDoctorsBySpecialty(specialtyId)
      .then(setDoctors)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [specialtyId]);

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-20 rounded-xl bg-gray-100 animate-pulse" />
        ))}
      </div>
    );
  }

  if (doctors.length === 0) {
    return <p className="text-gray-500 text-center py-8">No doctors found for this specialty.</p>;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-1">Choose a Doctor</h2>
      <p className="text-gray-500 text-sm mb-4">Select a doctor to schedule with</p>
      <div className="space-y-3">
        {doctors.map((doc) => (
          <button
            key={doc.id}
            onClick={() => onSelect(doc)}
            className="w-full flex items-center gap-4 p-4 rounded-xl border border-gray-200 bg-white hover:shadow-lg hover:border-blue-500 transition-all cursor-pointer text-left"
          >
            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm shrink-0">
              {getInitials(doc.name)}
            </div>
            <div>
              <p className="font-semibold text-gray-800">{doc.name}</p>
              <p className="text-sm text-gray-500">{doc.bio}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
