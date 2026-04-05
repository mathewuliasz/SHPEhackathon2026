const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

interface MonthCalendarProps {
  year: number;
  month: number;
  availableDates: Set<string>;
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

function formatDateStr(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function MonthCalendar({
  year,
  month,
  availableDates,
  selectedDate,
  onSelectDate,
  onPrevMonth,
  onNextMonth,
}: MonthCalendarProps) {
  const today = new Date();
  const todayStr = formatDateStr(today.getFullYear(), today.getMonth(), today.getDate());

  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const isCurrentMonth =
    year === today.getFullYear() && month === today.getMonth();
  const isPastMonth =
    year < today.getFullYear() ||
    (year === today.getFullYear() && month < today.getMonth());

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <button
          onClick={onPrevMonth}
          disabled={isPastMonth || isCurrentMonth}
          className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#dbe2ec] text-lg text-[#647083] transition-colors hover:bg-[#f8fafc] disabled:cursor-not-allowed disabled:opacity-30"
        >
          ‹
        </button>
        <h3 className="text-lg font-semibold text-[#27313f] sm:text-xl">
          {MONTH_NAMES[month]} {year}
        </h3>
        <button
          onClick={onNextMonth}
          className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#dbe2ec] text-lg text-[#647083] transition-colors hover:bg-[#f8fafc]"
        >
          ›
        </button>
      </div>

      <div className="mb-2 grid grid-cols-7 gap-2">
        {DAY_LABELS.map((d) => (
          <div key={d} className="py-2 text-center text-xs font-semibold uppercase tracking-[0.16em] text-[#98a2ad]">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: firstDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dateStr = formatDateStr(year, month, day);
          const isPast = dateStr < todayStr;
          const isAvailable = availableDates.has(dateStr);
          const isSelected = dateStr === selectedDate;

          let cellClass =
            "flex h-12 items-center justify-center rounded-2xl text-sm transition-all ";

          if (isSelected) {
            cellClass += "bg-[#4a84ec] text-white font-bold cursor-pointer";
          } else if (isAvailable && !isPast) {
            cellClass +=
              "bg-[#eef4fb] text-[#4a84ec] hover:bg-[#e5eefb] cursor-pointer font-semibold";
          } else if (isPast) {
            cellClass += "text-[#ccd4e0] cursor-default";
          } else {
            cellClass += "text-[#aab5c4] cursor-default";
          }

          return (
            <button
              key={day}
              disabled={isPast || !isAvailable}
              onClick={() => isAvailable && !isPast && onSelectDate(dateStr)}
              className={cellClass}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
