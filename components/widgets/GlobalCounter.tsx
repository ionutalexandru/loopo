'use client';

// TODO fix useState for preview in styleguide

import React, { useState } from 'react';
import { Minus, Medal } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Tag } from '../ui/Tag';

interface GlobalCounterProps {
    currentRow?: number;
    totalRows?: number;
    hintText?: string;
    completedHintText?: string;
    onChange?: (val: number) => void;
    className?: string;
}

export const GlobalCounter = ({
    currentRow = 0,
    totalRows,
    hintText = '(Tap to sum a row)',
    completedHintText = 'Goal reacted!',
    onChange,
    className = '',
}: GlobalCounterProps) => {
    // const [row, setRow] = useState(currentRow);
    const isCompleted = totalRows ? currentRow >= totalRows : false;

    const handleIncrement = () => {
        if (isCompleted) return;
        const nextRow = currentRow + 1;
        // setRow(nextRow);
        if (onChange) onChange(nextRow);
    };

    const handleDecrement = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (currentRow > 0) {
            const nextRow = currentRow - 1;
            // setRow(nextRow);
            if (onChange) onChange(nextRow);
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
                <span className="text-center font-bold">Current Row</span>
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
                    {currentRow}
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
                <ProgressBar
                    value={currentRow}
                    max={totalRows}
                    hideStats={true}
                />
            </div>
        </Card>
    );
};
