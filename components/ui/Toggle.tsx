'use client';

import React, { useId, useState } from 'react';

interface ToggleProps {
    ref?: React.Ref<HTMLInputElement>;
    label?: string;
    defaultChecked?: boolean;
    disabled?: boolean;
    className?: string;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

export const Toggle = ({
    ref,
    label,
    defaultChecked,
    disabled,
    className,
    onChange,
    ...props
}: ToggleProps) => {
    const generatedId = useId();
    const [internalChecked, setInternalChecked] = useState<boolean>(
        defaultChecked ?? false
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (disabled) return;
        const newChecked = e.target.checked;
        setInternalChecked(newChecked);
        if (onChange) {
            onChange(e);
        }
    };

    return (
        <label
            htmlFor={generatedId}
            className={`inline-flex items-center gap-3 select-none ${disabled ? 'cursor-not-allowed opacity-40' : 'cursor-pointer'} ${className} `}
        >
            <span className="text-charcoal text-sm font-bold">{label}</span>
            <div className="relative inline-flex items-center">
                <input
                    type="checkbox"
                    ref={ref}
                    id={generatedId}
                    checked={internalChecked}
                    disabled={disabled}
                    onChange={handleChange}
                    className="peer sr-only"
                    {...props}
                />
                <div className="bg-chalk-gray peer-focus:ring-charcoal/30 peer-checked:bg-vibrant-coral h-5 w-10 rounded-full transition-colors duration-200 ease-in-out peer-focus:ring-1" />
                <div className="absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow-xs transition-transform duration-200 ease-in-out peer-checked:translate-x-5" />
            </div>
        </label>
    );
};
