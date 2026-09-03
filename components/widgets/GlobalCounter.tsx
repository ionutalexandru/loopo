'use client';

import React, { useState } from 'react';
import { Minus, Medal } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Tag } from '../ui/Tag';

interface GlobalCounterProps {
    row?: number;
    totalRows?: number;
    hintText?: string;
    completedHintText?: string;
    setRow: (val: number) => void;
    onChange?: (val: number) => void;
    className?: string;
}

export const GlobalCounter = ({
    row = 0,
    totalRows,
    hintText = '(Tap to sum a row)',
    completedHintText = 'Goal reacted!',
    setRow,
    onChange,
    className = '',
}: GlobalCounterProps) => {
    const isCompleted = totalRows ? row >= totalRows : false;

    const handleIncrement = () => {
        if (isCompleted) return;
        const nextRow = row + 1;
        setRow(nextRow);
        onChange?.(nextRow);
    };

    const handleDecrement = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (row > 0) {
            const nextRow = row - 1;
            setRow(nextRow);
            onChange?.(nextRow);
        }
    };

    return (
        <Card
            variant="elevated"
            onClick={handleIncrement}
            className={`group active:bg-wool/30 relative flex max-w-88!
                cursor-pointer flex-col items-center justify-between gap-3
                transition-all duration-150 select-none active:scale-[0.99]
                ${isCompleted ? 'border-vibrant-coral/40 bg-deep-coral/10' : ''}
                ${className}`}
        >
            <div className="relative flex w-full items-center justify-center">
                <div className="absolute left-0 flex items-center">
                    {isCompleted && (
                        <Tag
                            variant="highlight"
                            className="animate-fade-in"
                            label="Done"
                            icon={<Medal />}
                        />
                    )}
                </div>
                <span className="text-center font-bold">Global counter</span>
                <div className="absolute right-0 flex items-center">
                    <Button
                        variant="squared"
                        color="secondary"
                        icon={<Minus />}
                        aria-label="Subtract row"
                        onClick={handleDecrement}
                    />
                </div>
            </div>
            <div className="flex flex-col items-center justify-center">
                <span
                    className={`font-inter text-5xl font-bold tracking-tight
                        sm:text-7xl ${isCompleted && 'text-vibrant-coral'}`}
                >
                    {row}
                </span>
                <span
                    className="font-inter text-misty-gray mt-2 text-xs
                        font-medium"
                >
                    {totalRows}
                </span>
            </div>
            <div className="flex w-full flex-col items-center gap-1">
                <span
                    className={`text-misty-gray group-hover:text-vibrant-coral
                        group-active:text-vibrant-color text-xs
                        ${isCompleted && 'text-vibrant-coral font-bold'}`}
                >
                    {isCompleted ? completedHintText : hintText}
                </span>
                <ProgressBar value={row} max={totalRows} hideStats={true} />
            </div>
        </Card>
    );
};

type DemoGlobalCounterProps = Omit<GlobalCounterProps, 'row' | 'setRow'> & {
    initialRow?: number;
};

export const DemoGlobalCounter = ({
    initialRow = 0,
    ...props
}: DemoGlobalCounterProps) => {
    const [row, setRow] = useState<number>(initialRow);
    return <GlobalCounter row={row} setRow={setRow} {...props} />;
};
