'use client'; // Error boundaries must be Client Components

import { useEffect } from 'react';

export default function ShowError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center gap-300 py-1000 text-center">
      <span className="material-symbols-outlined text-icon-danger text-6xl">error</span>
      <div className="flex flex-col gap-100">
        <h1 className="text-text dark:text-text-inverse font-weight-bold text-2xl">
          Something went wrong
        </h1>
        <p className="text-text-subtle text-base">
          {error.message || 'An unexpected error occurred while loading the show'}
        </p>
      </div>
      <button
        onClick={() => reset()}
        className="bg-background-brand-bold hover:bg-background-brand-bold-hovered text-text-inverse font-weight-medium rounded-radius-large px-300 py-150 transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
