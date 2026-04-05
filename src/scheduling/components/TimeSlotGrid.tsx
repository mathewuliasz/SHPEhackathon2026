interface TimeSlotGridProps {
  slots: string[];
  selectedTime: string | null;
  onSelectTime: (time: string) => void;
  selectedDate: string | null;
}

function formatTime(time24: string): string {
  const [h, m] = time24.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}

function isSlotExpired(slot: string, selectedDate: string | null): boolean {
  if (!selectedDate) return false;

  const now = new Date();
  const [h, m] = slot.split(":").map(Number);
  const [y, mo, d] = selectedDate.split("-").map(Number);
  const slotTime = new Date(y, mo - 1, d, h, m);

  // Slot is expired if it's within 30 minutes of now or already passed
  return slotTime.getTime() - now.getTime() < 30 * 60 * 1000;
}

export function TimeSlotGrid({ slots, selectedTime, onSelectTime, selectedDate }: TimeSlotGridProps) {
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
        {slots.map((slot) => {
          const expired = isSlotExpired(slot, selectedDate);
          return (
            <button
              key={slot}
              onClick={() => !expired && onSelectTime(slot)}
              disabled={expired}
              className={`rounded-2xl px-4 py-3 text-sm font-semibold transition-all ${
                expired
                  ? "border border-[#e8eaee] text-[#c0c5cc] line-through cursor-not-allowed bg-[#f8f9fa]"
                  : slot === selectedTime
                    ? "bg-[#4a84ec] text-white"
                    : "border border-[#dbe2ec] text-[#647083] hover:border-[#c8d4e4]"
              }`}
            >
              {formatTime(slot)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
