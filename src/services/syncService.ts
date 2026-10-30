import { supabase } from '@/lib/supabase';
import { useProjectStore } from '@/store/useProjectStore';
import { Project, ProjectPart, SecondaryCounter } from '@/types/project';
import { fetchWithTimeout } from '@/utils/fetch';

/**
 * Push sync: Atomically pushes all locally modified ("dirty") projects,
 * parts, and secondary counters to Supabase
 *
 * @param {string} userId - The active authenticated user ID.
 * @returns {Promise<void>}
 */
export const syncLocalToCloud = async (userId: string): Promise<void> => {
    // Abort if the browser is currently offline
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
        console.log('[Sync] Offline status detected. Skipping cloud push.');
        return;
    }

    const projectStore = useProjectStore.getState();

    if (projectStore.isSyncing) {
        // avoid making another call if the sync process is undergoing
        return;
    }

    try {
        projectStore.setIsSyncing(true);
        // Filter projects by userId and marked as modified
        const dirtyProjects = useProjectStore
            .getState()
            .projects.filter(
                (project) => project.userId === userId && project.isDirty
            );

        if (!dirtyProjects) {
            console.log('[Sync] No local modifications to push.');
            return;
        }

        console.log(
            `[Sync] Initiating atomic bulk push for ${dirtyProjects.length}...`
        );

        const projectsPayload: any[] = [];
        const partsPayload: any[] = [];
        const countersPayload: any[] = [];

        for (const project of dirtyProjects) {
            projectsPayload.push({
                id: project.id,
                name: project.name,
                slug: project.slug,
                status: project.status,
                craftType: project.craftType,
                patternName: project.patternName,
                notes: project.notes,
                createdAt: project.createdAt,
                updatedAt: project.updatedAt,
                deletedAt: project.deletedAt ?? null,
            });

            if (project.parts) {
                for (const part of project.parts) {
                    partsPayload.push({
                        id: part.id,
                        projectId: project.id,
                        name: part.name,
                        slug: part.slug,
                        currentRows: part.currentRows ?? 0,
                        totalRows: part.totalRows,
                        needleSize: part.needleSize,
                        yarnDetails: part.yarnDetails,
                        notes: part.notes,
                        createdAt: part.createdAt,
                        updatedAt: part.updatedAt,
                        deletedAt: part.deletedAt ?? null,
                    });

                    if (part.secondaryCounters) {
                        for (const counter of part.secondaryCounters) {
                            countersPayload.push({
                                id: counter.id,
                                partId: part.id,
                                name: counter.name,
                                startsOnGlobalRow: counter.startsOnGlobalRow,
                                rowsPerRepeat: counter.rowsPerRepeat,
                                totalRepeats: counter.totalRepeats,
                                notes: counter.notes,
                                createdAt: counter.createdAt,
                                updatedAt: counter.updatedAt,
                                deletedAt: counter.deletedAt,
                            });
                        }
                    }
                }
            }
        }

        const { error } = await fetchWithTimeout(
            supabase.rpc('sync_user_projects', {
                p_user_id: userId,
                p_payload: {
                    projects: projectsPayload,
                    parts: partsPayload,
                    secondary_counters: countersPayload,
                },
            })
        );

        if (error) throw error;

        // Mark local records as clean after successful server confirmation
        useProjectStore
            .getState()
            .markProjectsAsClean(dirtyProjects.map(({ id }) => id));
        console.log('[Sync] Atomic cloud push completed suzzessfully.');
        projectStore.setLastSyncedAt(new Date().toISOString());
    } catch (err) {
        console.error(`[Sync] Atomic push failed: ${err}`);
        throw err;
    } finally {
        projectStore.setIsSyncing(false);
    }
};

/**
 * Pull Sync: Fetches remote project
 *
 * @param {string} userId - The active authenticated user ID.
 * @returns {Promise<void>}
 */
export const syncCloudToLocal = async (userId: string): Promise<void> => {
    // Abort if the browser is currently offline
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
        console.log('[Sync] Offline status detected. Skipping cloud pull.');
        return;
    }

    const projectStore = useProjectStore.getState();

    if (projectStore.isSyncing) {
        // avoid making another call if the sync process is undergoing
        return;
    }

    try {
        projectStore.setIsSyncing(true);
        console.log('[Sync] Fetching remote state from Supabase...');

        const { data: remoteProjectsData, error } = await fetchWithTimeout(
            supabase
                .from('projects')
                .select(
                    `
                *,
                project_parts (
                    *,
                    secondary_counters (*)
                )
            `
                )
                .eq('user_id', userId)
        );

        if (error) throw error;

        if (!remoteProjectsData.length) {
            console.log('[Sync] No remote projects to pull.');
            return;
        }

        // Map remote snake_case database schema to local camelCase TS entities
        const remoteProjects: Project[] = remoteProjectsData.map(
            (proj: any) => ({
                id: proj.id,
                userId: proj.user_id,
                name: proj.name,
                slug: proj.slug,
                status: proj.status,
                craftType: proj.craft_type,
                patternName: proj.pattern_name,
                notes: proj.notes,
                createdAt: proj.created_at,
                updatedAt: proj.updated_at,
                deletedAt: proj.deleted_at,
                parts: (proj.project_parts || []).map(
                    (part: any): ProjectPart => ({
                        id: part.id,
                        projectId: proj.id,
                        name: part.name,
                        slug: part.slug,
                        currentRows: part.current_rows,
                        totalRows: part.total_rows,
                        needleSize: part.needle_size,
                        yarnDetails: part.yarn_details,
                        notes: part.notes,
                        createdAt: part.created_at,
                        updatedAt: part.updated_at,
                        deletedAt: part.deleted_at,
                        secondaryCounters: (part.secondary_counters || []).map(
                            (counter: any): SecondaryCounter => ({
                                id: counter.id,
                                partId: part.id,
                                name: counter.name,
                                startsOnGlobalRow: counter.starts_on_global_row,
                                rowsPerRepeat: counter.rows_per_repeat,
                                totalRepeats: counter.total_repeats,
                                notes: counter.notes,
                                createdAt: counter.created_at,
                                updatedAt: counter.updated_at,
                                deletedAt: counter.deleted_at,
                            })
                        ),
                    })
                ),
            })
        );

        let localProjects = useProjectStore.getState().projects;
        if (remoteProjects.length) {
            // as there are remote projects, remove templates
            localProjects = localProjects.filter(
                ({ isTemplate }) => !isTemplate
            );
        }
        const mergedProjectsMap = new Map<string, Project>();

        // Seed map with local projects
        localProjects.forEach((p) => mergedProjectsMap.set(p.id, p));

        // Reconcile remote projects with local state
        remoteProjects.forEach((remote) => {
            const local = mergedProjectsMap.get(remote.id);

            if (!local) {
                // New record
                mergedProjectsMap.set(remote.id, remote);
            } else {
                // We check `updateAt` times
                const remoteTime = new Date(remote.updatedAt).getTime();
                const localTime = new Date(local.updatedAt).getTime();

                if (remoteTime > localTime) {
                    // Cloud has the project with most recent changes
                    console.log(
                        `[Sync] Remote is newer for ${remote.name}. Adopting cloud version.`
                    );
                    mergedProjectsMap.set(remote.id, remote);
                } else if (local.isDirty && localTime >= remoteTime) {
                    // Local has changes not synced in the cloud.
                    console.log(
                        `[Sync] Preserving newer local dirty project: ${local.name}.`
                    );
                } else {
                    // Synchronized or we keep the local
                    mergedProjectsMap.set(remote.id, local);
                }
            }
        });

        useProjectStore.setState({
            projects: Array.from(mergedProjectsMap.values()),
        });
        console.log(
            '[Sync] Cloud pull and state merge completed successfully.'
        );
        projectStore.setLastSyncedAt(new Date().toISOString());
    } catch (err) {
        console.error('[Sync] Atomic pull failed: ', err);
        throw err;
    } finally {
        projectStore.setIsSyncing(false);
    }
};

/**
 * Bidirectional sync: Orchestrates the complete synchronization cycle.
 * First pulls remote and reconciliates updates, then pushes local changes up.
 *
 * @param {string} userId - The active authenticated user ID.
 * @returns {Promise<void>}
 */
export const syncBidirectional = async (userId: string): Promise<void> => {
    if (typeof window !== 'undefined' && !navigator.onLine) {
        console.log(
            '[Sync] Offline status detected. Skipping cloud communication.'
        );
        return;
    }

    try {
        console.log(
            `[Sync] Starting bidirectional synchronization cycle at ${new Date().toISOString()}...`
        );
        // 1. Pull cloud
        await syncCloudToLocal(userId);

        // 2. Push local
        await syncLocalToCloud(userId);

        console.log('[Sync] Bidirectional synchronization completed.');
    } catch (err) {
        console.log('[Sync] Bidirectional synchronization failed: ', err);
    }
};
