"use client";

import Link from "next/link";
import type { Specialty, Doctor } from "@/scheduling/types/scheduling";

interface ConfirmationProps {
  specialty: Specialty;
  doctor: Doctor;
  date: string;
  time: string;
  zoomLink?: string | null;
  onReset: () => void;
}

function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString("en-US", {
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

export function Confirmation({ specialty, doctor, date, time, zoomLink, onReset }: ConfirmationProps) {
  return (
    <div className="text-center py-6">
      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
        <span className="text-3xl">✓</span>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
      <p className="text-gray-500 mb-6">
        Your appointment has been successfully scheduled.
      </p>

      <div className="bg-white rounded-xl border border-gray-200 p-5 text-left space-y-3 max-w-sm mx-auto mb-6">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide">Specialty</p>
          <p className="font-medium text-gray-800">
            {specialty.icon} {specialty.name}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide">Doctor</p>
          <p className="font-medium text-gray-800">{doctor.name}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide">Date</p>
          <p className="font-medium text-gray-800">{formatDate(date)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide">Time</p>
          <p className="font-medium text-gray-800">{formatTime(time)}</p>
        </div>
        {zoomLink && (
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide">Video Call</p>
            <a
              href={zoomLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-1 px-4 py-2 rounded-lg bg-blue-50 text-blue-700 font-medium hover:bg-blue-100 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4 3a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3l4 3V6l-4 3V5a2 2 0 0 0-2-2H4z"/>
              </svg>
              Join Zoom Meeting
            </a>
          </div>
        )}
      </div>

      <p className="text-sm text-gray-500 mb-6">
        You should be receiving a confirmation email shortly.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link
          href={`/dashboard/consultations/${doctor.id}`}
          className="px-6 py-2.5 rounded-xl font-semibold text-white bg-green-600 hover:bg-green-700 transition-colors inline-flex items-center gap-2"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          Go to Consultation Chat
        </Link>
        <Link
          href="/dashboard"
          className="px-6 py-2.5 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors"
        >
          Back to Dashboard
        </Link>
        <button
          onClick={onReset}
          className="px-6 py-2.5 rounded-xl font-semibold text-blue-600 border border-blue-600 hover:bg-blue-50 transition-colors"
        >
          Schedule Another
        </button>
      </div>
    </div>
  );
}
