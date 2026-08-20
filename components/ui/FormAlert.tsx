'use client';

import React, { useState } from 'react';
import { AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

import { Button } from '@/components/ui/Button';

export type FormAlertVariant = 'error' | 'warning' | 'info';

interface FormAlertProps {
    message: string;
    variant?: FormAlertVariant;
    onDismiss?: () => void;
    className?: string;
    isVisible?: boolean;
}

const variantStyles: Record<
    FormAlertVariant,
    { container: string; dismissIconColor: string; icon: React.ReactNode }
> = {
    error: {
        container: 'bg-crimson/10 border-crimson/30 text-crimson',
        dismissIconColor: 'text-crimson!',
        icon: <AlertCircle className="w-5 h-5 text-crimson shrink-0 mt-0.5" />,
    },
    warning: {
        container: 'bg-amber-600/10 border-amber-600/30 text-amber-600',
        dismissIconColor: 'text-amber-600!',
        icon: (
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        ),
    },
    info: {
        container: 'bg-emerald-600/15 border-emerald-600/35 text-emerald-600',
        dismissIconColor: 'text-emerald-600!',
        icon: <Info className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />,
    },
};

export const FormAlert = ({
    message,
    variant = 'error',
    onDismiss,
    className = '',
    isVisible = false,
}: FormAlertProps) => {
    const [internalIsVisible, setInternalIsVisible] = useState(isVisible);

    if (!internalIsVisible) return null;

    if (!message || !internalIsVisible) return null;

    const handleDismiss = () => {
        setInternalIsVisible(false);
        onDismiss?.();
    };

    const styles = variantStyles[variant];

    return (
        <div
            role="alert"
            aria-live="polite"
            className={`flex items-center gap-3 p-4 rounded-2xl border
                transition-all duration-300 transition-discrete
                ${styles.container} ${className}`}
        >
            {styles.icon}
            <div className="flex-1 text-sm font-medium leading-relaxed">
                {message}
            </div>
            <Button
                onClick={handleDismiss}
                type="button"
                aria-label="Close alert"
                icon={<X />}
                variant="text"
                className={styles.dismissIconColor}
            />
        </div>
    );
};
