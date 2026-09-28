'use client';

import { useSyncExternalStore } from 'react';

const emptySubscribe = () => () => {};

export function useHydratedStore<T, F>(
    store: (callback: (state: T) => unknown) => unknown,
    selector: (state: T) => F
): { data: F | undefined; isHydrated: boolean } {
    const isHydrated = useSyncExternalStore(
        emptySubscribe,
        () => true,
        () => false
    );

    const data = store(selector) as F;

    return { data, isHydrated };
}
