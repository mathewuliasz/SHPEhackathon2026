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
      <p className="rounded-2xl border border-dashed border-[#dbe2ec] bg-[#fafbfd] px-4 py-6 text-center text-sm text-[#98a2ad]">
        Select a date to see available times
      </p>
    );
  }

  return (
    <div>
      <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#98a2ad]">
        Available Times
      </h4>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {slots.map((slot) => (
          <button
            key={slot}
            onClick={() => onSelectTime(slot)}
            className={`rounded-2xl px-4 py-3 text-sm font-semibold transition-all ${
              slot === selectedTime
                ? "bg-[#4a84ec] text-white"
                : "border border-[#dbe2ec] text-[#647083] hover:border-[#c8d4e4]"
            }`}
          >
            {formatTime(slot)}
          </button>
        ))}
      </div>
    </div>
  );
}
