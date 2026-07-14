import React, { useId } from 'react';

export type TagVariant = 'neutral' | 'highlight' | 'muted';

interface TagProps {
    label: string;
    className?: string;
    variant?: TagVariant;
    icon: React.ReactNode;
}

export const Tag = ({
    label,
    variant = 'neutral',
    icon,
    className,
}: TagProps) => {
    const generatedId = useId();

    const defaultStyles =
        'inline-flex items-center justify-center gap-2 rounded-xl py-2 px-3 text-sm font-bold';

    const variantStyles: Record<TagVariant, string> = {
        neutral: 'bg-chalk-gray',
        highlight: 'bg-vibrant-coral/10 text-vibrant-coral',
        muted: 'border-2 border-chalk-gray',
    };

    const renderIcon = () => {
        if (!icon) return null;

        if (React.isValidElement(icon)) {
            const iconProps = icon.props as Record<string, unknown>;
            const hasCustomSize =
                iconProps.width !== undefined ||
                iconProps.height !== undefined ||
                iconProps.size !== undefined;

            if (hasCustomSize) {
                return icon;
            }

            return React.cloneElement(icon, {
                width: 16,
                height: 16,
            } as React.Attributes);
        }
    };

    return (
        <div
            id={generatedId}
            className={`${defaultStyles} ${variantStyles[variant]} ${className}`}
        >
            {renderIcon()}
            {label}
        </div>
    );
};
