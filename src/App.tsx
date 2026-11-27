import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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
import GuideLayout from '@/components/views/guide/GuideLayout';
import WelcomeSection from '@/components/views/guide/WeclomeSection';
import GettingStartedSection from '@/components/views/guide/GettingStartedSection';
import DashboardSection from '@/components/views/guide/DashboardSection';
import PartsSection from './components/views/guide/PartsSection';
import GlobalCounterSection from './components/views/guide/GlobalCounterSection';
import SecondaryCountersSection from './components/views/guide/SecondaryCountersSection';
import SyncSection from './components/views/guide/SyncSection';
import FaqSection from './components/views/guide/FaqSection';

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
                    <Route path="/guide" element={<GuideLayout />}>
                        <Route
                            index
                            element={<Navigate to="/guide/welcome" replace />}
                        />
                        <Route path="welcome" element={<WelcomeSection />} />
                        <Route
                            path="getting-started"
                            element={<GettingStartedSection />}
                        />
                        <Route
                            path="dashboard"
                            element={<DashboardSection />}
                        />
                        <Route path="parts" element={<PartsSection />} />
                        <Route
                            path="global-counter"
                            element={<GlobalCounterSection />}
                        />
                        <Route
                            path="secondary-counters"
                            element={<SecondaryCountersSection />}
                        />
                        <Route path="sync" element={<SyncSection />} />
                        <Route path="faq" element={<FaqSection />} />
                    </Route>
                    <Route path="*" element={<NotFoundView />} />
                </Routes>
            </BrowserRouter>
        </>
    );
}
