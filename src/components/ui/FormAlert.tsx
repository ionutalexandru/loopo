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
        icon: <AlertCircle className="text-crimson mt-0.5 h-5 w-5 shrink-0" />,
    },
    warning: {
        container: 'bg-amber-600/10 border-amber-600/30 text-amber-600',
        dismissIconColor: 'text-amber-600!',
        icon: (
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
        ),
    },
    info: {
        container: 'bg-emerald-600/15 border-emerald-600/35 text-emerald-600',
        dismissIconColor: 'text-emerald-600!',
        icon: <Info className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />,
    },
};

export const FormAlert = ({
    message,
    variant = 'error',
    onDismiss,
    className = '',
    isVisible = false,
}: FormAlertProps) => {
    const [internalIsVisible, setInternalIsVisible] = useState<boolean>(
        isVisible || message.trim().length > 0
    );

    if (!message.trim() || !internalIsVisible) return null;

    const handleDismiss = () => {
        setInternalIsVisible(false);
        onDismiss?.();
    };

    const styles = variantStyles[variant];

    return (
        <div
            role="alert"
            aria-live="polite"
            className={`flex items-center gap-3 rounded-2xl border p-4 transition-all transition-discrete duration-300 ${styles.container} ${className}`}
        >
            {styles.icon}
            <div className="flex-1 text-sm leading-relaxed font-medium">
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
