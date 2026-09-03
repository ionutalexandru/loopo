'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MoreVertical, Minus, Icon } from 'lucide-react';
import { yarnBall } from '@lucide/lab';
import { Card } from '@/components/ui/Card';
import { Button, ButtonProps } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Tag } from '@/components/ui/Tag';

export interface SecondaryCounterProps {
    title: string;
    row?: number;
    totalRows: number;
    absoluteTotalRows: number;
    tagLabel?: string;
    settingsHref?: string;
    openSenttings?: () => void;
    onIncrement: () => void;
    onDecrement: () => void;
    className?: string;
    isInactive?: boolean;
}

export const SecondaryCounter = ({
    title,
    row = 0,
    totalRows,
    absoluteTotalRows,
    tagLabel = '',
    settingsHref = '',
    openSenttings,
    onIncrement,
    onDecrement,
    className = '',
    isInactive = false,
}: SecondaryCounterProps) => {
    const isCompleted = row >= absoluteTotalRows;

    const handleIncrement = () => {
        if (isCompleted || isInactive) return;
        onIncrement();
    };

    const handleDecrement = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (row > 0 && !isInactive) {
            onDecrement();
        }
    };

    const renderSettingsButton = () => {
        const buttonProps: ButtonProps = {
            icon: <MoreVertical />,
            variant: 'squared',
            color: 'secondary',
            size: 'small',
            'aria-label': `Open ${title} Secondary counter Settings panel`,
        };

        if (settingsHref) {
            return (
                <Link
                    href={settingsHref}
                    onClick={(e) => e.stopPropagation()}
                    scroll={false}
                >
                    <Button {...buttonProps} />
                </Link>
            );
        }

        return (
            <Button
                onClick={(e) => {
                    e.stopPropagation();
                    openSenttings?.();
                }}
                {...buttonProps}
            />
        );
    };

    return (
        <Card
            variant="elevated"
            onClick={handleIncrement}
            className={`group active:bg-wool/30 relative flex max-w-42! py-2.5!
                px-4! cursor-pointer flex-col items-center justify-between gap-3
                transition-all duration-150 select-none active:scale-[0.99]
                ${isCompleted || isInactive ? 'bg-chalk-gray/30! shadow-none!' : ''}
                ${className}`}
        >
            <div className="font-semibold text-center">{title}</div>
            <div className="flex flex-col gap-1.5 items-center">
                <ProgressBar
                    shape="circular"
                    value={row}
                    max={totalRows}
                    className="w-20"
                    disabled={isCompleted || isInactive}
                />
                {tagLabel && (
                    <Tag icon={<Icon iconNode={yarnBall} />} label={tagLabel} />
                )}
            </div>
            <div className="flex w-full justify-between">
                {renderSettingsButton()}
                <Button
                    icon={<Minus />}
                    variant="squared"
                    color="secondary"
                    size="small"
                    aria-label={`Subract one row to ${title} Secondary counter`}
                    onClick={handleDecrement}
                />
            </div>
        </Card>
    );
};

type DemoSecondaryCounterProps = Omit<
    SecondaryCounterProps,
    'row' | 'onIncrement' | 'onDecrement'
> & { initialRow?: number };

export const DemoSecondaryCounter = ({
    initialRow = 0,
    ...props
}: DemoSecondaryCounterProps) => {
    const [row, setRow] = useState<number>(initialRow);
    return (
        <SecondaryCounter
            row={row}
            onIncrement={() => setRow((prev) => ++prev)}
            onDecrement={() => setRow((prev) => --prev)}
            {...props}
        />
    );
};
