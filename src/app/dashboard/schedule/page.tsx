import { ScheduleWizard } from "@/scheduling/components/ScheduleWizard";

export const metadata = {
  title: "Schedule Appointment | MedSchedule",
};

export default function SchedulePage() {
  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-2">Schedule an Appointment</h1>
        <p className="text-gray-500 text-center mb-8">
          Follow the steps below to book your visit
        </p>
        <ScheduleWizard />
      </div>
    </main>
  );
}
