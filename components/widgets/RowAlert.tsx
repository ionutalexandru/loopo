'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface RowAlertProps {
    title: string;
    description: string;
    onDismiss?: () => void;
    className?: string;
    isVisible?: boolean;
}

export const RowAlert = ({
    title,
    description,
    onDismiss,
    className = '',
    isVisible = false,
}: RowAlertProps) => {
    const [internalIsVisible, setInternalIsVisible] = useState(isVisible);

    if (!internalIsVisible) return null;

    const handleDismiss = () => {
        setInternalIsVisible(false);
        if (onDismiss) onDismiss();
    };

    return (
        <div
            className={`bg-vibrant-coral/10 border-vibrant-coral relative flex
                w-full flex-col gap-3 rounded-3xl border p-6 transition-all
                shadow-md duration-200 ${className}`}
        >
            <div className="flex items-center justify-between">
                <h4 className="text-vibrant-coral! mb-0! font-bold">{title}</h4>
                <Button
                    variant="text"
                    icon={<X />}
                    color="secondary"
                    onClick={handleDismiss}
                />
            </div>
            <p>{description}</p>
        </div>
    );
};
