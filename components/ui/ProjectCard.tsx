import React from 'react';
import Link from 'next/link';
import { Card } from './Card';
import { ProgressBar } from './ProgressBar';

interface ProjectCardProps {
    title: string;
    currentRows: number;
    totalRows: number;
    activePart?: string;
    lastUpdated?: string;
    className?: string;
    url?: string;
}

export const ProjectCard = ({
    title,
    currentRows,
    totalRows,
    activePart = '',
    lastUpdated = '',
    url = '',
    className = '',
}: ProjectCardProps) => {
    const percentage = Math.min(
        Math.max((currentRows / totalRows) * 100, 0),
        100
    );

    const cardContent = (
        <Card
            variant="elevated"
            className={`group cursor-pointer transition-all duration-200 select-none ${className} `}
        >
            <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-base font-bold">
                        {title}
                    </span>
                    <span className="text-misty-gray text-sm">
                        {percentage}%
                    </span>
                </div>
                <ProgressBar
                    shape="linear"
                    value={currentRows}
                    max={totalRows}
                    hideStats={true}
                />
                <div className="text-misty-gray flex items-center justify-between text-xs select-none">
                    <div className="flex items-center gap-1.5">
                        {activePart && (
                            <>
                                <span className="group-hover:text-vibrant-coral font-semibold transition-colors duration-150">
                                    {activePart}
                                </span>
                                <span className="font-semibold">•</span>
                            </>
                        )}
                        <span>
                            {currentRows}/{totalRows}
                        </span>
                    </div>
                    {lastUpdated && <span>{lastUpdated}</span>}
                </div>
            </div>
        </Card>
    );

    if (url) {
        return <Link href={url}>{cardContent}</Link>;
    }

    return cardContent;
};
