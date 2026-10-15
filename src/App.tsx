import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MyBasketView from '@/components/views/MyBasketView';
import CreateProjectView from '@/components/views/CreateProjectView';
import CreatePartView from '@/components/views/CreatePartView';
import PartDisplayView from '@/components/views/PartDisplayView';
import OfflinePage from '@/offline/page';
import NotFound from '@/not-found';
import StyleGuideView from '@/components/views/StyleguideView';
import { OfflineIndicator } from '@/components/system/OfflineIndicator';

export default function App() {
    return (
        <BrowserRouter>
            {/* <OfflineIndicator /> */}
            <Routes>
                <Route path="/" element={<MyBasketView />} />
                <Route path="/projects/new" element={<CreateProjectView />} />
                <Route
                    path="/projects/:slug/parts/new"
                    element={<CreatePartView />}
                />
                <Route
                    path="/projects/:slug/parts/:partSlug"
                    element={<PartDisplayView />}
                />
                <Route path="/offline" element={<OfflinePage />} />
                <Route path="/styleguide" element={<StyleGuideView />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}
