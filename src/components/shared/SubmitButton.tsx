'use client';

import { useFormStatus } from 'react-dom';

export default function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-background-brand-bold rounded-medium font-weight-bold text-text hover:bg-background-brand-bold-hovered h-full px-300 text-sm transition-colors disabled:opacity-50"
    >
      {pending ? '...' : 'Search'}
    </button>
  );
}
