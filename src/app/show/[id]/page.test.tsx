import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@/test-utils';

import { ShowDetails, ShowPageSkeleton } from './page';

import { getShowDetails } from '@/lib/api/tvmaze';
import { stripHtml } from '@/lib/utils/format';

import { mockShowDetails, mockEpisodes } from '@/lib/api/__mocks__/tvmaze.mock';

import type { Show } from '@/types/api-types';

// Mock API module
vi.mock('@/lib/api/tvmaze', () => ({
  getShowDetails: vi.fn(),
}));

// Mock utils module
vi.mock('@/lib/utils/format', () => ({
  stripHtml: vi.fn((html: string) => html.replace(/<[^>]*>/g, '').trim()),
}));

// Mock child components
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

vi.mock('@/components/shows/EpisodeListCard', () => ({
  default: ({ showId, isLoading }: { showId: string; isLoading?: boolean }) => (
    <div data-testid="episode-list-card" data-show-id={showId} data-loading={isLoading}>
      EpisodeListCard
    </div>
  ),
}));

// Helper function to render async server components
async function renderAsync(asyncComponent: Promise<JSX.Element>) {
  const resolvedComponent = await asyncComponent;
  return render(resolvedComponent);
}

describe('Show Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getShowDetails).mockReset();
    vi.mocked(stripHtml).mockReset();
  });

  describe('ShowDetails Component', () => {
    describe('Successful Data Fetching', () => {
      it('should render show details with all information', async () => {
        vi.mocked(getShowDetails).mockResolvedValue(mockShowDetails);
        vi.mocked(stripHtml).mockReturnValue('This is the summary without HTML');

        const { container } = await renderAsync(
          ShowDetails({
            params: Promise.resolve({ id: '169' }),
            searchParams: Promise.resolve({ season: '169' }),
          }),
        );

        // Verify show name
        expect(screen.getByText('Breaking Bad')).toBeInTheDocument();

        // Verify rating
        expect(screen.getByText('9.5/10')).toBeInTheDocument();

        // Verify premiered date
        expect(screen.getByText('2008-01-20')).toBeInTheDocument();

        // Verify seasons count
        expect(screen.getByText(/1 Seasons/)).toBeInTheDocument();

        // Verify genres
        expect(screen.getByText('Drama')).toBeInTheDocument();
        expect(screen.getByText('Crime')).toBeInTheDocument();
        expect(screen.getByText('Thriller')).toBeInTheDocument();

        // Verify cast
        expect(screen.getByText(/Bryan Cranston, Aaron Paul/)).toBeInTheDocument();

        // Verify summary is stripped of HTML
        expect(stripHtml).toHaveBeenCalledWith(mockShowDetails.summary);
        expect(container).toHaveTextContent('This is the summary without HTML');
      });

      it('should pass correct props to child components', async () => {
        vi.mocked(getShowDetails).mockResolvedValue(mockShowDetails);

        await renderAsync(
          ShowDetails({
            params: Promise.resolve({ id: '169' }),
            searchParams: Promise.resolve({ season: '169' }),
          }),
        );

        // Verify WatchlistButton receives correct showId
        const watchlistButton = screen.getByTestId('watchlist-button');
        expect(watchlistButton).toHaveAttribute('data-show-id', '169');

        // Verify EpisodesList receives correct props
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

        // Verify 3 unique seasons
        const episodesList = screen.getByTestId('episodes-list');
        expect(episodesList).toHaveAttribute('data-seasons', '[1,2,3]');
        expect(screen.getByText(/3 Seasons/)).toBeInTheDocument();
      });

      it('should strip HTML from summary', async () => {
        vi.mocked(getShowDetails).mockResolvedValue(mockShowDetails);
        vi.mocked(stripHtml).mockReturnValue('Clean summary text');

        await renderAsync(
          ShowDetails({
            params: Promise.resolve({ id: '169' }),
            searchParams: Promise.resolve({ season: '169' }),
          }),
        );

        // Verify stripHtml was called with show summary
        expect(stripHtml).toHaveBeenCalledWith(mockShowDetails.summary);
        expect(screen.getByText('Clean summary text')).toBeInTheDocument();
      });

      it('should render show image with picture element', async () => {
        vi.mocked(getShowDetails).mockResolvedValue(mockShowDetails);

        const { container } = await renderAsync(
          ShowDetails({
            params: Promise.resolve({ id: '169' }),
            searchParams: Promise.resolve({ season: '169' }),
          }),
        );

        // Verify picture element is rendered
        const picture = container.querySelector('picture');
        expect(picture).toBeInTheDocument();

        // Verify img element with correct src
        const img = container.querySelector('img');
        expect(img).toHaveAttribute('src', mockShowDetails.image!.original);
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

        // Verify icon
        const icon = screen.getByText('tv_off');
        expect(icon).toBeInTheDocument();
        expect(icon).toHaveClass('material-symbols-outlined');

        // Verify heading
        expect(screen.getByText('Show not found')).toBeInTheDocument();

        // Verify back link
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

        // Verify link points to home
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

        // Verify seasons count shows N/A
        expect(screen.getByText(/N\/A Seasons/)).toBeInTheDocument();

        // Verify empty episodes array passed to EpisodesList
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

        // Verify placeholder icon is rendered
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

        // Verify N/A is displayed in cast section
        expect(screen.getByText('Stars')).toBeInTheDocument();
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

        // Verify no genre badges are rendered (look for badges with rounded corners which are genre-specific)
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

        // Verify component renders without crashing
        expect(screen.getByText('Breaking Bad')).toBeInTheDocument();

        // Verify N/A seasons
        expect(screen.getByText(/N\/A Seasons/)).toBeInTheDocument();

        // Verify N/A cast
        const castText = screen.getByText('N/A');
        expect(castText).toBeInTheDocument();

        // Verify empty episodes
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

        // Verify seasons are unique and sorted: [1, 2, 3]
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

        // Should show not found UI
        expect(screen.getByText('Show not found')).toBeInTheDocument();
      });
    });
  });

  describe('ShowPageSkeleton Component', () => {
    it('should render loading skeleton with correct structure', async () => {
      const { container } = render(<ShowPageSkeleton />);

      // Verify skeleton structure with animate-pulse
      const animatedElements = container.querySelectorAll('.animate-pulse');
      expect(animatedElements.length).toBeGreaterThan(0);

      // Verify 3 episode card skeletons
      const episodeCards = screen.getAllByTestId('episode-list-card');
      expect(episodeCards).toHaveLength(3);

      // Verify all episode cards are in loading state
      episodeCards.forEach((card) => {
        expect(card).toHaveAttribute('data-loading', 'true');
        expect(card).toHaveAttribute('data-show-id', '');
      });
    });
  });
});
