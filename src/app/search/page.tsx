import { redirect } from 'next/navigation';

import { NAV_URLS } from '@/constants';

export default function SearchPage() {
  // Redirect to home if no query provided
  redirect(NAV_URLS.home);
}