import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.hoisted(() => {
    let store: Record<string, string> = {};
    const mockStorage = {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => {
            store[key] = value.toString();
        },
        removeItem: (key: string) => {
            delete store[key];
        },
        clear: () => {
            store = {};
        },
    };

    vi.stubGlobal('localStorage', mockStorage);
});

import { useProjectStore } from '../useProjectStore';
import { MOCK_PROJECTS } from '@/data/mockProjects';

describe('useProjectStore', () => {
    beforeEach(() => {
        localStorage.clear();
        useProjectStore.setState({ projects: [] });
    });

    describe('Project Management', () => {
        it('created a new project with default timestamp metadata', () => {
            const projectId = useProjectStore.getState().addProject({
                name: 'Chunky Wool Beanie',
                slug: 'chunky-wool-beanie',
                craftType: 'knit',
                userId: 'local-user',
                parts: [],
            });

            const state = useProjectStore.getState();

            expect(state.projects).toHaveLength(1);
            expect(state.projects[0].id).toBe(projectId);
            expect(state.projects[0].name).toBe('Chunky Wool Beanie');
            expect(state.projects[0].slug).toBe('chunky-wool-beanie');
            expect(state.projects[0].userId).toBe('local-user');
            expect(state.projects[0].createdAt).toBeDefined();
            expect(state.projects[0].updatedAt).toBeDefined();
        });

        it('updates an existing project', () => {
            const projectId = useProjectStore.getState().addProject({
                name: 'Original Beanie',
                slug: 'original-beanie',
                craftType: 'knit',
                userId: 'local-user',
                parts: [],
            });

            useProjectStore.getState().updateProject(projectId, {
                name: 'Updated Beanie name',
            });

            const updatedProject = useProjectStore
                .getState()
                .projects.find(({ id }) => id === projectId);

            expect(updatedProject?.name).toBe('Updated Beanie name');
            expect(updatedProject?.slug).toBe('original-beanie');
        });

        it('deletes a project', () => {
            const projectId = useProjectStore.getState().addProject({
                name: 'Temporary project',
                slug: 'temporary-project',
                craftType: 'knit',
                userId: 'local-user',
                parts: [],
            });

            expect(useProjectStore.getState().projects).toHaveLength(1);
            useProjectStore.getState().deleteProject(projectId);
            expect(useProjectStore.getState().projects).toHaveLength(0);
        });
    });

    describe('Part Operations and Row Progression', () => {
        it('increments row counters and clamps decrementing at zero', () => {
            const projectId = useProjectStore.getState().addProject({
                name: 'Merino socks',
                slug: 'merino-socks',
                userId: 'local-user',
                craftType: 'knit',
                parts: [],
            });

            const partId = useProjectStore.getState().addPart(projectId, {
                name: 'Cuff & Leg',
                slug: 'cuff-leg',
                currentRow: 0,
                totalRows: 60,
            });

            useProjectStore.getState().decrementRow(projectId, partId);
            // cannot go below 0
            expect(
                useProjectStore.getState().projects[0].parts[0].currentRow
            ).toBe(0);

            // increment
            useProjectStore.getState().incrementRow(projectId, partId);
            useProjectStore.getState().incrementRow(projectId, partId);
            expect(
                useProjectStore.getState().projects[0].parts[0].currentRow
            ).toBe(2);

            // manual assignment
            useProjectStore.getState().setRow(projectId, partId, -10);
            expect(
                useProjectStore.getState().projects[0].parts[0].currentRow
            ).toBe(0);

            useProjectStore.getState().setRow(projectId, partId, 45);
            expect(
                useProjectStore.getState().projects[0].parts[0].currentRow
            ).toBe(45);
        });

        it('allows row increments greater than the totalRows', () => {
            const projectId = useProjectStore.getState().addProject({
                name: 'Merino socks',
                slug: 'merino-socks',
                userId: 'local-user',
                craftType: 'knit',
                parts: [],
            });

            const partId = useProjectStore.getState().addPart(projectId, {
                name: 'Cuff & Leg',
                slug: 'cuff-leg',
                currentRow: 60,
                totalRows: 60,
            });

            useProjectStore.getState().incrementRow(projectId, partId);
            expect(
                useProjectStore.getState().projects[0].parts[0].currentRow
            ).toBe(61);
        });
    });

    describe('Secondary Counter Validation & Range Protection', () => {
        let projectId: string;
        let partId: string;

        beforeEach(() => {
            projectId = useProjectStore.getState().addProject({
                name: 'Lace Cardigan',
                slug: 'lace-cardigan',
                craftType: 'knit',
                parts: [],
                userId: 'local',
            });

            partId = useProjectStore.getState().addPart(projectId, {
                name: 'Front Panel',
                slug: 'front-panel',
                currentRow: 0,
            });
        });

        it('successfully adds a valid non-overlapping motif', () => {
            const result = useProjectStore
                .getState()
                .addSecondaryCounter(projectId, partId, {
                    name: 'Ribbed Edge',
                    startsOnGlobalRow: 1,
                    rowsPerRepeat: 2,
                    totalRepeats: 5, // Range: [1, 10]
                });

            expect(result.success).toBe(true);
            expect(result.error).toBeUndefined();

            const part = useProjectStore.getState().projects[0].parts[0];
            expect(part.secondaryCounters).toHaveLength(1);
        });

        it('rejects adding an overlapping secondary counter and returns a validation error', () => {
            useProjectStore.getState().addSecondaryCounter(projectId, partId, {
                name: 'Lace Pattern A',
                startsOnGlobalRow: 10,
                rowsPerRepeat: 8,
                totalRepeats: 2, // Range: [10, 25]
            });

            const overlappingResult = useProjectStore
                .getState()
                .addSecondaryCounter(projectId, partId, {
                    name: 'Conflicting Cable',
                    startsOnGlobalRow: 15,
                    rowsPerRepeat: 4,
                    totalRepeats: 2, // Range: [15, 22]
                });

            expect(overlappingResult.success).toBe(false);
            expect(overlappingResult.error).toBe(
                'The row range overlaps with an existing counter.'
            );

            const part = useProjectStore.getState().projects[0].parts[0];
            expect(part.secondaryCounters).toHaveLength(1);
        });

        it('sorts motifs chronologically by starting row', () => {
            useProjectStore.getState().addSecondaryCounter(projectId, partId, {
                name: 'Later Motif',
                startsOnGlobalRow: 40,
                rowsPerRepeat: 10,
                totalRepeats: 1,
            });

            useProjectStore.getState().addSecondaryCounter(projectId, partId, {
                name: 'Earlier Motif',
                startsOnGlobalRow: 20,
                rowsPerRepeat: 10,
                totalRepeats: 1,
            });

            const counters =
                useProjectStore.getState().projects[0].parts[0]
                    .secondaryCounters;
            expect(counters[0].startsOnGlobalRow).toBe(20);
            expect(counters[1].startsOnGlobalRow).toBe(40);
        });
    });

    describe('State seeding', () => {
        it('resets and populates the store with mock seed projects', () => {
            useProjectStore.getState().resetToMockData();

            const state = useProjectStore.getState();
            expect(state.projects).toEqual(MOCK_PROJECTS);
            expect(state.projects.length).toBeGreaterThan(0);
        });
    });
});
