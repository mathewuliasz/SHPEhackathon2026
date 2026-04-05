"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { ScheduleWizard } from "@/scheduling/components/ScheduleWizard";

function ScheduleContent() {
  const searchParams = useSearchParams();
  const specialtyParam = searchParams.get("specialty") ?? undefined;
  const { t } = useLanguage();

  return (
    <main className="min-h-screen px-4 py-10 sm:px-6 lg:px-10">
      <div className=" w-full max-w-7xl">
        <div className="mx-auto max-w-4xl px-2 pb-6 pt-6 text-center sm:px-6 lg:translate-x-6">
          <span className="mb-4 inline-flex text-xs font-semibold uppercase tracking-[0.24em] text-gray-500 lg:translate-x-30">
    {t("schedule_kicker")}
  </span>

           <h1 className="mb-10 text-4xl font-semibold text-gray-900 sm:text-5xl lg:translate-x-[140px]">
    {t("schedule_title")}
  </h1>
          <p className=" max-w-2xl text-center text-lg leading-8 text-gray-600 lg:translate-x-60">
            {t("schedule_text")}
          </p>
        </div>

        <div className="pb-8">
          <ScheduleWizard initialSpecialtyName={specialtyParam} />
        </div>
      </div>
    </main>
  );
}

export default function SchedulePage() {
  return (
    <Suspense>
      <ScheduleContent />
    </Suspense>
  );
}
