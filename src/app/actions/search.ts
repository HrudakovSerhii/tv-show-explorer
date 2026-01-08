'use server';

import { redirect } from 'next/navigation';

export async function searchAction(formData: FormData) {
  const query = formData.get('query');

  if (typeof query === 'string' && query.trim()) {
    redirect(`/search?q=${encodeURIComponent(query.trim())}`);
  }

  // If no valid query, redirect to search page without query
  redirect('/search');
}