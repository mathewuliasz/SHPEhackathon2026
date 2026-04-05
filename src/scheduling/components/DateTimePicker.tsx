"use client";

import { useEffect, useState, useCallback } from "react";
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

function formatDatePreview(dateStr: string | null): string {
  if (!dateStr) return "Not selected";

  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

function formatTimePreview(time24: string | null): string {
  if (!time24) return "Not selected";

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
    <div className="mx-auto w-full max-w-6xl">
      <div className="mb-10">
        <h2 className="text-3xl font-semibold tracking-[-0.04em] text-[#27313f]">
          Pick a Date & Time
        </h2>
        <p className="mt-3 max-w-4xl text-lg leading-8 text-[#7f8a98]">
          Select an available date and time slot for your appointment with{" "}
          <span className="font-semibold text-[#414d60]">{doctor.name}</span>.
        </p>
      </div>

      {loading ? (
        <div className="h-72 rounded-[28px] bg-[#eef2f6] animate-pulse" />
      ) : (
        <div className="space-y-8">
          <div className="rounded-[28px] border border-[#dbe2ec] bg-white px-6 py-8 sm:px-8 sm:py-10">
            <MonthCalendar
              year={year}
              month={month}
              availableDates={availableDates}
              selectedDate={selectedDate}
              onSelectDate={handleSelectDate}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
            />

            <div className="mt-8 border-t border-[#edf1f5] pt-8">
              <TimeSlotGrid
                slots={slotsForDate}
                selectedTime={selectedTime}
                onSelectTime={setSelectedTime}
              />
            </div>
          </div>

          <div className="rounded-[28px] border border-[#dbe2ec] bg-white p-8">
            <h3 className="mb-8 text-3xl font-semibold tracking-[-0.03em] text-[#27313f]">
              Appointment Summary
            </h3>

            <div className="space-y-6">
              <SummaryRow label="Doctor" value={doctor.name} detail={doctor.bio} icon="◉" />
              <SummaryRow label="Specialty" value={specialty.name} detail="" icon="⌁" />
              <SummaryRow
                label="Date"
                value={formatDatePreview(selectedDate)}
                detail=""
                icon="□"
                muted={!selectedDate}
              />
              <SummaryRow
                label="Time"
                value={formatTimePreview(selectedTime)}
                detail=""
                icon="◔"
                muted={!selectedTime}
              />
            </div>

            <div className="mt-8 border-t border-[#edf1f5] pt-8">
              <button
                disabled={!selectedDate || !selectedTime || isBooking}
                onClick={() => selectedDate && selectedTime && onConfirm(selectedDate, selectedTime)}
                className="w-full rounded-full bg-[#f3f6fa] px-8 py-5 text-xl font-medium text-[#bcc5d0] disabled:cursor-not-allowed"
              >
                {isBooking ? "Booking..." : "Confirm Booking"}
              </button>
              <p className="mt-4 text-center text-lg text-[#a5aeb8]">
                {selectedDate && selectedTime
                  ? "Ready to confirm your appointment."
                  : "Select a date and time to confirm"}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-[#edf1f5] pt-8">
            <button
              onClick={onBack}
              className="rounded-full border border-[#dbe2ec] px-6 py-3 text-lg text-[#647083]"
            >
              ← Back
            </button>
            <button
              disabled={!selectedDate || !selectedTime || isBooking}
              onClick={() => selectedDate && selectedTime && onConfirm(selectedDate, selectedTime)}
              className="rounded-full bg-[#4a84ec] px-8 py-4 text-xl font-medium text-white transition-opacity disabled:cursor-not-allowed disabled:bg-[#f0f3f7] disabled:text-[#c2c9d2]"
            >
              {isBooking ? "Booking..." : "Confirm Booking →"}
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
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#eef4fb] text-xl text-[#4a84ec]">
        {icon}
      </div>
      <div>
        <div className="text-sm font-semibold uppercase tracking-[0.12em] text-[#a1aab5]">
          {label}
        </div>
        <div className={`mt-1 text-xl font-medium ${muted ? "text-[#c6cdd6]" : "text-[#27313f]"}`}>
          {value}
        </div>
        {detail ? <div className="mt-1 text-lg text-[#8a94a2]">{detail}</div> : null}
      </div>
    </div>
  );
}
