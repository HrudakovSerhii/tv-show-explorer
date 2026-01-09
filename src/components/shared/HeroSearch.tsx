import React from 'react';
import Image from 'next/image';

import SearchForm from './SearchForm';

const HeroSearch: React.FC = () => {
  return (
    <div className="rounded-radius-xlarge relative flex min-h-[400px] w-full flex-col items-center justify-center overflow-hidden p-200 text-center md:min-h-[480px]">
      <Image
        src="https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?q=80&w=2069&auto=format&fit=crop"
        alt="TV Show Background"
        fill
        priority
        className="object-cover"
        sizes="(max-width: 1200px) 100vw, 1200px"
      />

      <div className="absolute inset-0 bg-gradient-to-b from-[rgba(0,0,0,0.4)] to-[rgba(0,0,0,0.7)]" />

      <div className="animate-fade-in z-10 mx-auto flex max-w-2xl flex-col gap-150">
        <h1
          className="text-4xl leading-tight font-black tracking-[-0.033em] text-white md:text-5xl"
          style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}
        >
          Discover your next obsession
        </h1>
        <h2
          className="font-weight-regular mx-auto max-w-lg text-base leading-normal md:text-lg"
          style={{ color: 'rgba(255, 255, 255, 0.85)' }}
        >
          Explore thousands of TV shows and episodes. Rate your favorites and keep track of what to
          explore next.
        </h2>
      </div>
      <div className="z-10 mt-400 w-full max-w-[560px]">
        <SearchForm />
      </div>
    </div>
  );
};

export default HeroSearch;
