import {
    getActiveSecondaryCounter,
    getSecondaryCounterProgress,
    SecondaryCounterProgress,
} from '@/utils/counter';
import { useProjectStore } from './useProjectStore';
import { Project, ProjectPart, SecondaryCounter } from '@/types/project';

/**
 *
 * @param slug - project's slug to find.
 * @returns - Project object or undefined.
 */
export const useProjectBySlug = (slug: string): Project | undefined => {
    return useProjectStore((state) =>
        state.projects.find((project) => project.slug === slug)
    );
};

/**
 *
 * @param projectSlug - project's slug to find.
 * @param partSlug - project part's slug to find.
 * @returns - Project object or undefined, and ProjectPart object or undefined
 */

export const useProjectPartBySlug = (
    projectSlug: string,
    partSlug: string
): { project?: Project; part?: ProjectPart } => {
    return useProjectStore((state) => {
        const project = state.projects.find(({ slug }) => slug === projectSlug);
        const part = project?.parts.find(({ slug }) => slug === partSlug);
        return { project, part };
    });
};

/**
 *
 * @param projectId - Id of the project to find.
 * @param partId - Id of the part to find.
 * @returns SecondaryCounter object or undefined, and SecondaryCounterProgress or undefined
 */
export const useActiveSecondaryCounterState = (
    projectId: string,
    partId: string
): {
    activeCounter?: SecondaryCounter;
    progress?: SecondaryCounterProgress;
} => {
    return useProjectStore((store) => {
        const project = store.projects.find(({ id }) => id === projectId);
        const part = project?.parts.find(({ id }) => id === partId);

        if (!part) return {};

        const activeCounter = getActiveSecondaryCounter(
            part.secondaryCounters,
            part.currentRow
        );

        const progress = activeCounter
            ? getSecondaryCounterProgress(activeCounter, part.currentRow)
            : undefined;

        return { activeCounter, progress };
    });
};
