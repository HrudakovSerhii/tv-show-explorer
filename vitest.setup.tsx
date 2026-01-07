import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';
import { ImageProps } from 'next/image';

afterEach(() => {
  cleanup();
});

vi.mock('next/image', () => ({
  default: (props: ImageProps) => {
    return (
      /* eslint-disable-next-line @next/next/no-img-element, @atlaskit/design-system/no-html-image */
      <img
        {...props}
        alt={props.alt}
        src={typeof props.src === 'string' ? props.src || props.alt : props.alt}
      />
    );
  },
}));

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => {
    return (
      /* eslint-disable-next-line @atlaskit/design-system/no-html-anchor */
      <a href={href} {...props}>
        {children}
      </a>
    );
  },
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    pathname: '/',
    query: {},
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
  useParams: () => ({}),
  redirect: vi.fn(),
  permanentRedirect: vi.fn(),
  notFound: vi.fn(),
}));

vi.mock('next/font/google', () => ({
  Geist: () => ({
    className: 'geist-sans',
    variable: '--font-geist-sans',
    style: { fontFamily: 'Geist Sans' },
  }),
  Geist_Mono: () => ({
    className: 'geist-mono',
    variable: '--font-geist-mono',
    style: { fontFamily: 'Geist Mono' },
  }),
}));

vi.mock('@/components/AtlaskitThemeProvider', () => ({
  AtlaskitThemeProvider: () => null,
}));

vi.mock('@atlaskit/tokens', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@atlaskit/tokens')>();
  return {
    ...actual,
    setGlobalTheme: vi.fn(() => Promise.resolve()),
  };
});
