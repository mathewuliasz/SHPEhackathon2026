import { ScheduleWizard } from "@/scheduling/components/ScheduleWizard";

export const metadata = {
  title: "Schedule Appointment | MediTrack",
};

export default function SchedulePage() {
  return (
    <div className="h-full w-full py-8 px-6">
      <div className="w-full max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-2">Schedule an Appointment</h1>
        <p className="text-gray-500 text-center mb-8">
          Follow the steps below to book your visit
        </p>
        <ScheduleWizard />
      </div>
    </div>
  );
}
