import { useRegisterSW } from 'virtual:pwa-register/react';
import { RefreshCw, X } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

type UpdatePromptProps = {
    forceDisplay?: boolean;
};

export const UpdatePrompt = ({ forceDisplay = false }: UpdatePromptProps) => {
    const {
        needRefresh: [needRefresh, setNeedRefresh],
        updateServiceWorker,
    } = useRegisterSW({
        onRegisteredSW(swScriptUrl, registration) {
            if (registration) {
                setInterval(
                    () => {
                        registration.update();
                    },
                    60 * 60 * 1000
                ); // every hour
            }
        },
        onRegisterError(error) {
            console.error('[PWA] Service Worker registrarion error: ', error);
        },
    });

    if (!needRefresh && !forceDisplay) return null;

    const handleUpdate = async () => {
        await updateServiceWorker(true);
    };

    const handleDismiss = () => {
        setNeedRefresh(false);
    };

    return (
        <aside
            role="status"
            aria-live="polite"
            className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2"
        >
            <Card
                variant="elevated"
                className="border-vibrant-coral/30 bg-bone-white flex flex-col gap-3 border px-4 py-3 shadow-lg"
            >
                <p className="text-xs">
                    <b>New version of Loopo available</b>
                    <br />
                    <span className="text-misty-gray">
                        Reload to get the latest updates. Your saved projects
                        stay safe.
                    </span>
                </p>
                <div className="flex w-full items-center justify-between">
                    <Button
                        variant="squared"
                        color="primary"
                        size="small"
                        icon={<RefreshCw size={14} />}
                        onClick={handleUpdate}
                    >
                        Update
                    </Button>
                    <Button
                        variant="text"
                        color="secondary"
                        size="small"
                        icon={<X size={16} />}
                        aria-label="Dismiss update notification"
                        onClick={handleDismiss}
                    />
                </div>
            </Card>
        </aside>
    );
};
