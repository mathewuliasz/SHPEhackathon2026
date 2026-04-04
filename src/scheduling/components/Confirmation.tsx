import type { Specialty, Doctor } from "@/scheduling/types/scheduling";

interface ConfirmationProps {
  specialty: Specialty;
  doctor: Doctor;
  date: string;
  time: string;
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

export function Confirmation({ specialty, doctor, date, time, onReset }: ConfirmationProps) {
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
      </div>

      <p className="text-sm text-gray-500 mb-6">
        You should be receiving a confirmation email shortly.
      </p>

      <button
        onClick={onReset}
        className="px-6 py-2.5 rounded-xl font-semibold text-blue-600 border border-blue-600 hover:bg-blue-50 transition-colors"
      >
        Schedule Another Appointment
      </button>
    </div>
  );
}
