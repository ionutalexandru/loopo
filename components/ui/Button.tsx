import React from 'react';
import Link from 'next/link';

export type ButtonVariant = 'text' | 'squared' | 'pill';
export type ButtonColor = 'primary' | 'secondary' | 'danger';
export type ButtonSize = 'default' | 'small';

export interface BaseButtonProps {
    color?: ButtonColor;
    variant?: ButtonVariant;
    icon?: React.ReactNode;
    children?: React.ReactNode;
    size?: ButtonSize;
    disabled?: boolean;
}

// Props when rendered as HTML <button>
type ButtonAsButton = BaseButtonProps &
    Omit<
        React.ButtonHTMLAttributes<HTMLButtonElement>,
        keyof BaseButtonProps
    > & {
        href?: undefined;
    };

// Props when rendered as Next.js <Link>
type ButtonAsLink = BaseButtonProps &
    Omit<React.ComponentProps<typeof Link>, keyof BaseButtonProps> & {
        href: React.ComponentProps<typeof Link>['href'];
    };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

export const Button = React.forwardRef<
    HTMLButtonElement | HTMLAnchorElement,
    ButtonProps
>(
    (
        {
            variant = 'pill',
            color = 'primary',
            size = 'default',
            icon,
            children,
            className = '',
            disabled,
            ...rest
        },
        ref
    ) => {
        const onlyIcon = icon !== undefined && children === undefined;

        const baseStyles = `inline-flex items-center justify-center gap-2 font-bold ${onlyIcon ? (size === 'small' ? 'p-1.5' : 'p-3.5') : 'py-4 px-6'} select-none cursor-pointer active:scale-[0.98] focus:outline-hidden focus:ring-2 focus:ring-offset-2 ${size === 'small' ? 'focus:rounded-xl focus-visible:rounded-xl' : 'focus:rounded-2xl focus-visible:rounded-2xl'} focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:text-misty-gray disabled:scale-none`;

        const shapeStyles: Record<ButtonVariant, string> = {
            squared: size === 'small' ? 'rounded-xl' : 'rounded-2xl',
            pill: 'rounded-full focus:rounded-full focus-visible:rounded-full',
            text: 'active:scale-none',
        };

        const getColors = (v: ButtonVariant, c: ButtonColor): string => {
            if (v === 'text') {
                const colors: Record<ButtonColor, string> = {
                    primary:
                        'text-vibrant-coral stroke-vibrant-coral hover:text-deep-coral hover:stroke-deep-coral',
                    secondary: 'text-charcoal',
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

        const combinedClassName = `${baseStyles} ${shapeStyles[variant]} ${getColors(
            variant,
            color
        )} ${className}`;

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

        if ('href' in rest && rest.href) {
            const { href, onClick, ...anchorRest } =
                rest as React.ComponentProps<typeof Link>;

            return (
                <Link
                    ref={ref as React.Ref<HTMLAnchorElement>}
                    href={href}
                    className={`${combinedClassName} ${
                        disabled
                            ? `bg-chalk-gray! pointer-events-none
                                text-misty-gray!`
                            : ''
                        }`}
                    onClick={(e) => {
                        if (disabled) {
                            e.preventDefault();
                            return;
                        }
                        onClick?.(e);
                    }}
                    aria-disabled={disabled}
                    {...anchorRest}
                >
                    {renderIcon()}
                    {children}
                </Link>
            );
        }

        const { type = 'button', ...buttonRest } =
            rest as React.ButtonHTMLAttributes<HTMLButtonElement>;

        return (
            <button
                ref={ref as React.Ref<HTMLButtonElement>}
                type={type}
                disabled={disabled}
                className={combinedClassName}
                {...buttonRest}
            >
                {renderIcon()}
                {children}
            </button>
        );
    }
);

Button.displayName = 'Button';
