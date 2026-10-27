import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
    Project,
    ProjectPart,
    ProjectStatus,
    SecondaryCounter,
} from '@/types/project';
import { hasCounterOverlap } from '@/utils/counter';
import { MOCK_PROJECTS } from '@/data/mockProjects';
import { generateUniqueSlug } from '@/utils/slugify';
import { indexedDbStorage } from './indexedDbStorage';

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
        project: Omit<
            Project,
            'id' | 'status' | 'createdAt' | 'updatedAt' | 'isDirty'
        > & {
            status?: ProjectStatus;
        }
    ) => string;
    // Update top-level project metadata
    updateProject: (projectId: string, data: Partial<Project>) => string;
    // Deletes an entire project and its cascading entities
    deleteProject: (projectId: string) => void;
    setProjectStatus: (projectId: string, status: ProjectStatus) => void;

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
    // Duplicate a part from a project, counter set to 0
    duplicatePart: (projectId: string, partId: string) => void | string;

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
        data: Partial<
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
    // Adopt local projects with new user (remote) id
    adoptLocalProject: (newUserId: string) => void;
}

export const useProjectStore = create<ProjectState>()(
    persist(
        (set, get) => ({
            projects: MOCK_PROJECTS,
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
                    status: data.status ?? 'active',
                    isDirty: true,
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
                                  isDirty: true,
                              }
                            : p
                    ),
                }));

                return projectId;
            },

            deleteProject: (projectId) => {
                const now = new Date().toISOString();
                set((state) => ({
                    projects: state.projects.map((p) =>
                        p.id === projectId
                            ? {
                                  ...p,
                                  deletedAt: now,
                                  updatedAt: now,
                                  isDirty: true,
                              }
                            : p
                    ),
                }));
            },

            setProjectStatus: (projectId, status) => {
                set((state) => ({
                    projects: state.projects.map((p) =>
                        p.id === projectId
                            ? {
                                  ...p,
                                  status,
                                  updatedAt: new Date().toISOString(),
                                  isDirty: true,
                              }
                            : p
                    ),
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
                                isDirty: true,
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
                                isDirty: true,
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
                        const now = new Date().toISOString();
                        return {
                            ...project,
                            updatedAt: now,
                            isDirty: true,
                            parts: project.parts.map((p) =>
                                p.id === partId
                                    ? {
                                          ...p,
                                          deletedAt: now,
                                          updatedAt: now,
                                      }
                                    : p
                            ),
                        };
                    }),
                })),

            duplicatePart: (projectId, partId) => {
                const project = get().projects.find(
                    ({ id }) => id === projectId
                );
                const sourcePart = project?.parts.find(
                    ({ id }) => id === partId
                );

                if (!project || !sourcePart) return undefined;

                const now = new Date().toISOString();
                const newPartId = crypto.randomUUID();
                const baseName = `${sourcePart.name} (Copy)`;
                const newSlug = generateUniqueSlug(
                    baseName,
                    project.parts.map(({ slug }) => slug)
                );

                const clonedCounters: SecondaryCounter[] =
                    sourcePart.secondaryCounters.map((counter) => ({
                        ...counter,
                        id: crypto.randomUUID(),
                        partId: newPartId,
                        createdAt: now,
                        updatedAt: now,
                    }));

                const newPart: ProjectPart = {
                    ...sourcePart,
                    id: newPartId,
                    projectId,
                    name: baseName,
                    slug: newSlug,
                    currentRows: 0,
                    secondaryCounters: clonedCounters,
                    createdAt: now,
                    updatedAt: now,
                };

                set((state) => ({
                    projects: state.projects.map((p) => {
                        if (p.id !== projectId) return p;
                        return {
                            ...p,
                            updatedAt: now,
                            isDirty: true,
                            parts: [...p.parts, newPart],
                        };
                    }),
                }));

                return newSlug;
            },

            // -- ROW ACTIONS --
            incrementRow: (projectId, partId) => {
                set((state) => ({
                    projects: state.projects.map((project) => {
                        if (project.id !== projectId) return project;
                        const now = new Date().toISOString();
                        return {
                            ...project,
                            updatedAt: now,
                            isDirty: true,
                            parts: project.parts.map((part) => {
                                const currentRows = part.currentRows + 1;
                                return part.id === partId
                                    ? {
                                          ...part,
                                          currentRows,
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
                            isDirty: true,
                            parts: project.parts.map((part) => {
                                return part.id === partId &&
                                    part.currentRows > 0
                                    ? {
                                          ...part,
                                          currentRows: part.currentRows - 1,
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
                            isDirty: true,
                            parts: project.parts.map((part) => {
                                return part.id === partId
                                    ? {
                                          ...part,
                                          currentRows: Math.max(rowNumber, 0),
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
                            isDirty: true,
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
                            isDirty: true,
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
                                isDirty: true,
                                parts: project.parts.map((part) => {
                                    if (part.id !== partId) return part;
                                    return {
                                        ...part,
                                        updatedAt: now,
                                        secondaryCounters:
                                            part.secondaryCounters.map((c) =>
                                                c.id === counterId
                                                    ? {
                                                          ...c,
                                                          deletedAt: now,
                                                          updatedAt: now,
                                                      }
                                                    : c
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
            adoptLocalProject: (newUserId: string) => {
                const now = new Date().toISOString();
                set((state) => ({
                    projects: state.projects.map((project) =>
                        project.userId === 'local-user' || !project.userId
                            ? {
                                  ...project,
                                  userId: newUserId,
                                  updatedAt: now,
                                  isDirty: true,
                                  parts: project.parts.map((part) => ({
                                      ...part,
                                      userId: newUserId,
                                      updatedAt: now,
                                      secondaryCounters:
                                          part.secondaryCounters.map(
                                              (counter) => ({
                                                  ...counter,
                                                  userId: newUserId,
                                                  updatedAt: now,
                                              })
                                          ),
                                  })),
                              }
                            : project
                    ),
                }));
            },
        }),
        {
            name: 'loopo-projects-storage',
            storage: createJSONStorage(() => indexedDbStorage),
            merge: (persistedState: any, currentState: ProjectState) => {
                /**
                 * Merge data retrieved from IndexedDB with the initial store data
                
                - persistedState represents the actual data saved by user in the IndexedDB. If it's
                    the first time, it'll be undefined or null.
                - currentState represents the default fallback state defined inside the Zustand store. It
                    includes store's methods and the initial projects (MOCK_DATA).

                Then, if IndexedDB containes a saved state, we prioritize it over the defaults.
                */
                if (
                    persistedState &&
                    typeof persistedState === 'object' &&
                    Array.isArray(persistedState.projects)
                ) {
                    return { ...currentState, ...persistedState };
                }

                // Fallback to initial store state on first app launch.
                return currentState;
            },
        }
    )
);
