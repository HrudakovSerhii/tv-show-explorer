import React, { Suspense } from 'react';

import HeroSearch from '@/components/shared/HeroSearch';
import WebSchedule from '@/components/schedule/WebSchedule';
import WebScheduleSkeleton from '@/components/schedule/WebScheduleSkeleton';

export default function Home() {
  return (
    <div className="flex flex-col gap-600">
      <HeroSearch />

      <section className="flex flex-col gap-200">
        <div className="flex items-center justify-between">
          <h2 className="text-text font-weight-bold text-2xl leading-tight tracking-tight">
            Web/Streaming Schedule
          </h2>
          <p className="text-text-subtle text-sm">Today&apos;s releases</p>
        </div>
        <Suspense fallback={<WebScheduleSkeleton />}>
          <WebSchedule />
        </Suspense>
      </section>
    </div>
  );
}
