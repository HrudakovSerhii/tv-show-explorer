'use client';

import React from 'react';
import { VirtuosoGrid } from 'react-virtuoso';

import ShowCard from '@/components/shows/ShowCard';

import type { Show } from '@/types/api-types';

type ClientWebScheduleProps = {
  shows: Array<Show>;
};

const gridComponents = {
  List: React.forwardRef<
    HTMLDivElement,
    React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>
  >(({ style, children, ...props }, ref) => (
    <div
      ref={ref}
      {...props}
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 'var(--ds-space-300, 1rem)',
        ...style,
      }}
    >
      {children}
    </div>
  )),
  Item: ({ children, ...props }: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>) => (
    <div
      {...props}
      className="w-[calc(50%-0.5rem)] sm:w-[calc(33.333%-0.667rem)] md:w-[calc(25%-0.75rem)] lg:w-[calc(20%-0.8rem)]"
    >
      {children}
    </div>
  ),
};

gridComponents.List.displayName = 'VirtuosoGridList';

export default function ClientWebSchedule({ shows }: ClientWebScheduleProps) {
  if (shows.length === 0) {
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
    <VirtuosoGrid
      useWindowScroll
      data={shows}
      components={gridComponents}
      itemContent={(_index, show) => <ShowCard show={show} />}
      overscan={200}
    />
  );
}
