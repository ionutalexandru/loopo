'use client';

import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { WifiOff } from 'lucide-react';

type OfflineIndicatorProps = {
    forceDisplay?: boolean;
};

export const OfflineIndicator = ({
    forceDisplay = false,
}: OfflineIndicatorProps) => {
    const isOnline = useOnlineStatus();

    if (isOnline && !forceDisplay) return null;

    return (
        <aside
            aria-live="polite"
            title="You are offline. Only visited pages are available"
            className="bg-vibrant-coral text-bone-white fixed right-4 bottom-5 z-60 flex items-center gap-4 rounded-full p-2 font-bold shadow-lg transition-all select-none"
        >
            <span className="relative flex h-8 w-8 items-center justify-center">
                <span className="bg-bone-white absolute inline-flex h-full w-full animate-ping rounded-full" />
                <WifiOff className="absolute size-6" />
            </span>
            <span className="sr-only">
                You are offline. Only visited pages are available
            </span>
        </aside>
    );
};
