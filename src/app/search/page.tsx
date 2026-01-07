'use client';

import { use } from 'react';

export type SearchPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default function SearchPage({ searchParams }: SearchPageProps) {
  const filters = use(searchParams).filters;

  return (
    <div>
      {/*eslint-disable-next-line @atlaskit/design-system/no-html-heading*/}
      <h1>TV Show Search Results Page</h1>
      <p>{filters}</p>
    </div>
  );
}
