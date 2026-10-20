import { useEffect, useState } from 'react';
import { useProjectStore } from '@/store/useProjectStore';

export function useHydratedStore<F>(
    selector: (state: ReturnType<typeof useProjectStore.getState>) => F
): { data: F; isHydrated: boolean } {
    const data = useProjectStore(selector);
    const [isHydrated, setIsHydrated] = useState(
        useProjectStore.persist.hasHydrated()
    );

    useEffect(() => {
        if (useProjectStore.persist.hasHydrated()) {
            setIsHydrated(true);
            return;
        }

        const unsubscribe = useProjectStore.persist.onFinishHydration(() => {
            setIsHydrated(true);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    return { data, isHydrated };
}
