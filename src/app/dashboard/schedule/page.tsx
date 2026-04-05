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
    <main className="py-8">
      <div className="mx-auto w-full">
        <div className="px-2 pt-6 pb-3 text-center sm:px-6 lg:px-10">
          <span className="mb-4 inline-flex rounded-full px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[#4a84ec]">
            {t("schedule_kicker")}
          </span>
          <h1 className="mb-4 text-4xl font-semibold tracking-[-0.04em] text-[#1f2733] sm:text-5xl">
            {t("schedule_title")}
          </h1>
          <p className="mx-auto max-w-2xl text-center text-lg leading-8 text-[#7c8797]">
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
