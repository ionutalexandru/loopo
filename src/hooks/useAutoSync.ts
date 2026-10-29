import { useEffect } from 'react';
import { syncBidirectional } from '@/services/syncService';
import { useAuthStore } from '@/store/useAuthStore';

// As there is an auto-push and auto-pull on changing data, we can increment this interval
const SYNC_INTERVAL_MIN = 5;

export const useAutoSync = () => {
    const { user, isLoading } = useAuthStore();

    useEffect(() => {
        if (isLoading || !user) return;

        const syncInterval = SYNC_INTERVAL_MIN * 60 * 1000;

        const interval = setInterval(() => {
            if (navigator.onLine) {
                syncBidirectional(user.id);
            }
        }, syncInterval);

        // when changing online status, make a request
        const handleOnline = () => {
            syncBidirectional(user.id);
        };
        window.addEventListener('online', handleOnline);

        // handler when visibility state change (moving from one tab to another, for example)
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible' && navigator.onLine) {
                syncBidirectional(user.id);
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            clearInterval(interval);
            window.removeEventListener('online', handleOnline);
            document.removeEventListener(
                'visibilitychange',
                handleVisibilityChange
            );
        };
    }, [user, isLoading]);
};
