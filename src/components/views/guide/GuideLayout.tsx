import { Footer } from '@/components/navigation/Footer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import {
    ArrowLeft,
    ArrowRight,
    BookOpen,
    CheckCircle2,
    Cloud,
    Hash,
    HelpCircle,
    Layers,
    Smartphone,
    Sparkles,
} from 'lucide-react';
import { Link, Navigate, Outlet, useLocation } from 'react-router-dom';

const GUIDE_SECTIONS = [
    {
        id: 'welcome',
        title: '1. Introduction & Welcome',
        icon: <BookOpen size={16} />,
    },
    {
        id: 'getting-started',
        title: '2. Getting Started & PWA',
        icon: <Smartphone size={16} />,
    },
    {
        id: 'dashboard',
        title: '3. My Basket & Dashborad',
        icon: <Layers size={16} />,
    },
    {
        id: 'parts',
        title: '4. Project Parts & Materials',
        icon: <Hash size={16} />,
    },
    {
        id: 'global-counter',
        title: '5. Global Row Counter',
        icon: <Sparkles size={16} />,
    },
    {
        id: 'secondary-counters',
        title: '6. Secondary Counters',
        icon: <Layers size={16} />,
    },
    {
        id: 'sync',
        title: '7. Cloud Sync & Offline Mode',
        icon: <Cloud size={16} />,
    },
    {
        id: 'faq',
        title: '8. FAQ & Troubleshooting',
        icon: <HelpCircle size={16} />,
    },
];

export default function GuideLayout() {
    const location = useLocation();
    const sectionId = location.pathname.split('/').pop() || 'welcome';

    if (!sectionId) {
        return <Navigate to="/guide/welcome" replace />;
    }

    const currentIndex = GUIDE_SECTIONS.findIndex(({ id }) => id === sectionId);
    if (currentIndex === -1) {
        return <Navigate to="/guide/welcome" replace />;
    }

    const prevSection =
        currentIndex > 0 ? GUIDE_SECTIONS[currentIndex - 1] : null;
    const nextSection =
        currentIndex < GUIDE_SECTIONS.length - 1
            ? GUIDE_SECTIONS[currentIndex + 1]
            : null;

    return (
        <main className="mx-auto min-h-screen max-w-6xl p-4 sm:p-8">
            <header className="border-chalk-gray mb-12 border-b pb-6">
                <div className="flex items-center justify-between gap-5">
                    <Button
                        to="/"
                        icon={<ArrowLeft />}
                        variant="text"
                        size="small"
                    />
                    <h1 className="mb-0!">
                        loopo<span className="loopo-dot"></span>{' '}
                        <span className="text-misty-gray">Userguide</span>
                    </h1>
                </div>
            </header>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                <aside className="lg:col-span-4">
                    <Card
                        variant="bordered"
                        className="sticky top-8 flex flex-col gap-2 p-4"
                    >
                        <span className="text-misty-gray mb-2 px-3 text-xs font-black tracking-wider uppercase">
                            Table of Contents
                        </span>
                        <nav className="flex flex-col gap-1">
                            {GUIDE_SECTIONS.map((section) => {
                                const isActive = sectionId === section.id;
                                return (
                                    <Link
                                        key={section.id}
                                        to={`/guide/${section.id}`}
                                        className={`flex items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-bold select-none ${
                                            isActive
                                                ? 'bg-vibrant-coral text-white shadow-xs'
                                                : 'text-charcoal hover:bg-chalk-gray/60'
                                        }`}
                                    >
                                        <span className="flex items-center gap-2">
                                            {section.icon}
                                            {section.title}
                                        </span>
                                        {isActive && <CheckCircle2 size={16} />}
                                    </Link>
                                );
                            })}
                        </nav>
                    </Card>
                </aside>
                <div className="lg:col-span-8">
                    <Card
                        variant="bordered"
                        className="flex flex-col gap-6 p-6 sm:p-10"
                    >
                        <Outlet />

                        <div className="border-chalk-gray mt-2 flex items-center justify-between border-t pt-6">
                            {prevSection ? (
                                <Button
                                    to={`/guide/${prevSection.id}`}
                                    variant="text"
                                    color="secondary"
                                    size="small"
                                    icon={<ArrowLeft size={16} />}
                                >
                                    {prevSection.title}
                                </Button>
                            ) : (
                                <div />
                            )}

                            {nextSection ? (
                                <Button
                                    to={`/guide/${nextSection.id}`}
                                    variant="pill"
                                    color="primary"
                                    size="small"
                                    icon={<ArrowRight size={16} />}
                                    iconPosition="right"
                                >
                                    {nextSection.title}
                                </Button>
                            ) : (
                                <div />
                            )}
                        </div>
                    </Card>
                </div>
            </div>
            <Footer />
        </main>
    );
}
