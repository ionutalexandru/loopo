import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { useEffect } from 'react';

import MyBasketView from '@/components/views/MyBasketView';
import CreateProjectView from '@/components/views/CreateProjectView';
import CreatePartView from '@/components/views/CreatePartView';
import PartDisplayView from '@/components/views/PartDisplayView';
import OfflineView from '@/components/views/OfflineView';
import NotFoundView from '@/components/views/NotFoundView';
import StyleGuideView from '@/components/views/StyleguideView';
import { AuthModal } from '@/components/widgets/AuthModal';
import { useAuthStore } from '@/store/useAuthStore';
import { useAutoSync } from '@/hooks/useAutoSync';
import { useRealtimeSync } from '@/hooks/useRealtimeSync';
import { useAutoPush } from '@/hooks/useAutoPush';

export default function App() {
    const initializeAuth = useAuthStore((state) => state.initialize);

    // 1. Background auto-sync interval & network/visibility listeners
    useAutoSync();

    // 2. Instant cross-devices synchronization via Websockets
    useRealtimeSync();

    // 3. Instant push of local data when modifications found
    useAutoPush();

    useEffect(() => {
        initializeAuth();
    }, [initializeAuth]);

    return (
        <>
            <Analytics />
            <BrowserRouter>
                <AuthModal />
                <Routes>
                    <Route path="/" element={<MyBasketView />} />
                    <Route
                        path="/projects/new"
                        element={<CreateProjectView />}
                    />
                    <Route
                        path="/projects/:slug/parts/new"
                        element={<CreatePartView />}
                    />
                    <Route
                        path="/projects/:slug/parts/:partSlug"
                        element={<PartDisplayView />}
                    />
                    <Route path="/offline" element={<OfflineView />} />
                    <Route path="/styleguide" element={<StyleGuideView />} />
                    <Route path="*" element={<NotFoundView />} />
                </Routes>
            </BrowserRouter>
        </>
    );
}
