'use client';

import React, { useEffect, useCallback } from 'react';
import { X } from 'lucide-react';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    subtitle?: string;
    children?: React.ReactNode;
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
    closeOnBackdropClick?: boolean;
    showCloseButton?: boolean;
    className?: string;
}

const MAX_WIDTH_CLASSES = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-3xl',
    full: 'max-w-full',
};

export const Modal = ({
    isOpen,
    onClose,
    title,
    subtitle,
    children,
    maxWidth = 'md',
    closeOnBackdropClick = true,
    showCloseButton = true,
    className = '',
}: ModalProps) => {
    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        },
        [onClose]
    );

    useEffect(() => {
        if (!isOpen) return;

        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.overflow = 'unset';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, handleKeyDown]);

    if (!isOpen) return null;

    return (
        <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 backdrop-blur-sm overflow-scroll
                overscroll-contain px-4 flex items-center justify-center"
            onClick={(e) => {
                if (closeOnBackdropClick && e.target === e.currentTarget) {
                    onClose();
                }
            }}
        >
            <Card
                variant="elevated"
                className={`${MAX_WIDTH_CLASSES[maxWidth]} gap-5 hover:shadow-md
                    ${className}`}
            >
                {(title || showCloseButton) && (
                    <div className="w-full flex justify-between items-center">
                        {title && (
                            <h3
                                className="uppercase text-misty-gray! text-base!
                                    mb-0!"
                            >
                                {title}
                            </h3>
                        )}
                        {showCloseButton && (
                            <Button
                                variant="text"
                                color="secondary"
                                onClick={onClose}
                                icon={<X />}
                            />
                        )}
                    </div>
                )}
                {subtitle && <h4 className="text-sm!">{subtitle}</h4>}
                <div className="w-full">{children}</div>
            </Card>
        </div>
    );
};
