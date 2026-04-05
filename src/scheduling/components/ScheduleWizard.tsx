"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { StepIndicator } from "./StepIndicator";
import { SpecialtyPicker } from "./SpecialtyPicker";
import { DoctorPicker } from "./DoctorPicker";
import { DateTimePicker } from "./DateTimePicker";
import { Confirmation } from "./Confirmation";
import { bookAppointment, getSpecialties } from "@/scheduling/lib/scheduling-data";
import type { Specialty, Doctor } from "@/scheduling/types/scheduling";

interface ScheduleWizardProps {
  initialSpecialtyName?: string;
}

export function ScheduleWizard({ initialSpecialtyName }: ScheduleWizardProps) {
  const { t } = useLanguage();
  const [step, setStep] = useState(1);
  const [selectedSpecialty, setSelectedSpecialty] = useState<Specialty | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [zoomLink, setZoomLink] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [patientName, setPatientName] = useState<string>("");

  useEffect(() => {
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUserId(data.user.userId);
          setPatientName(data.user.fullName || "");
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!initialSpecialtyName) return;
    getSpecialties()
      .then((specialties) => {
        const match = specialties.find(
          (s) => s.name.toLowerCase() === initialSpecialtyName.toLowerCase()
        );
        if (match) {
          setSelectedSpecialty(match);
          setStep(2);
        }
      })
      .catch(() => {});
  }, [initialSpecialtyName]);

  const handleSelectSpecialty = (specialty: Specialty) => {
    setSelectedSpecialty(specialty);
  };

  const handleSelectDoctor = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
  };

  const handleConfirmBooking = async (date: string, time: string) => {
    if (!selectedSpecialty || !selectedDoctor) return;
    setIsBooking(true);
    try {
      const appointmentId = await bookAppointment({
        doctorId: selectedDoctor.id,
        specialtyId: selectedSpecialty.id,
        date,
        time,
        userId: userId ?? undefined,
        patientName: patientName || undefined,
      });
      setSelectedDate(date);
      setSelectedTime(time);

      try {
        const zoomRes = await fetch("/api/zoom/create-meeting", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            appointmentId,
            doctorName: selectedDoctor.name,
            specialtyName: selectedSpecialty.name,
            date,
            time,
          }),
        });
        if (zoomRes.ok) {
          const zoomData = await zoomRes.json();
          setZoomLink(zoomData.join_url);
        }
      } catch (zoomErr) {
        console.error("Zoom meeting creation failed:", zoomErr);
      }

      fetch("/api/patient-context", { method: "POST" }).catch(() => {});
      setStep(4);
    } catch (err) {
      console.error("Booking failed:", err);
      alert(t("dateTime_bookingFailed"));
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
    setZoomLink(null);
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col items-center space-y-8">
      <StepIndicator currentStep={step} />

      <div className="flex w-full justify-center animate-fade-in-up" key={step}>
        {step === 1 && (
          <SpecialtyPicker
            selectedSpecialtyId={selectedSpecialty?.id ?? null}
            onSelect={handleSelectSpecialty}
            onContinue={() => selectedSpecialty && setStep(2)}
          />
        )}
        {step === 2 && selectedSpecialty && (
          <DoctorPicker
            specialtyId={selectedSpecialty.id}
            specialtyName={selectedSpecialty.name}
            selectedDoctorId={selectedDoctor?.id ?? null}
            onSelect={handleSelectDoctor}
            onBack={handleBack}
            onContinue={() => selectedDoctor && setStep(3)}
          />
        )}
        {step === 3 && selectedSpecialty && selectedDoctor && (
          <DateTimePicker
            doctorId={selectedDoctor.id}
            doctor={selectedDoctor}
            specialty={selectedSpecialty}
            onConfirm={handleConfirmBooking}
            isBooking={isBooking}
            onBack={handleBack}
          />
        )}
        {step === 4 && selectedSpecialty && selectedDoctor && selectedDate && selectedTime && (
          <Confirmation
            specialty={selectedSpecialty}
            doctor={selectedDoctor}
            date={selectedDate}
            time={selectedTime}
            zoomLink={zoomLink}
            onReset={handleReset}
          />
        )}
      </div>
    </div>
  );
}
