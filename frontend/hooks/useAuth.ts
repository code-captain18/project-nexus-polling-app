import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { useAppSelector } from '../store/hooks';
import { TIMING } from '../utils/constants';

/**
 * Hook to handle authentication redirects
 */
export function useAuthRedirect() {
    const router = useRouter();
    const { isAuthenticated } = useAppSelector((state) => state.auth);

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (!isAuthenticated) {
                router.replace('/signin');
            }
        }, TIMING.navigationDelay);

        return () => clearTimeout(timeout);
    }, [isAuthenticated, router]);

    return { isAuthenticated };
}

/**
 * Hook to check if user is poll creator
 */
export function useIsPollCreator(pollCreatorId?: string) {
    const { user } = useAppSelector((state) => state.auth);
    return user && pollCreatorId ? user.id === pollCreatorId : false;
}
