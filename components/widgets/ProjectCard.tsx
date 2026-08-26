import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';

interface ProjectCardProps {
    title: string;
    currentRow: number;
    totalRows?: number;
    activePart?: string;
    lastUpdated?: string;
    className?: string;
    url?: string;
}

export const ProjectCard = ({
    title,
    currentRow,
    totalRows = undefined,
    activePart = '',
    lastUpdated = '',
    url = '',
    className = '',
}: ProjectCardProps) => {
    const percentage = totalRows
        ? Math.round(Math.min(Math.max((currentRow / totalRows) * 100, 0), 100))
        : 0;

    const cardContent = (
        <Card
            variant="elevated"
            className={`group cursor-pointer transition-all duration-200
                select-none ${className} `}
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
                    value={currentRow}
                    max={totalRows}
                    hideStats={true}
                />
                <div
                    className="text-misty-gray flex items-center justify-between
                        text-xs select-none"
                >
                    <div className="flex items-center gap-1.5">
                        {activePart && (
                            <>
                                <span
                                    className="group-hover:text-vibrant-coral
                                        font-semibold transition-colors
                                        duration-150"
                                >
                                    {activePart}
                                </span>
                                <span className="font-semibold">•</span>
                            </>
                        )}
                        <span>
                            {currentRow}/{totalRows ? totalRows : 0}
                        </span>
                    </div>
                    {lastUpdated && <span>{lastUpdated}</span>}
                </div>
            </div>
        </Card>
    );

    if (url) {
        return (
            <Link href={url} className="w-full">
                {cardContent}
            </Link>
        );
    }

    return cardContent;
};
