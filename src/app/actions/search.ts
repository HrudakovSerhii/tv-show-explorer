'use server';

import { redirect } from 'next/navigation';

import { NAV_URLS } from '@/constants';

export async function searchAction(formData: FormData) {
  const query = formData.get('query');

  if (typeof query === 'string' && query.trim()) {
    redirect(`${NAV_URLS.search}/${encodeURIComponent(query.trim())}`);
  }

  // If no valid query, redirect to home
  redirect(`${NAV_URLS.search}`);
}