import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Project, ProjectPart, SecondaryCounter } from '@/types/project';
import { hasCounterOverlap } from '@/utils/counter';
import { MOCK_PROJECTS } from '@/data/mockProjects';

export interface CounterMutationResult {
    success: boolean;
    error?: string;
}

interface ProjectState {
    // global list of all stored projects
    projects: Project[];

    // -- PROJECT CRUD ACTIONS --
    // Create a new project and returns its generated UUID
    addProject: (
        project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>
    ) => string;
    // Update top-level project metadata
    updateProject: (projectId: string, data: Partial<ProjectPart>) => string;
    // Deletes an entire project and its cascading entities
    deleteProject: (projectId: string) => void;

    // -- PROJECT PART CRUD ACTIONS --
    // Add a new part to a project
    addPart: (
        projectId: string,
        part: Omit<
            ProjectPart,
            'id' | 'projectId' | 'createdAt' | 'updatedAt' | 'secondaryCounters'
        >
    ) => string;
    // Updates details of a specific part
    updatePart: (
        projectId: string,
        partId: string,
        data: Partial<
            Omit<
                ProjectPart,
                | 'id'
                | 'projectId'
                | 'createdAt'
                | 'updatedAt'
                | 'secondaryCounters'
            >
        >
    ) => void;
    // Deletes a part from a project
    deletePart: (projectId: string, partId: string) => void;

    // -- ROW TRACKING CRUD ACTIONS --
    // Increments current row of a part by 1
    incrementRow: (projectId: string, partId: string) => void;
    // Decrements the current row of a part by 1 (cannot go below 0)
    decrementRow: (projectId: string, partId: string) => void;
    // Explicitly overrides the current row of a part
    setRow: (projectId: string, partId: string, rowNumber: number) => void;

    // -- SECONDARY COUNTER CRUD ACTIONS --
    // Adds a secondary copunter with validation against row range overlaps
    addSecondaryCounter: (
        projectId: string,
        partId: string,
        counter: Omit<
            SecondaryCounter,
            'id' | 'partId' | 'createdAt' | 'updatedAt'
        >
    ) => CounterMutationResult;
    // Updates a secondary counter ensuring updated values do not overlap existing
    updatedSecondaryCounter: (
        projectId: string,
        partId: string,
        counterId: string,
        counter: Partial<
            Omit<SecondaryCounter, 'id' | 'partId' | 'createdAt' | 'updatedAt'>
        >
    ) => CounterMutationResult;
    // Removes a secondary counter from a part
    deleteSecondaryCounter: (
        projectId: string,
        partId: string,
        counterId: string
    ) => void;
    resetToMockData: () => void;
}

export const useProjectStore = create<ProjectState>()(
    persist(
        (set, get) => ({
            projects: [],
            // --  PROJECT ACTIONS --
            addProject: (projectData) => {
                const id = crypto.randomUUID();
                const now = new Date().toISOString();

                const { userId = 'local-user', ...data } = projectData;

                const project: Project = {
                    userId,
                    ...data,
                    id,
                    createdAt: now,
                    updatedAt: now,
                };

                set((state) => ({
                    projects: [...state.projects, project],
                }));

                return id;
            },

            updateProject: (projectId, data) => {
                set((state) => ({
                    projects: state.projects.map((p) =>
                        p.id === projectId
                            ? {
                                  ...p,
                                  ...data,
                                  updatedAt: new Date().toISOString(),
                              }
                            : p
                    ),
                }));

                return projectId;
            },

            deleteProject: (projectId) => {
                set((state) => ({
                    projects: state.projects.filter((p) => p.id !== projectId),
                }));
            },

            // -- PART ACTIONS --
            addPart: (projectId, data) => {
                const partId = crypto.randomUUID();
                set((state) => {
                    const now = new Date().toISOString();
                    const newPart: ProjectPart = {
                        ...data,
                        id: partId,
                        projectId,
                        secondaryCounters: [],
                        createdAt: now,
                        updatedAt: now,
                    };

                    return {
                        projects: state.projects.map((project) => {
                            if (project.id !== projectId) return project;
                            return {
                                ...project,
                                updatedAt: now,
                                parts: [...project.parts, newPart],
                            };
                        }),
                    };
                });
                return partId;
            },

            updatePart: (projectId, partId, data) =>
                set((state) => {
                    const now = new Date().toISOString();
                    return {
                        projects: state.projects.map((project) => {
                            if (project.id !== projectId) return project;
                            return {
                                ...project,
                                updatedAt: now,
                                parts: project.parts.map((part) =>
                                    part.id === partId
                                        ? { ...part, ...data, updatedAt: now }
                                        : part
                                ),
                            };
                        }),
                    };
                }),

            deletePart: (projectId, partId) =>
                set((state) => ({
                    projects: state.projects.map((project) => {
                        if (project.id !== projectId) return project;
                        return {
                            ...project,
                            updatedAt: new Date().toISOString(),
                            parts: project.parts.filter(
                                ({ id }) => id !== partId
                            ),
                        };
                    }),
                })),

            // -- ROW ACTIONS --
            incrementRow: (projectId, partId) => {
                set((state) => ({
                    projects: state.projects.map((project) => {
                        if (project.id !== projectId) return project;
                        const now = new Date().toISOString();
                        return {
                            ...project,
                            updatedAt: now,
                            parts: project.parts.map((part) => {
                                const currentRow = part.currentRow + 1;
                                return part.id === partId
                                    ? {
                                          ...part,
                                          currentRow,
                                          updatedAt: now,
                                      }
                                    : part;
                            }),
                        };
                    }),
                }));
            },
            decrementRow: (projectId, partId) => {
                set((state) => ({
                    projects: state.projects.map((project) => {
                        if (project.id !== projectId) return project;
                        const now = new Date().toISOString();
                        return {
                            ...project,
                            updatedAt: now,
                            parts: project.parts.map((part) => {
                                return part.id === partId && part.currentRow > 0
                                    ? {
                                          ...part,
                                          currentRow: part.currentRow - 1,
                                          updatedAt: now,
                                      }
                                    : part;
                            }),
                        };
                    }),
                }));
            },
            setRow: (projectId, partId, rowNumber) => {
                set((state) => ({
                    projects: state.projects.map((project) => {
                        if (project.id !== projectId) return project;
                        const now = new Date().toISOString();
                        return {
                            ...project,
                            updatedAt: now,
                            parts: project.parts.map((part) => {
                                return part.id === partId
                                    ? {
                                          ...part,
                                          currentRow: Math.max(rowNumber, 0),
                                          updatedAt: now,
                                      }
                                    : part;
                            }),
                        };
                    }),
                }));
            },

            // -- SECONDARY COUNTER ACTIONS --
            addSecondaryCounter: (projectId, partId, data) => {
                const project = get().projects.find((p) => p.id === projectId);
                const part = project?.parts.find((p) => p.id === partId);

                if (!part)
                    return {
                        success: false,
                        error: 'Target project part not found.',
                    };
                if (hasCounterOverlap(part.secondaryCounters, data)) {
                    return {
                        success: false,
                        error: 'The row range overlaps with an existing counter.',
                    };
                }

                const counterId = crypto.randomUUID();
                const now = new Date().toISOString();

                const newCounter: SecondaryCounter = {
                    ...data,
                    id: counterId,
                    createdAt: now,
                    updatedAt: now,
                    partId,
                };

                set((state) => ({
                    projects: state.projects.map((proj) => {
                        if (proj.id !== projectId) return proj;
                        return {
                            ...proj,
                            updatedAt: now,
                            parts: proj.parts.map((p) => {
                                if (p.id !== partId) return p;
                                return {
                                    ...p,
                                    updatedAt: now,
                                    secondaryCounters: [
                                        ...p.secondaryCounters,
                                        newCounter,
                                    ].sort(
                                        (a, b) =>
                                            a.startsOnGlobalRow -
                                            b.startsOnGlobalRow
                                    ),
                                };
                            }),
                        };
                    }),
                }));

                return { success: true };
            },
            updatedSecondaryCounter: (projectId, partId, counterId, data) => {
                const project = get().projects.find((p) => p.id === projectId);
                const part = project?.parts.find((p) => p.id === partId);
                const counter = part?.secondaryCounters.find(
                    (c) => c.id === counterId
                );

                if (!part || !counter)
                    return {
                        success: false,
                        error: 'Secondary counter not found.',
                    };

                const updatedCounter = { ...counter, ...data };

                if (
                    hasCounterOverlap(
                        part.secondaryCounters,
                        updatedCounter,
                        counterId
                    )
                ) {
                    return {
                        success: false,
                        error: 'Updated values overlap with another existing counter.',
                    };
                }

                const now = new Date().toISOString();

                set((state) => ({
                    projects: state.projects.map((proj) => {
                        if (proj.id !== projectId) return proj;

                        return {
                            ...proj,
                            updatedAt: now,
                            parts: proj.parts.map((p) => {
                                if (p.id !== partId) return p;
                                return {
                                    ...p,
                                    updatedAt: now,
                                    secondaryCounters: p.secondaryCounters
                                        .map((c) => {
                                            if (c.id !== counterId) return c;
                                            return {
                                                ...updatedCounter,
                                                updatedAt: now,
                                            };
                                        })
                                        .sort(
                                            (a, b) =>
                                                a.startsOnGlobalRow -
                                                b.startsOnGlobalRow
                                        ),
                                };
                            }),
                        };
                    }),
                }));

                return { success: true };
            },
            deleteSecondaryCounter: (projectId, partId, counterId) => {
                set((state) => {
                    const now = new Date().toISOString();
                    return {
                        projects: state.projects.map((project) => {
                            if (project.id !== projectId) return project;

                            return {
                                ...project,
                                updatedAt: now,
                                parts: project.parts.map((part) => {
                                    if (part.id !== partId) return part;
                                    return {
                                        ...part,
                                        updatedAt: now,
                                        SecondaryCounters:
                                            part.secondaryCounters.filter(
                                                (c) => c.id !== counterId
                                            ),
                                    };
                                }),
                            };
                        }),
                    };
                });
            },
            resetToMockData: () => {
                set({ projects: MOCK_PROJECTS });
            },
        }),
        {
            name: 'loopo-projects-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
