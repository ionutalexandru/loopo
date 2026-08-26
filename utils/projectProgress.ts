import { Project, ProjectPart } from '@/types/project';
import { formatRelativeTime } from './date';

export interface ProjectProgressSummary {
    activePartName?: string;
    currentRow: number;
    totalRows?: number;
    isCompleted: boolean;
    url: string;
    lastUpdated?: string;
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
    if (!project.parts) {
        return {
            currentRow: 0,
            totalRows: undefined,
            isCompleted: false,
            url: `/projects/${project.slug}/parts/new`,
            lastUpdated: '',
        };
    }

    const { name, currentRow, totalRows, slug, updatedAt }: ProjectPart =
        project.parts.reduce((latest, current) => {
            const latestTime = new Date(latest.updatedAt || 0).getTime();
            const currentTime = new Date(current.updatedAt || 0).getTime();

            return currentTime > latestTime ? current : latest;
        }, project.parts[0]);

    return {
        activePartName: name,
        currentRow: currentRow,
        totalRows: totalRows,
        isCompleted: totalRows ? currentRow >= totalRows : false,
        url: `/projects/${project.slug}/parts/${slug}`,
        lastUpdated: formatRelativeTime(updatedAt),
    };
}
