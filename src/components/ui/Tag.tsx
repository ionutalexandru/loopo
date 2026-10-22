import React, { useId } from 'react';

export type TagVariant = 'neutral' | 'highlight' | 'muted';
export type TagSize = 'medium' | 'small';

interface TagProps {
    label: string;
    className?: string;
    variant?: TagVariant;
    icon?: React.ReactNode;
    size?: TagSize;
    uppercase?: boolean;
}

export const Tag = ({
    label,
    variant = 'neutral',
    icon,
    className = '',
    size = 'medium',
    uppercase = false,
}: TagProps) => {
    const generatedId = useId();

    const defaultStyles = `inline-flex items-center justify-center tracking-wider ${size === 'small' ? 'gap-1 py-2 px-1 text-[8px] font-semibold rounded' : 'gap-2 py-3 px-2 text-sm font-bold rounded-xl'}${uppercase ? ' uppercase' : ''}`;

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
            <span className="line-clamp-1">{label}</span>
        </div>
    );
};
