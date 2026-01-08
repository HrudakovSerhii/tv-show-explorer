import React from 'react';

import HeroSearch from '@/components/shared/HeroSearch';

export default function Home() {
  return (
    <div className="flex flex-col gap-600">
      <HeroSearch />

      <section className="flex flex-col gap-200">
        <div className="flex items-center justify-between">
          <h2 className="text-text dark:text-text-inverse text-2xl leading-tight font-bold tracking-tight">
            Web/Streaming Schedule
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-300 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {/*Streaming Schedule list*/}
        </div>
      </section>
    </div>
  );
}
