"use client";

import { useEffect, useState, useCallback } from "react";
import { MonthCalendar } from "./MonthCalendar";
import { TimeSlotGrid } from "./TimeSlotGrid";
import { getAvailabilityForDoctor } from "@/scheduling/lib/scheduling-data";
import type { Availability } from "@/scheduling/types/scheduling";

interface DateTimePickerProps {
  doctorId: string;
  onConfirm: (date: string, time: string) => void;
  isBooking: boolean;
}

export function DateTimePicker({ doctorId, onConfirm, isBooking }: DateTimePickerProps) {
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
    <div>
      <h2 className="text-xl font-semibold mb-1">Pick a Date & Time</h2>
      <p className="text-gray-500 text-sm mb-4">Green dates have available slots</p>

      {loading ? (
        <div className="h-72 rounded-xl bg-gray-100 animate-pulse" />
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <MonthCalendar
                year={year}
                month={month}
                availableDates={availableDates}
                selectedDate={selectedDate}
                onSelectDate={handleSelectDate}
                onPrevMonth={handlePrevMonth}
                onNextMonth={handleNextMonth}
              />
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <TimeSlotGrid
                slots={slotsForDate}
                selectedTime={selectedTime}
                onSelectTime={setSelectedTime}
              />
            </div>
          </div>

          <button
            disabled={!selectedDate || !selectedTime || isBooking}
            onClick={() => selectedDate && selectedTime && onConfirm(selectedDate, selectedTime)}
            className="w-full py-3 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {isBooking ? "Booking..." : "Confirm Booking"}
          </button>
        </div>
      )}
    </div>
  );
}
