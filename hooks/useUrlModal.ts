'use client';

import React, { useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

export function useUrlModal(paramName: string, paramValue: string) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const isOpen = searchParams?.get(paramName) === paramValue;

    const open = useCallback(
        (e?: React.SyntheticEvent) => {
            // cancel onClick native actions
            if (e && typeof e.preventDefault === 'function') {
                e.preventDefault();
            }
            const params = new URLSearchParams(searchParams?.toString());
            params.set(paramName, paramValue);
            router.push(`${pathname}?${params.toString()}`, { scroll: false });
        },
        [paramName, paramValue, pathname, searchParams, router]
    );

    const close = useCallback(
        (e?: React.SyntheticEvent) => {
            // cancel onClick native actions
            if (e && typeof e.preventDefault === 'function') {
                e.preventDefault();
            }
            const params = new URLSearchParams(searchParams?.toString());
            params.delete(paramName);
            const query = params.toString();
            const newUrl = query ? `${pathname}?${query}` : pathname;

            router.push(newUrl, { scroll: false });
        },
        [paramName, pathname, searchParams, router]
    );

    return { isOpen, open, close };
}
