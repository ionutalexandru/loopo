import React, { useId } from 'react';
import { HelpCircle, Check, AlertTriangle } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    ref?: React.Ref<HTMLInputElement>;
    label?: string;
    error?: string;
    icon?: React.ReactNode;
    className?: string;
    disabled?: boolean;
    type?: string;
    helpText?: string;
    success?: boolean;
    placeholder?: string;
}

export const Input = ({
    ref,
    label,
    helpText,
    error,
    success,
    className = '',
    disabled,
    type = 'text',
    ...props
}: InputProps) => {
    const generatedId = useId();

    const baseInputStyles =
        'w-full bg-white p-4 rounded-xl duration-150 transition-all focus:outline-hidden focus-visible:outline-hidden placeholder:text-misty-gray';

    const defaultStyles = 'border-2 border-chalk-gray';

    const hoverActiveStyles =
        'hover:border-charcoal hover:placeholder:text-charcoal focus:border-charcoal focus:placeholder:text-charcoal focus-visible:border-charcoal focus-visible:placeholder:text-charcoal';

    const successStyles = 'border-2 border-chalk-gray pr-12';

    const errorStyles =
        'border-2 border-crimson pr-12 placeholder:text-crimson hover:placeholder:text-crimson text-crimson';

    const disabledStyles =
        'border-2 opacity-50 cursor-not-allowed bg-chalk-gray/30 border-chalk-gray';

    const getInputModifiers = () => {
        if (error) return errorStyles;
        if (success) return `${successStyles} ${hoverActiveStyles}`;
        if (disabled) return disabledStyles;
        return `${defaultStyles} ${hoverActiveStyles}`;
    };

    return (
        <div
            className="flex w-full flex-col gap-1.5 font-sans
                focus:outline-hidden focus-visible:outline-hidden"
        >
            {label && (
                <label
                    htmlFor={generatedId}
                    className={`text-xs font-semibold transition-colors
                    select-none
                    ${error ? 'text-crimson' : disabled ? 'opacity-40' : ''}`}
                >
                    {label}
                </label>
            )}
            {/* input */}
            <div className="relative flex w-full items-center">
                <input
                    id={generatedId}
                    type={type}
                    ref={ref}
                    disabled={disabled}
                    className={`${baseInputStyles} ${getInputModifiers()}
                        ${className}`}
                    {...props}
                />
                {error && (
                    <span
                        className="text-crimson animate-fade-in absolute right-4
                            flex items-center justify-center"
                    >
                        <AlertTriangle size={20} strokeWidth={2.5} />
                    </span>
                )}
                {success && !error && (
                    <span
                        className="text-misty-grey animate-fade-in absolute
                            right-4 flex items-center justify-center"
                    >
                        <Check size={20} strokeWidth={2.5} />
                    </span>
                )}
            </div>
            {error ? (
                <span className="text-crimson animate-fade-in text-xs">
                    {error}
                </span>
            ) : (
                helpText && (
                    <div
                        className="text-misty-grey flex items-center gap-1.5
                            text-xs select-none"
                    >
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
