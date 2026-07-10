import React from 'react';

export type ButtonVariant = 'text' | 'squared' | 'pill';
export type ButtonColor = 'primary' | 'secondary' | 'danger';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    color?: ButtonColor;
    variant?: ButtonVariant;
    icon?: React.ReactNode;
    children?: React.ReactNode;
}

export const Button = ({
    variant = 'pill',
    color = 'primary',
    icon,
    children,
    className = '',
    disabled,
    ...props
}: ButtonProps) => {
    const onlyIcon = icon !== undefined && children === undefined;

    const baseStyles = `inline-flex items-center justify-center gap-2 font-bold ${onlyIcon ? 'p-3.5' : 'py-4 px-6'} select-none cursor-pointer active:scale-[0.98] focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:rounded-2xl focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:rounded-2xl disabled:cursor-not-allowed disabled:text-misty-gray disabled:scale-none`;

    const shapeStyles: Record<ButtonVariant, string> = {
        squared: 'rounded-2xl',
        pill: 'rounded-full focus:rounded-full focus-visible:rounded-full',
        text: 'active:scale-none',
    };

    const getColors = (v: ButtonVariant, c: ButtonColor): string => {
        if (v === 'text') {
            const colors: Record<ButtonColor, string> = {
                primary:
                    'text-vibrant-coral stroke-vibrant-coral hover:text-deep-coral hover:stroke-deep-coral',
                secondary: 'text-misty-gray hover:text-charcoal',
                danger: 'text-crimson stroke-crimson hover:text-deep-crimson hover:stroke-deep-crimson',
            };
            return colors[c];
        }

        const colors: Record<ButtonColor, string> = {
            primary:
                'bg-vibrant-coral text-pure-wool stroke-pure-wool hover:bg-deep-coral focus:ring-vibrant-coral focus-visible:ring-vibrant-coral focus:hover:ring-deep-coral focus-visible:hover:ring-deep-coral disabled:bg-chalk-gray',
            secondary: 'bg-chalk-gray hover:bg-concrete-gray',
            danger: 'bg-crimson text-pure-wool stroke-pure-wool hover:bg-deep-crimson hover:stroke-deep-crimson focus:ring-crimson focus-visible:ring-crimson focus:hover:ring-deep-crimson focus-visible:hover:ring-deep-crimson disabled:bg-chalk-gray',
        };
        return colors[c];
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
                width: 20,
                height: 20,
            } as React.Attributes);
        }
    };

    return (
        <button
            className={`${baseStyles} ${shapeStyles[variant]} ${getColors(variant, color)} ${className}`}
            disabled={disabled}
            {...props}
        >
            {renderIcon()}
            {children}
        </button>
    );
};
