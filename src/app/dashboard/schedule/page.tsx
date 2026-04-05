import { ScheduleWizard } from "@/scheduling/components/ScheduleWizard";

export const metadata = {
  title: "Schedule Appointment | MediTrack",
};

export default function SchedulePage() {
  return (
    <main className="min-h-screen bg-[#f6f8fb] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="px-2 pt-6 pb-3 text-center sm:px-6 lg:px-10">
          <span className="mb-4 inline-flex rounded-full px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[#4a84ec]">
            Smart Booking Flow
          </span>
          <h1 className="mb-4 text-4xl font-semibold tracking-[-0.04em] text-[#1f2733] sm:text-5xl">
            Schedule an Appointment
          </h1>
          <p className="mx-auto max-w-2xl text-center text-lg leading-8 text-[#7c8797]">
            Choose a specialty, review providers, and lock in a visit without jumping
            between screens.
          </p>
        </div>

        <div className="pb-8">
          <ScheduleWizard />
        </div>
      </div>
    </main>
  );
}
