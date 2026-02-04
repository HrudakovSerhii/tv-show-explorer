import { useState, useEffect, useCallback } from 'react';

import { log } from '@/lib/utils/logger';

type UseToggleStateOptions = {
  checkStatus: () => boolean | Promise<boolean>;
  onToggle: () => boolean | Promise<boolean>;
  dependencies?: unknown[];
};

type UseToggleStateReturn = {
  isActive: boolean;
  isLoading: boolean;
  handleToggle: () => void;
};

export function useToggleState({
  checkStatus,
  onToggle,
  dependencies = [],
}: UseToggleStateOptions): UseToggleStateReturn {
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadInitialStatus() {
      try {
        const status = await checkStatus();
        setIsActive(status);
      } catch (error) {
        log.error('Error checking status:', error);
      }
    }

    loadInitialStatus().finally(() => setIsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  const handleToggle = useCallback(async () => {
    try {
      setIsActive(await onToggle());
    } catch (error) {
      log.error('Error toggling state:', error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onToggle]);

  return { isActive, isLoading, handleToggle };
}
