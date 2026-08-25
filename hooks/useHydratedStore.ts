'use client';

import { useSyncExternalStore } from 'react';

const emptySubscribe = () => () => {};

export function useHydratedStore<T, F>(
    store: (callback: (state: T) => unknown) => unknown,
    selector: (state: T) => F
): F | undefined {
    const isHydrated = useSyncExternalStore(
        emptySubscribe,
        () => true,
        () => false
    );

    const data = store(selector) as F;

    return isHydrated ? data : undefined;
}
