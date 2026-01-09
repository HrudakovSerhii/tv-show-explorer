'use client';

import React, { useState, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';

import EpisodesListContent from './EpisodesListContent';

import type { Episode } from '@/types/api-types';

type EpisodesListProps = {
  showId: string;
  availableSeasons: Array<number>;
  episodes: Array<Episode>;
  initialSeason: number;
};

export default function EpisodesList({
  showId,
  availableSeasons,
  episodes,
  initialSeason,
}: EpisodesListProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [selectedSeason, setSelectedSeason] = useState<number>(initialSeason);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const filteredEpisodes = useMemo(() => {
    return episodes.filter((ep) => ep.season === selectedSeason);
  }, [episodes, selectedSeason]);

  const handleSeasonSelect = (season: number) => {
    setSelectedSeason(season);
    setIsDropdownOpen(false);

    router.replace(`${pathname}?season=${season}`, { scroll: false });
  };

  if (episodes.length === 0) {
    return (
      <section className="px-200">
        <div className="text-text-subtle flex flex-col items-center gap-200 py-600 text-center">
          <span className="material-symbols-outlined text-icon-subtlest text-6xl">live_tv</span>
          <p className="text-base">No episodes available</p>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full">
      <div className="mb-300 flex items-center justify-between">
        <h3 className="text-text font-weight-bold text-2xl">Episodes</h3>

        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="bg-background-neutral hover:bg-background-neutral-hovered border-border text-text shadow-raised rounded-radius-medium font-weight-medium flex items-center gap-100 border px-200 py-150 text-sm transition-colors"
          >
            Season {selectedSeason}
            <span className="material-symbols-outlined text-[20px]">
              {isDropdownOpen ? 'expand_less' : 'expand_more'}
            </span>
          </button>

          {isDropdownOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)} />
              <div className="bg-background-input border-border shadow-overlay rounded-radius-medium absolute top-full right-0 z-20 mt-50 w-48 overflow-hidden border">
                {availableSeasons.map((season) => (
                  <button
                    key={season}
                    onClick={() => handleSeasonSelect(season)}
                    className={`text-text font-weight-medium w-full px-200 py-150 text-left text-sm transition-colors ${
                      season === selectedSeason
                        ? 'bg-background-selected text-brand'
                        : 'hover:bg-background-neutral-hovered'
                    }`}
                  >
                    Season {season}
                    {season === selectedSeason && (
                      <span className="material-symbols-outlined text-text float-right ml-50 inline-block text-[20px]">
                        check
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <EpisodesListContent showId={showId} episodes={filteredEpisodes} />
    </section>
  );
}
