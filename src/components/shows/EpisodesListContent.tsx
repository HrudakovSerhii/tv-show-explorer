import React from 'react';

import EpisodeListCard from './EpisodeListCard';

import type { Episode } from '@/types/api-types';

type EpisodesListContentProps = {
  showId: string;
  episodes: Array<Episode>;
};

export default function EpisodesListContent({ showId, episodes }: EpisodesListContentProps) {
  if (episodes.length === 0) {
    return (
      <div className="text-text-subtle flex flex-col items-center gap-200 py-600 text-center">
        <span className="material-symbols-outlined text-icon-subtlest text-6xl">tv_off</span>
        <p className="text-base">No episodes found for this season</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-200">
      {episodes.map((episode) => (
        <EpisodeListCard key={episode.id} showId={showId} episode={episode} />
      ))}
    </div>
  );
}
