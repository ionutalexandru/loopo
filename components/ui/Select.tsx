'use client';

import React, { useId, useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    ref?: React.Ref<HTMLSelectElement>;
    label?: string;
    helpText?: string;
    error?: string;
    disabled?: boolean;
    className?: string;
    children?: React.ReactNode;
}

export const Select = ({
    ref,
    label,
    helpText,
    error,
    disabled,
    className,
    children,
    ...props
}: SelectProps) => {
    const generatedId = useId();

    const baseSelectStyles =
        'w-full font-sans text-base bg-white p-4 pr-12 rounded-xl appearance-none transition-all duration-150 focus:outline-hidden focus-visible:outline-hidden cursor-pointer';

    const [isPlaceholderActive, setPlaceholderActive] = useState(
        props.defaultValue === '' || props.value === ''
    );

    const defaultStyles = `border-2 border-chalk-gray text-charcoal ${isPlaceholderActive && 'text-misty-gray/70'}`;
    const hoverActiveStyles =
        'hover:border-charcoal focus:border-charcoal focus-visible:border-charcoal';
    const errorStyles = 'border-2 border-crimson text-crimson';
    const disabledStyles =
        'border-2 opacity-50 cursor-not-allowed bg-chalk-gray/30 border-chalk-gray';

    const getSelectModifiers = () => {
        if (error) return errorStyles;
        if (disabled) return disabledStyles;
        return `${defaultStyles} ${hoverActiveStyles}`;
    };

    return (
        <div className="flex w-full flex-col gap-1.5 font-sans focus:outline-hidden focus-visible:outline-hidden">
            {label && (
                <label
                    htmlFor={generatedId}
                    className={`text-xs font-semibold transition-colors select-none ${error ? 'text-crimson' : disabled ? 'opacity-40' : ''}`}
                >
                    {label}
                </label>
            )}
            <div className="relative flex w-full items-center">
                <select
                    id={generatedId}
                    ref={ref}
                    disabled={disabled}
                    className={`${baseSelectStyles} ${getSelectModifiers()} ${className} `}
                    onChange={(e) => {
                        setPlaceholderActive(e.target.value === '');
                        props.onChange?.(e);
                    }}
                    {...props}
                >
                    {children}
                </select>
                <span
                    className={`pointer-events-none absolute right-4 transition-colors ${
                        error ? 'text-crimson' : 'text-charcoal/60'
                    }`}
                >
                    <ChevronDown size={20} strokeWidth={2.5} />
                </span>
            </div>
            {error ? (
                <span className="text-crimson animate-fade-in text-xs">
                    {error}
                </span>
            ) : (
                helpText && (
                    <div className="text-misty-grey flex items-center gap-1.5 text-xs select-none">
                        <HelpCircle
                            size={14}
                            strokeWidth={2.5}
                            className="shrink-0"
                        />
                        <span>{helpText}</span>
                    </div>
                )
            )}
        </div>
    );
};
