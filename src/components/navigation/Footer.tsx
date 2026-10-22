import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useAuthStore } from '@/store/useAuthStore';
import {
    BookOpen,
    Cloud,
    CloudOff,
    Database,
    Heart,
    Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { formatRelativeTime } from '@/utils/date';
import { Link } from 'react-router-dom';

export const Footer = () => {
    const isOnline = useOnlineStatus();
    const { user, lastSyncedAt, openAuthModal } = useAuthStore();
    // fast debug
    const showAll = false;

    return (
        <footer className="border-chalk-gray mt-4 flex w-full flex-col gap-3 border-t pt-6 pb-8">
            {/* Offline mode */}
            {!isOnline || showAll ? (
                <div className="bg-vibrant-coral/10 border-vibrant-coral/30 text-deep-coral flex items-center gap-3 rounded-xl border px-3 py-4 text-xs font-medium">
                    <span className="relative flex size-3">
                        <span className="bg-vibrant-coral absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"></span>
                        <span className="bg-deep-coral relative inline-flex size-3 rounded-full"></span>
                    </span>{' '}
                    <CloudOff size={16} />
                    <span>
                        Ofline mode active. Changes are stored on this device
                        {user && 'and will sync once reconnected'}.
                    </span>
                </div>
            ) : null}

            {/* Unauthenticated Local-Only Warning */}
            {(isOnline && !user) || showAll ? (
                <div className="bg-chalk-gray/60 border-concrete-gray flex items-center justify-between gap-3 rounded-xl border px-3 py-4 text-xs font-medium">
                    <div className="flex w-8/12 items-center gap-3">
                        <Database size={20} />
                        <div className="flex-1">
                            <strong>Local-only storage</strong>: Your projects
                            currently live in this browser. Clearing browsing
                            data will erase them.
                        </div>
                    </div>
                    <Button
                        variant="text"
                        color="secondary"
                        size="small"
                        onClick={openAuthModal}
                    >
                        Sign in
                    </Button>
                </div>
            ) : null}

            {/* Logged in */}
            {(isOnline && user) || showAll ? (
                <div className="text-misty-gray flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                        <Cloud size={20} className="text-vibrant-coral" />
                        <span> Cloud backup enabled</span>
                    </div>
                    <span>
                        {lastSyncedAt
                            ? `Last cloud update: ${formatRelativeTime(lastSyncedAt)}}`
                            : 'All changes synced'}
                    </span>
                </div>
            ) : null}

            {/* Navigation & Attribution */}
            <div className="border-chalk-gray/50 text-misty-gray flex flex-wrap items-center justify-between gap-3 border-t-2 py-4 text-xs">
                <div className="flex items-center gap-3">
                    <Link
                        to="/styleguide"
                        className="hover:text-charcoal flex items-center gap-1.5"
                    >
                        <Sparkles size={10} />
                        Styleguide
                    </Link>
                    <Link
                        to="#"
                        className="hover:text-charcoal flex items-center gap-1.5"
                    >
                        <BookOpen size={10} />
                        Userguide
                        <span className="bg-chalk-gray ml-1 rounded px-1 py-2 text-[8px] font-semibold tracking-wider uppercase">
                            Soon
                        </span>
                    </Link>
                </div>
                <div className="flex items-center">
                    Crafted with{' '}
                    <Heart size={10} className="fill-charcoal mx-1" /> by
                    <a
                        href="https://github.com/ionutalexandru"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-charcoal hover:text-vibrant-coral ml-1 font-semibold underline underline-offset-2"
                    >
                        Ionuț-Alexandru
                    </a>
                </div>
            </div>

            {/* Brand */}
            <div className="text-misty-gray/80 flex items-center justify-between text-xs">
                <span className="font-comfortaa font-bold">
                    loopo<span className="loopo-dot"></span>
                </span>
                <span> Crafted for knitters & crocheters</span>
            </div>
        </footer>
    );
};
