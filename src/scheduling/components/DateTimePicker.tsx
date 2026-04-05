"use client";

import { useEffect, useState, useCallback } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { MonthCalendar } from "./MonthCalendar";
import { TimeSlotGrid } from "./TimeSlotGrid";
import { getAvailabilityForDoctor } from "@/scheduling/lib/scheduling-data";
import type { Availability, Doctor, Specialty } from "@/scheduling/types/scheduling";

interface DateTimePickerProps {
  doctorId: string;
  doctor: Doctor;
  specialty: Specialty;
  onConfirm: (date: string, time: string) => void;
  isBooking: boolean;
  onBack: () => void;
}

function formatDatePreview(dateStr: string | null, fallback: string, locale: string): string {
  if (!dateStr) return fallback;

  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(locale, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

function formatTimePreview(time24: string | null, fallback: string): string {
  if (!time24) return fallback;

  const [h, m] = time24.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}

export function DateTimePicker({
  doctorId,
  doctor,
  specialty,
  onConfirm,
  isBooking,
  onBack,
}: DateTimePickerProps) {
  const { t, lang } = useLanguage();
  const locale = lang === "es" ? "es-ES" : "en-US";
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [availabilityMap, setAvailabilityMap] = useState<Map<string, string[]>>(new Map());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAvailability = useCallback(async () => {
    setLoading(true);
    try {
      const data: Availability[] = await getAvailabilityForDoctor(doctorId, year, month);
      const map = new Map<string, string[]>();
      data.forEach((a) => {
        if (a.slots.length > 0) {
          map.set(a.date, a.slots);
        }
      });
      setAvailabilityMap(map);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [doctorId, year, month]);

  useEffect(() => {
    fetchAvailability();
  }, [fetchAvailability]);

  const handlePrevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else {
      setMonth((m) => m - 1);
    }
    setSelectedDate(null);
    setSelectedTime(null);
  };

  const handleNextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else {
      setMonth((m) => m + 1);
    }
    setSelectedDate(null);
    setSelectedTime(null);
  };

  const handleSelectDate = (date: string) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const availableDates = new Set(availabilityMap.keys());
  const slotsForDate = selectedDate ? availabilityMap.get(selectedDate) ?? [] : [];

  return (
    <div className="mx-auto w-full max-w-6xl lg:translate-x-[60px]">
      <div className="mb-10">
        <h2 className="text-3xl font-semibold text-gray-900">
          {t("dateTime_title")}
        </h2>
        <p className="mt-3 max-w-4xl text-lg leading-8 text-gray-600">
          {t("dateTime_text_1")}<span className="font-semibold text-gray-900">{doctor.name}</span>.
        </p>
      </div>

      {loading ? (
        <div className="h-72 rounded border bg-gray-100 animate-pulse" />
      ) : (
        <div className="space-y-8">
          <div className="rounded border border-gray-200 bg-white px-6 py-8 sm:px-8 sm:py-10">
            <MonthCalendar
              year={year}
              month={month}
              availableDates={availableDates}
              selectedDate={selectedDate}
              onSelectDate={handleSelectDate}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
            />

            <div className="mt-8 border-t pt-8">
              <TimeSlotGrid
                slots={slotsForDate}
                selectedTime={selectedTime}
                onSelectTime={setSelectedTime}
                selectedDate={selectedDate}
              />
            </div>
          </div>

          <div className="rounded border border-gray-200 bg-white p-8">
            <h3 className="mb-8 text-3xl font-semibold text-gray-900">
              {t("dateTime_summaryTitle")}
            </h3>

            <div className="space-y-6">
              <SummaryRow label={t("dateTime_labelDoctor")} value={doctor.name} detail={doctor.bio} icon="◉" />
              <SummaryRow label={t("dateTime_labelSpecialty")} value={specialty.name} detail="" icon="⌁" />
              <SummaryRow
                label={t("dateTime_labelDate")}
                value={formatDatePreview(selectedDate, t("dateTime_notSelected"), locale)}
                detail=""
                icon="□"
                muted={!selectedDate}
              />
              <SummaryRow
                label={t("dateTime_labelTime")}
                value={formatTimePreview(selectedTime, t("dateTime_notSelected"))}
                detail=""
                icon="◔"
                muted={!selectedTime}
              />
            </div>

            <div className="mt-8 border-t pt-8">
              <button
                disabled={!selectedDate || !selectedTime || isBooking}
                onClick={() => selectedDate && selectedTime && onConfirm(selectedDate, selectedTime)}
                className="w-full rounded border border-gray-200 bg-gray-100 px-8 py-4 text-lg font-medium text-gray-500 disabled:cursor-not-allowed"
              >
                {isBooking ? t("dateTime_booking") : t("dateTime_confirmBooking")}
              </button>
              <p className="mt-4 text-center text-base text-gray-500">
                {selectedDate && selectedTime
                  ? t("dateTime_ready")
                  : t("dateTime_selectPrompt")}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between border-t pt-8">
            <button
              onClick={onBack}
              className="rounded border border-gray-300 px-6 py-3 text-base text-gray-700"
            >
              {t("dateTime_back")}
            </button>
            <button
              disabled={!selectedDate || !selectedTime || isBooking}
              onClick={() => selectedDate && selectedTime && onConfirm(selectedDate, selectedTime)}
              className="rounded border bg-gray-900 px-6 py-3 text-base font-medium text-white disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-100 disabled:text-gray-400"
            >
              {isBooking ? t("dateTime_booking") : t("dateTime_confirmBookingArrow")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryRow({
  label,
  value,
  detail,
  icon,
  muted = false,
}: {
  label: string;
  value: string;
  detail: string;
  icon: string;
  muted?: boolean;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-xl text-gray-700">
        {icon}
      </div>
      <div>
        <div className="text-sm font-semibold uppercase tracking-[0.12em] text-gray-400">
          {label}
        </div>
        <div className={`mt-1 text-xl font-medium ${muted ? "text-gray-400" : "text-gray-900"}`}>
          {value}
        </div>
        {detail ? <div className="mt-1 text-lg text-gray-500">{detail}</div> : null}
      </div>
    </div>
  );
}
