import { useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useProjectStore } from '@/store/useProjectStore';
import { syncLocalToCloud } from '@/services/syncService';

/**
 * Custom hook to automatically push local modifications ("dirty" projects)
 * to Supabase after a debounce period of user inactivity
 */
export const useAutoPush = () => {
    const { user, isLoading } = useAuthStore();

    useEffect(() => {
        if (!navigator.onLine || !user || isLoading) {
            // Skip setup if is not online, user session is loading or user is unauthenticated
            return;
        }

        let timeout: NodeJS.Timeout;

        // subscribe to Zustand store changes to track local state mutations
        const unsubscribe = useProjectStore.subscribe((state) => {
            const hasDirtyProjects = state.projects.some(
                ({ isDirty }) => isDirty
            );

            // Trigger push only when there are dirty recortds, and sync is idle
            if (hasDirtyProjects && !state.isSyncing) {
                clearTimeout(timeout);

                // Wait for 1.5 seconds of inactivity before executing the cloud push request
                timeout = setTimeout(async () => {
                    try {
                        console.log(
                            '[Sync] Local modification detected. Pushing to cloud (Auto-Push)...'
                        );
                        await syncLocalToCloud(user.id);
                    } catch (err) {
                        console.error(
                            '[Sync] Auto-push synchronization failed: ',
                            err
                        );
                    }
                }, 1500);
            }
        });

        return () => {
            unsubscribe();
            clearTimeout(timeout);
        };
    }, [user, isLoading]);
};
