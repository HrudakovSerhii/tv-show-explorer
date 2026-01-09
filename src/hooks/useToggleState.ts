import { useState, useEffect, useCallback } from 'react';

type UseToggleStateOptions<TResult> = {
  checkStatus: () => boolean | Promise<boolean>;
  onToggle: () => TResult | Promise<TResult>;
  dependencies?: unknown[];
};

type UseToggleStateReturn = {
  isActive: boolean;
  isLoading: boolean;
  handleToggle: () => void;
};

export function useToggleState<TResult>({
  checkStatus,
  onToggle,
  dependencies = [],
}: UseToggleStateOptions<TResult>): UseToggleStateReturn {
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadInitialStatus() {
      try {
        const status = await checkStatus();

        setIsActive(status);
      } catch (error) {
        console.error('Error checking status:', error);
      }
    }

    loadInitialStatus().finally(() => setIsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  const handleToggle = useCallback(async () => {
    try {
      const result = await onToggle();

      // Handle boolean return (e.g., from localStorage toggleWatchlist)
      if (typeof result === 'boolean') {
        setIsActive(result);
      }

      // Handle FavoriteActionResult object (e.g., from server actions)
      else if (result && typeof result === 'object' && 'isFavorite' in result) {
        // This ugly conversion is example of how benefits of combining sync/async under one API might affect code quality and introduce bugs
        const response = result as unknown as { success: boolean; isFavorite?: boolean };

        if (response.success && response.isFavorite !== undefined) {
          setIsActive(response.isFavorite);
        }
      }
    } catch (error) {
      console.error('Error toggling state:', error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onToggle]);

  return {
    isActive,
    isLoading,
    handleToggle,
  };
}
