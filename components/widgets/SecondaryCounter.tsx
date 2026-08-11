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
    initialRow?: number;
    totalRows: number;
    tagLabel?: string;
    settingsHref?: string;
    openSenttings?: () => void;
    onChange?: (val: number) => void;
    className?: string;
}

export const SecondaryCounter = ({
    title,
    initialRow = 0,
    totalRows,
    tagLabel = '',
    settingsHref = '',
    openSenttings,
    onChange,
    className = '',
}: SecondaryCounterProps) => {
    const [row, setRow] = useState(initialRow);
    const isCompleted = row >= totalRows;

    const handleIncrement = () => {
        if (isCompleted) return;
        const nextRow = row + 1;
        setRow(nextRow);
        if (onChange) onChange(nextRow);
    };

    const handleDecrement = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (row > 0) {
            const nextRow = row - 1;
            setRow(nextRow);
            if (onChange) onChange(nextRow);
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
                    if (openSenttings) openSenttings();
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
                ${isCompleted ? 'bg-chalk-gray!' : ''} ${className}`}
        >
            <div className="font-semibold">{title}</div>
            <div className="flex flex-col gap-1.5 items-center">
                <ProgressBar
                    shape="circular"
                    value={row}
                    max={totalRows}
                    className="w-20"
                    disabled={isCompleted}
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
