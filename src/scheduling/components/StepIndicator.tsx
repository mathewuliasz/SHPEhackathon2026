const steps = ["Choose Specialty", "Choose Doctor", "Date & Time"];
const captions = ["Select your care type", "Pick your provider", "Schedule your visit"];

export function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="mx-auto mb-10 w-full max-w-4xl px-4">
      <div className="grid grid-cols-3 items-start gap-8 md:gap-10">
        {steps.map((label, i) => {
          const stepNum = i + 1;
          const isCompleted = stepNum < currentStep;
          const isCurrent = stepNum === currentStep;

          return (
            <div
              key={label}
              className="relative flex min-w-0 flex-col items-center text-center"
            >
              {i < steps.length - 1 ? (
                <div
                  className={`absolute left-1/2 top-[1.1rem] hidden h-[2px] w-[calc(100%-2.5rem)] translate-x-[calc(50%+1.25rem)] rounded-full md:block ${
                    isCompleted ? "bg-[#d8e6fb]" : "bg-[#e7edf4]"
                  }`}
                />
              ) : null}

              <div
                className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full text-base font-semibold transition-colors ${
                  isCurrent
                    ? "bg-[#2f85f6] text-white shadow-[0_0_0_5px_rgba(47,133,246,0.14)]"
                    : isCompleted
                    ? "bg-[#2f85f6] text-white"
                    : "border border-[#d9e1ea] bg-white text-[#9aa5b1]"
                }`}
              >
                {isCompleted ? "✓" : stepNum}
              </div>

              <div
                className={`mt-3 text-base font-medium ${
                  isCurrent
                    ? "text-[#2f85f6]"
                    : isCompleted
                    ? "text-[#2f85f6]"
                    : "text-[#98a2ad]"
                }`}
              >
                {label}
              </div>
              <div className="mt-1 text-sm text-[#a3adba]">{captions[i]}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
