import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/useAuthStore';
import { syncCloudToLocal } from '@/services/syncService';

/**
 * Custom hook to manage realtime updates across multiple active clients devices.
 * It establishes a WebSocket subscription via Supabase Realtime to listen for
 * database changes on the `projects`table for authenticated users.
 */
export const useRealtimeSync = () => {
    const { user, isLoading } = useAuthStore();

    useEffect(() => {
        if (!navigator.onLine || !user || isLoading) {
            // Skip setup if is not online, user session is loading or user is unauthenticated
            return;
        }

        const channel = supabase
            .channel(`projects-changes-${user.id}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'projects',
                    filter: `user_id=eq.${user.id}`,
                },
                (payload) => {
                    console.log(
                        '[Realtime] Remote state change detected from another device: ',
                        payload
                    );

                    // Now pull changes down to local storage
                    syncCloudToLocal(user.id);
                }
            )
            .subscribe();

        return () => {
            // Clean up and remove channel subscription on unmount or sign-out
            supabase.removeChannel(channel);
        };
    }, [user, isLoading]);
};
