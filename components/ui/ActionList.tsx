'use client';

import Link from 'next/link';
import { Card } from './Card';
import { ChevronRight } from 'lucide-react';

export interface ActionListItem {
    id?: string;
    label: string;
    href?: string;
    onClick?: (e: React.MouseEvent) => void;
    disabled?: boolean;
}

export interface ActionListProps {
    title?: string;
    items: ActionListItem[];
    className?: string;
}

export const ActionList = ({
    title = 'Additional actions',
    items,
    className = '',
}: ActionListProps) => {
    if (!items || items.length === 0) return null;

    const rowStyles = `group flex w-full cursor-pointer items-center justify-between py-4 text-left text-sm font-bold hover:text-vibrant-coral disabled:cursor-not-allowed disabled:opacity-40 select-none`;

    return (
        <Card variant="elevated" className={`flex flex-col gap-6 ${className}`}>
            {title && <h4 className="text-misty-gray! mb-0!">{title}</h4>}
            <div className="divide-chalk-gray flex flex-col divide-y">
                {items.map((item, index) => {
                    const content = (
                        <>
                            {item.label}
                            <ChevronRight />
                        </>
                    );

                    if (item.href && !item.disabled) {
                        return (
                            <Link
                                key={item.id ?? `${item.label}-${index}`}
                                href={item.href}
                                onClick={item.onClick}
                                className={rowStyles}
                            >
                                {content}
                            </Link>
                        );
                    }

                    return (
                        <button
                            key={item.id ?? `${item.label}-${index}`}
                            type="button"
                            disabled={item.disabled}
                            onClick={item.onClick}
                            className={rowStyles}
                        >
                            {content}
                        </button>
                    );
                })}
            </div>
        </Card>
    );
};
