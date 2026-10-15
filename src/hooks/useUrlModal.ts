import React, { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

export function useUrlModal(paramName: string, paramValue: string) {
    const [searchParams, setSearchParams] = useSearchParams();

    const isOpen = searchParams?.get(paramName) === paramValue;

    const open = useCallback(
        (e?: React.SyntheticEvent) => {
            // cancel onClick native actions
            if (e && typeof e.preventDefault === 'function') {
                e.preventDefault();
            }
            setSearchParams(
                (prev) => {
                    const next = new URLSearchParams(prev);
                    next.set(paramName, paramValue);
                    return next;
                },
                { preventScrollReset: true }
            );
        },
        [paramName, paramValue, setSearchParams]
    );

    const close = useCallback(
        (e?: React.SyntheticEvent) => {
            // cancel onClick native actions
            if (e && typeof e.preventDefault === 'function') {
                e.preventDefault();
            }
            setSearchParams(
                (prev) => {
                    const next = new URLSearchParams(prev);
                    next.delete(paramName);
                    return next;
                },
                { preventScrollReset: true }
            );
        },
        [paramName, setSearchParams]
    );

    return { isOpen, open, close };
}
