import { useEffect } from 'react';
import { useAppDispatch } from '../store/hooks';
import { fetchPollByIdAsync } from '../store/thunks/pollThunks';
import { TIMING } from '../utils/constants';

/**
 * Hook to auto-refresh poll data at intervals
 * Disabled by default - relies on focus-based refresh and optimistic updates
 */
export function usePollAutoRefresh(
    pollId: string | string[] | undefined,
    enabled: boolean
) {
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (!enabled || !pollId || typeof pollId !== 'string' || TIMING.autoRefreshInterval === 0) {
            return;
        }

        const interval = setInterval(() => {
            dispatch(fetchPollByIdAsync(pollId));
        }, TIMING.autoRefreshInterval);

        return () => clearInterval(interval);
    }, [pollId, dispatch, enabled]);
}
