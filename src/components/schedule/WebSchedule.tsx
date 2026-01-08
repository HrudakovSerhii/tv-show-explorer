import { getWebSchedule } from '@/lib/api/tvmaze';

import ShowCard from '@/components/shows/ShowCard';

import type { Show } from '@/types/api-types';

export default async function WebSchedule() {
  const schedule = await getWebSchedule();

  const uniqueShows = schedule
    .filter((episode) => episode._embedded?.show)
    .reduce((acc, episode) => {
      const show = episode._embedded!.show;
      if (!acc.find((s) => s.id === show.id)) {
        acc.push(show);
      }
      return acc;
    }, [] as Array<Show>);

  if (uniqueShows.length === 0) {
    return (
      <div className="flex flex-col items-center gap-200 py-400 text-center">
        <span className="material-symbols-outlined text-icon-subtlest text-6xl">
          calendar_today
        </span>
        <p className="text-text-subtle text-lg">No shows scheduled for today.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-300 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {uniqueShows.map((show) => (
        <ShowCard key={show.id} show={show} />
      ))}
    </div>
  );
}
