import { Project, ProjectPart } from '@/types/project';
import { formatRelativeTime } from './date';

export interface ProjectProgressSummary {
    activePartName?: string;
    currentRow: number;
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
            currentRow: 0,
            totalRows: undefined,
            isCompleted: false,
            url: `/projects/${project.slug}/parts/new`,
            hasParts: false,
        };
    }

    const { name, currentRow, totalRows, slug, updatedAt }: ProjectPart =
        project.parts.sort(
            (a: ProjectPart, b: ProjectPart): number =>
                new Date(b.updatedAt).getTime() -
                new Date(a.updatedAt).getTime()
        )[0];

    return {
        activePartName: name,
        currentRow: currentRow,
        totalRows: totalRows,
        isCompleted: totalRows ? currentRow >= totalRows : false,
        url: `/projects/${project.slug}/parts/${slug}`,
        lastUpdated: formatRelativeTime(updatedAt),
        hasParts: true,
    };
}
