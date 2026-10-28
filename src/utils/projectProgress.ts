import { Project, ProjectPart } from '@/types/project';
import { formatRelativeTime } from './date';

export interface ProjectProgressSummary {
    activePartName?: string;
    currentRows: number;
    totalRows?: number;
    isCompleted: boolean;
    url: string;
    lastUpdated?: string;
    hasParts: boolean;
}

/**
 * Calculates the completion metrics of a project and resolve the active part
 * based on the most recent `updatedAt` timestamp
 *
 * @param project - The target project
 * @returns Aggregated progress summary
 */
export function getProjectProgressSummary(
    project: Project
): ProjectProgressSummary {
    if (!project.parts || project.parts.length === 0) {
        return {
            currentRows: 0,
            totalRows: undefined,
            isCompleted: false,
            url: `/projects/${project.slug}/parts/new`,
            hasParts: false,
        };
    }

    const latestPart = project.parts.reduce((latest, current) =>
        new Date(current.updatedAt).getTime() >
        new Date(latest.updatedAt).getTime()
            ? current
            : latest
    );

    return {
        activePartName: latestPart.name,
        currentRows: latestPart.currentRows,
        totalRows: latestPart.totalRows,
        isCompleted: latestPart.totalRows
            ? latestPart.currentRows >= latestPart.totalRows
            : false,
        url: `/projects/${project.slug}/parts/${latestPart.slug}`,
        lastUpdated: formatRelativeTime(latestPart.updatedAt),
        hasParts: true,
    };
}
