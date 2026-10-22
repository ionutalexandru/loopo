import React, { useState } from 'react';
import { AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

import { Button } from '@/components/ui/Button';

export type AlertVariant = 'error' | 'warning' | 'info';

interface AlertProps {
    message: string;
    variant?: AlertVariant;
    onDismiss?: () => void;
    className?: string;
    isVisible?: boolean;
    dismissible?: boolean;
    icon?: React.ReactNode;
}

const variantStyles: Record<
    AlertVariant,
    {
        container: string;
        dismissIconColor: string;
        icon: React.ReactNode;
        iconProps: Record<string, string | number>;
    }
> = {
    error: {
        container: 'bg-crimson/10 border-crimson/30 text-crimson',
        dismissIconColor: 'text-crimson!',
        icon: <AlertCircle />,
        iconProps: {
            size: 20,
            className: 'text-crimson',
        },
    },
    warning: {
        container: 'bg-amber-600/10 border-amber-600/30 text-amber-600',
        dismissIconColor: 'text-amber-600!',
        icon: <AlertTriangle />,
        iconProps: {
            size: 20,
            className: 'text-amber-600',
        },
    },
    info: {
        container: 'bg-emerald-600/15 border-emerald-600/35 text-emerald-600',
        dismissIconColor: 'text-emerald-600!',
        icon: <Info />,
        iconProps: {
            size: 20,
            className: 'text-emerald-600',
        },
    },
};

export const Alert = ({
    message,
    variant = 'error',
    onDismiss,
    className = '',
    isVisible = false,
    dismissible = true,
    icon: incomingIcon,
}: AlertProps) => {
    const [internalIsVisible, setInternalIsVisible] = useState<boolean>(
        isVisible || message.trim().length > 0
    );

    if (!message.trim() || !internalIsVisible) return null;

    const handleDismiss = () => {
        if (!dismissible) return;
        setInternalIsVisible(false);
        onDismiss?.();
    };

    const styles = variantStyles[variant];

    const icon = incomingIcon ? incomingIcon : styles.icon;
    const renderIcon = () =>
        React.isValidElement(icon)
            ? React.cloneElement(icon, {
                  size: styles.iconProps.size,
                  className: `mt-0.5 shrink-0 ${styles.iconProps.className}`,
              } as any)
            : null;

    return (
        <div
            role="alert"
            aria-live="polite"
            className={`flex items-center gap-3 rounded-2xl border px-4 py-5 transition-all transition-discrete duration-300 ${styles.container} ${className}`}
        >
            {renderIcon()}
            <div className="flex-1 text-sm leading-relaxed font-medium">
                {message}
            </div>
            {dismissible && (
                <Button
                    onClick={handleDismiss}
                    type="button"
                    aria-label="Close alert"
                    icon={<X />}
                    variant="text"
                    className={`${styles.dismissIconColor} p-0!`}
                />
            )}
        </div>
    );
};
