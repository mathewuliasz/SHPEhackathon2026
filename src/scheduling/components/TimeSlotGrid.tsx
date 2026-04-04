interface TimeSlotGridProps {
  slots: string[];
  selectedTime: string | null;
  onSelectTime: (time: string) => void;
}

function formatTime(time24: string): string {
  const [h, m] = time24.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}

export function TimeSlotGrid({ slots, selectedTime, onSelectTime }: TimeSlotGridProps) {
  if (slots.length === 0) {
    return (
      <p className="text-gray-400 text-sm text-center py-4">
        Select a date to see available times
      </p>
    );
  }

  return (
    <div>
      <h4 className="text-sm font-semibold text-gray-700 mb-3">Available Times</h4>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {slots.map((slot) => (
          <button
            key={slot}
            onClick={() => onSelectTime(slot)}
            className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
              slot === selectedTime
                ? "bg-blue-600 text-white"
                : "border border-gray-300 text-gray-700 hover:border-blue-400 hover:text-blue-600"
            }`}
          >
            {formatTime(slot)}
          </button>
        ))}
      </div>
    </div>
  );
}
