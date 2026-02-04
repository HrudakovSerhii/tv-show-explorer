import React from 'react';

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@/test-utils';

import { ShowDetails, ShowPageSkeleton } from './page';

import { getShowDetails } from '@/lib/api/tvmaze';
import { stripHtml } from '@/lib/utils/format';

import { mockShowDetails, mockEpisodes } from '@/lib/api/__mocks__/tvmaze.mock';

import type { Show } from '@/types/api-types';

vi.mock('@/lib/api/tvmaze', () => ({
  getShowDetails: vi.fn(),
}));

vi.mock('@/components/shows/WatchlistButton', () => ({
  default: ({ id, type }: { id: string | number; type: string }) => (
    <div data-testid="watchlist-button" data-show-id={id} data-type={type}>
      WatchlistButton
    </div>
  ),
}));

vi.mock('@/components/shows/EpisodesList', () => ({
  default: ({
    showId,
    availableSeasons,
    episodes,
    initialSeason,
  }: {
    showId: string;
    availableSeasons: number[];
    episodes: any[];
    initialSeason?: number;
  }) => (
    <div
      data-testid="episodes-list"
      data-show-id={showId}
      data-seasons={JSON.stringify(availableSeasons)}
      data-episodes-count={episodes.length}
      data-initial-season={initialSeason}
    >
      EpisodesList
    </div>
  ),
}));

async function renderAsync(asyncComponent: Promise<React.ReactElement>) {
  const resolvedComponent = await asyncComponent;
  return render(resolvedComponent);
}

describe('Show Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getShowDetails).mockReset();
  });

  describe('ShowDetails Component', () => {
    describe('Successful Data Fetching', () => {
      it('should render show details with all information', async () => {
        vi.mocked(getShowDetails).mockResolvedValue(mockShowDetails);

        const { container } = await renderAsync(
          ShowDetails({
            params: Promise.resolve({ id: '169' }),
            searchParams: Promise.resolve({ season: '169' }),
          }),
        );

        expect(screen.getByText('Breaking Bad')).toBeInTheDocument();

        expect(screen.getByText('9.5/10')).toBeInTheDocument();
        expect(screen.getByText('2008-01-20')).toBeInTheDocument();
        expect(screen.getByText(/1 Seasons/)).toBeInTheDocument();

        expect(screen.getByText('Drama')).toBeInTheDocument();
        expect(screen.getByText('Crime')).toBeInTheDocument();
        expect(screen.getByText('Thriller')).toBeInTheDocument();
        expect(screen.getByText(/Bryan Cranston, Aaron Paul/)).toBeInTheDocument();

        const expectedSummary = stripHtml(mockShowDetails.summary);
        expect(container).toHaveTextContent(expectedSummary);
      });

      it('should pass correct props to child components', async () => {
        vi.mocked(getShowDetails).mockResolvedValue(mockShowDetails);

        await renderAsync(
          ShowDetails({
            params: Promise.resolve({ id: '169' }),
            searchParams: Promise.resolve({ season: '169' }),
          }),
        );

        const watchlistButton = screen.getByTestId('watchlist-button');
        expect(watchlistButton).toHaveAttribute('data-show-id', '169');

        const episodesList = screen.getByTestId('episodes-list');
        expect(episodesList).toHaveAttribute('data-show-id', '169');
        expect(episodesList).toHaveAttribute('data-episodes-count', '2');
        expect(episodesList).toHaveAttribute('data-seasons', '[1]');
      });

      it('should calculate available seasons correctly', async () => {
        const mockShowWithMultipleSeasons: Show = {
          ...mockShowDetails,
          _embedded: {
            ...mockShowDetails._embedded,
            episodes: [
              { ...mockEpisodes[0], season: 1, id: 1 },
              { ...mockEpisodes[1], season: 1, id: 2 },
              { ...mockEpisodes[0], season: 2, id: 3 },
              { ...mockEpisodes[1], season: 3, id: 4 },
            ],
          },
        };

        vi.mocked(getShowDetails).mockResolvedValue(mockShowWithMultipleSeasons);

        await renderAsync(
          ShowDetails({
            params: Promise.resolve({ id: '169' }),
            searchParams: Promise.resolve({ season: '169' }),
          }),
        );

        const episodesList = screen.getByTestId('episodes-list');
        expect(episodesList).toHaveAttribute('data-seasons', '[1,2,3]');
        expect(screen.getByText(/3 Seasons/)).toBeInTheDocument();
      });

      it('should strip HTML from summary', async () => {
        const showWithHtmlSummary: Show = {
          ...mockShowDetails,
          summary: '<p>A high school <b>chemistry teacher</b> turns to <i>crime</i>.</p>',
        };
        vi.mocked(getShowDetails).mockResolvedValue(showWithHtmlSummary);

        await renderAsync(
          ShowDetails({
            params: Promise.resolve({ id: '169' }),
            searchParams: Promise.resolve({ season: '169' }),
          }),
        );

        expect(
          screen.getByText('A high school chemistry teacher turns to crime.'),
        ).toBeInTheDocument();
      });

      it('should render show image with picture element', async () => {
        vi.mocked(getShowDetails).mockResolvedValue(mockShowDetails);

        const { container } = await renderAsync(
          ShowDetails({
            params: Promise.resolve({ id: '169' }),
            searchParams: Promise.resolve({ season: '169' }),
          }),
        );

        // Next.js Image component is used instead of picture element
        const img = container.querySelector('img');
        expect(img).toBeInTheDocument();
        expect(img).toHaveAttribute('alt', mockShowDetails.name);
      });
    });

    describe('Not Found Handling', () => {
      it('should render not found UI when show is null', async () => {
        vi.mocked(getShowDetails).mockResolvedValue(null);

        await renderAsync(
          ShowDetails({
            params: Promise.resolve({ id: '999999' }),
            searchParams: Promise.resolve({ season: '169' }),
          }),
        );

        const icon = screen.getByText('tv_off');
        expect(icon).toBeInTheDocument();
        expect(icon).toHaveClass('material-symbols-outlined');

        expect(screen.getByText('Show not found')).toBeInTheDocument();
        expect(screen.getByText('Back to Home')).toBeInTheDocument();
      });

      it('should have correct link href for back to home', async () => {
        vi.mocked(getShowDetails).mockResolvedValue(null);

        await renderAsync(
          ShowDetails({
            params: Promise.resolve({ id: '999999' }),
            searchParams: Promise.resolve({ season: '169' }),
          }),
        );

        const backLink = screen.getByText('Back to Home').closest('a');
        expect(backLink).toHaveAttribute('href', '/');
      });
    });

    describe('Edge Cases', () => {
      it('should handle show with no episodes', async () => {
        const mockShowNoEpisodes: Show = {
          ...mockShowDetails,
          _embedded: {
            ...mockShowDetails._embedded,
            episodes: [],
          },
        };

        vi.mocked(getShowDetails).mockResolvedValue(mockShowNoEpisodes);

        await renderAsync(
          ShowDetails({
            params: Promise.resolve({ id: '169' }),
            searchParams: Promise.resolve({ season: '169' }),
          }),
        );

        expect(screen.getByText(/N\/A Seasons/)).toBeInTheDocument();

        const episodesList = screen.getByTestId('episodes-list');
        expect(episodesList).toHaveAttribute('data-episodes-count', '0');
        expect(episodesList).toHaveAttribute('data-seasons', '[]');
      });

      it('should render fallback placeholder when image is missing', async () => {
        const mockShowNoImage: Show = {
          ...mockShowDetails,
          image: undefined,
        };

        vi.mocked(getShowDetails).mockResolvedValue(mockShowNoImage);

        await renderAsync(
          ShowDetails({
            params: Promise.resolve({ id: '169' }),
            searchParams: Promise.resolve({ season: '169' }),
          }),
        );

        const placeholderIcon = screen.getByText('image');
        expect(placeholderIcon).toBeInTheDocument();
        expect(placeholderIcon).toHaveClass('material-symbols-outlined');
      });

      it('should display N/A when cast is missing', async () => {
        const mockShowNoCast: Show = {
          ...mockShowDetails,
          _embedded: {
            ...mockShowDetails._embedded,
            cast: undefined,
          },
        };

        vi.mocked(getShowDetails).mockResolvedValue(mockShowNoCast);

        await renderAsync(
          ShowDetails({
            params: Promise.resolve({ id: '169' }),
            searchParams: Promise.resolve({ season: '169' }),
          }),
        );

        expect(screen.getByText('N/A')).toBeInTheDocument();
      });

      it('should handle show with empty genres array', async () => {
        const mockShowNoGenres: Show = {
          ...mockShowDetails,
          genres: [],
        };

        vi.mocked(getShowDetails).mockResolvedValue(mockShowNoGenres);

        const { container } = await renderAsync(
          ShowDetails({
            params: Promise.resolve({ id: '169' }),
            searchParams: Promise.resolve({ season: '169' }),
          }),
        );

        const genreBadges = container.querySelectorAll('.rounded-radius-full');
        expect(genreBadges).toHaveLength(0);
      });

      it('should handle missing _embedded property', async () => {
        const mockShowNoEmbedded: Show = {
          ...mockShowDetails,
          _embedded: undefined,
        };

        vi.mocked(getShowDetails).mockResolvedValue(mockShowNoEmbedded);

        await renderAsync(
          ShowDetails({
            params: Promise.resolve({ id: '169' }),
            searchParams: Promise.resolve({ season: '169' }),
          }),
        );

        expect(screen.getByText('Breaking Bad')).toBeInTheDocument();
        expect(screen.getByText(/N\/A Seasons/)).toBeInTheDocument();

        const castText = screen.getByText('N/A');
        expect(castText).toBeInTheDocument();

        const episodesList = screen.getByTestId('episodes-list');
        expect(episodesList).toHaveAttribute('data-episodes-count', '0');
      });

      it('should calculate unique seasons from mixed episodes', async () => {
        const mockShowMixedSeasons: Show = {
          ...mockShowDetails,
          _embedded: {
            ...mockShowDetails._embedded,
            episodes: [
              { ...mockEpisodes[0], season: 3, id: 1 },
              { ...mockEpisodes[1], season: 1, id: 2 },
              { ...mockEpisodes[0], season: 2, id: 3 },
              { ...mockEpisodes[1], season: 1, id: 4 },
              { ...mockEpisodes[0], season: 3, id: 5 },
            ],
          },
        };

        vi.mocked(getShowDetails).mockResolvedValue(mockShowMixedSeasons);

        await renderAsync(
          ShowDetails({
            params: Promise.resolve({ id: '169' }),
            searchParams: Promise.resolve({ season: '169' }),
          }),
        );

        const episodesList = screen.getByTestId('episodes-list');
        expect(episodesList).toHaveAttribute('data-seasons', '[1,2,3]');
        expect(screen.getByText(/3 Seasons/)).toBeInTheDocument();
      });
    });

    describe('Error Handling', () => {
      it('should handle API errors gracefully', async () => {
        vi.mocked(getShowDetails).mockResolvedValue(null);

        await renderAsync(
          ShowDetails({
            params: Promise.resolve({ id: '169' }),
            searchParams: Promise.resolve({ season: '169' }),
          }),
        );

        expect(screen.getByText('Show not found')).toBeInTheDocument();
      });
    });

    describe('Async Flow and Core Logic', () => {
      it('should handle full async data fetching flow with initialSeason calculation', async () => {
        const mockShowMultiSeasons: Show = {
          ...mockShowDetails,
          summary: '<p>Test <strong>summary</strong> with HTML tags</p>',
          _embedded: {
            ...mockShowDetails._embedded,
            episodes: [
              { ...mockEpisodes[0], season: 1, number: 1, id: 1, name: 'Episode 1' },
              { ...mockEpisodes[1], season: 1, number: 2, id: 2, name: 'Episode 2' },
              { ...mockEpisodes[0], season: 2, number: 1, id: 3, name: 'Episode 3' },
              { ...mockEpisodes[1], season: 2, number: 2, id: 4, name: 'Episode 4' },
              { ...mockEpisodes[0], season: 3, number: 1, id: 5, name: 'Episode 5' },
            ],
          },
        };

        vi.mocked(getShowDetails).mockResolvedValue(mockShowMultiSeasons);

        await renderAsync(
          ShowDetails({
            params: Promise.resolve({ id: '169' }),
            searchParams: Promise.resolve({ season: '2' }),
          }),
        );

        expect(screen.getByText('Breaking Bad')).toBeInTheDocument();
        expect(screen.getByText(/3 Seasons/)).toBeInTheDocument();

        expect(screen.getByText('Test summary with HTML tags')).toBeInTheDocument();

        const episodesList = screen.getByTestId('episodes-list');
        expect(episodesList).toHaveAttribute('data-initial-season', '2');
        expect(episodesList).toHaveAttribute('data-seasons', '[1,2,3]');
        expect(episodesList).toHaveAttribute('data-episodes-count', '5');
      });

      it('should default to last season when searchParams season is invalid', async () => {
        const mockShowMultiSeasons: Show = {
          ...mockShowDetails,
          _embedded: {
            ...mockShowDetails._embedded,
            episodes: [
              { ...mockEpisodes[0], season: 1, id: 1 },
              { ...mockEpisodes[0], season: 2, id: 2 },
              { ...mockEpisodes[0], season: 3, id: 3 },
            ],
          },
        };

        vi.mocked(getShowDetails).mockResolvedValue(mockShowMultiSeasons);

        await renderAsync(
          ShowDetails({
            params: Promise.resolve({ id: '169' }),
            searchParams: Promise.resolve({ season: '10' }),
          }),
        );

        const episodesList = screen.getByTestId('episodes-list');
        expect(episodesList).toHaveAttribute('data-initial-season', '3');
      });

      it('should default to season 1 when no episodes exist', async () => {
        const mockShowNoEpisodes: Show = {
          ...mockShowDetails,
          _embedded: {
            ...mockShowDetails._embedded,
            episodes: [],
          },
        };

        vi.mocked(getShowDetails).mockResolvedValue(mockShowNoEpisodes);

        await renderAsync(
          ShowDetails({
            params: Promise.resolve({ id: '169' }),
            searchParams: Promise.resolve({ season: '2' }),
          }),
        );

        const episodesList = screen.getByTestId('episodes-list');
        expect(episodesList).toHaveAttribute('data-initial-season', '1');
      });
    });
  });

  describe('ShowPageSkeleton Component', () => {
    it('should render loading skeleton with correct structure', async () => {
      const { container } = render(<ShowPageSkeleton />);

      const animatedElements = container.querySelectorAll('.animate-pulse');
      expect(animatedElements.length).toBeGreaterThan(0);

      const skeletonCards = container.querySelectorAll('.rounded-radius-large');
      expect(skeletonCards.length).toBeGreaterThan(0);
    });
  });
});
