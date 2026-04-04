"use client";

import { useState } from "react";
import { StepIndicator } from "./StepIndicator";
import { SpecialtyPicker } from "./SpecialtyPicker";
import { DoctorPicker } from "./DoctorPicker";
import { DateTimePicker } from "./DateTimePicker";
import { Confirmation } from "./Confirmation";
import { bookAppointment } from "@/scheduling/lib/scheduling-data";
import type { Specialty, Doctor } from "@/scheduling/types/scheduling";

export function ScheduleWizard() {
  const [step, setStep] = useState(1);
  const [selectedSpecialty, setSelectedSpecialty] = useState<Specialty | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isBooking, setIsBooking] = useState(false);

  const handleSelectSpecialty = (specialty: Specialty) => {
    setSelectedSpecialty(specialty);
    setStep(2);
  };

  const handleSelectDoctor = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setStep(3);
  };

  const handleConfirmBooking = async (date: string, time: string) => {
    if (!selectedSpecialty || !selectedDoctor) return;
    setIsBooking(true);
    try {
      await bookAppointment({
        doctorId: selectedDoctor.id,
        specialtyId: selectedSpecialty.id,
        date,
        time,
      });
      setSelectedDate(date);
      setSelectedTime(time);
      setStep(4);
    } catch (err) {
      console.error("Booking failed:", err);
      alert("Failed to book appointment. Please try again.");
    } finally {
      setIsBooking(false);
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setSelectedSpecialty(null);
    } else if (step === 3) {
      setSelectedDoctor(null);
    }
    setStep((s) => s - 1);
  };

  const handleReset = () => {
    setStep(1);
    setSelectedSpecialty(null);
    setSelectedDoctor(null);
    setSelectedDate(null);
    setSelectedTime(null);
  };

  return (
    <div>
      <StepIndicator currentStep={step} />

      {step > 1 && step < 4 && (
        <button
          onClick={handleBack}
          className="mb-4 text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
        >
          ← Back
        </button>
      )}

      <div className="animate-fade-in-up" key={step}>
        {step === 1 && <SpecialtyPicker onSelect={handleSelectSpecialty} />}
        {step === 2 && selectedSpecialty && (
          <DoctorPicker specialtyId={selectedSpecialty.id} onSelect={handleSelectDoctor} />
        )}
        {step === 3 && selectedDoctor && (
          <DateTimePicker
            doctorId={selectedDoctor.id}
            onConfirm={handleConfirmBooking}
            isBooking={isBooking}
          />
        )}
        {step === 4 && selectedSpecialty && selectedDoctor && selectedDate && selectedTime && (
          <Confirmation
            specialty={selectedSpecialty}
            doctor={selectedDoctor}
            date={selectedDate}
            time={selectedTime}
            onReset={handleReset}
          />
        )}
      </div>
    </div>
  );
}
