import { useEffect } from 'react';
import { syncBidirectional } from '@/services/syncService';
import { useAuthStore } from '@/store/useAuthStore';

const SYNC_INTERVAL_MIN = 3;

export const useAutoSync = () => {
    const { user } = useAuthStore();

    useEffect(() => {
        if (!user) return;

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

        return () => {
            clearInterval(interval);
            window.removeEventListener('online', handleOnline);
        };
    }, [user]);
};
