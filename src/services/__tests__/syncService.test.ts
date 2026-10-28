import { useProjectStore } from '@/store/useProjectStore';
import { syncCloudToLocal, syncLocalToCloud } from '../syncService';

// Mock idb-keyval globally to prevent "indexedDB is not defined" errors in Node environment
vi.mock('idb-keyval', () => ({
    get: vi.fn().mockResolvedValue(undefined),
    set: vi.fn().mockResolvedValue(undefined),
    del: vi.fn().mockResolvedValue(undefined),
    clear: vi.fn().mockResolvedValue(undefined),
}));

// Use vi.hoisted to safely declare mock functions before vi.mock processes them
const { mockRpc, mockFrom } = vi.hoisted(() => ({
    mockRpc: vi.fn(),
    mockFrom: vi.fn(),
}));

// Mock the Supabase client module using the hoisted mock functions
// We don't make real transactions to the database, we fake them
vi.mock('../../lib/supabase.ts', () => ({
    supabase: {
        rpc: mockRpc,
        from: mockFrom,
    },
}));

describe('Sync Service', () => {
    const mockUserId = '62ffeee8-838a-4102-917f-f565e47706f1';

    beforeEach(() => {
        vi.clearAllMocks();
        // Reset Zustand store before each test
        useProjectStore.setState({ projects: [] });

        // Provide a safe default return value so rpc calls never return undefined
        mockRpc.mockResolvedValue({
            data: null,
            error: null,
            count: null,
            status: 200,
            statusText: 'OK',
        });
    });

    describe('syncLocalToCloud (Push)', () => {
        it('should skip synchronization when offline', async () => {
            // Force navigator to be offline
            vi.stubGlobal('navigator', { onLine: false });

            await syncLocalToCloud(mockUserId);

            // Verify that supabase RPC was never invoked
            expect(mockRpc).not.toHaveBeenCalled();
            vi.unstubAllGlobals();
        });

        it('should push dirty projects successfully via RPC and clean local flags', async () => {
            // Simulate an online network state
            vi.stubGlobal('navigator', { onLine: true });

            // Set up local dirty projects
            useProjectStore.setState({
                projects: [
                    {
                        id: '7a145ea4-5ada-4377-9be9-8e08d33906c7',
                        userId: mockUserId,
                        name: 'Test project',
                        slug: 'test-project',
                        craftType: 'knit',
                        status: 'active',
                        notes: 'Test notes',
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                        isDirty: true,
                        parts: [],
                    },
                ],
            });

            await syncLocalToCloud(mockUserId);

            // Ensure the RPC function was called
            expect(mockRpc).toHaveBeenCalledTimes(1);
            expect(mockRpc).toHaveBeenCalledWith(
                'sync_user_projects',
                expect.any(Object)
            );

            // Verify the local project's dirty flag was cleared
            const updatedProjects = useProjectStore.getState().projects;
            expect(updatedProjects[0].isDirty).toBe(false);
        });

        it('should preserve local dirty state if the RPC database call failes', async () => {
            // Simulate an online network state
            vi.stubGlobal('navigator', { onLine: true });

            // Set up local dirty projects
            useProjectStore.setState({
                projects: [
                    {
                        id: '7a145ea4-5ada-4377-9be9-8e08d33906c7',
                        userId: mockUserId,
                        name: 'Test project',
                        slug: 'test-project',
                        craftType: 'knit',
                        status: 'active',
                        notes: 'Test notes',
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                        isDirty: true,
                        parts: [],
                    },
                ],
            });

            mockRpc.mockResolvedValue({
                data: null,
                error: { message: 'Database transaction error' },
                count: null,
                status: 500,
                statusText: 'Internal Server Error',
            });

            // Expect sync function to throw an error
            await expect(syncLocalToCloud(mockUserId)).rejects.toThrow();

            // Verify the dirty flag
            const projects = useProjectStore.getState().projects;
            expect(projects[0].isDirty).toBe(true);
            vi.unstubAllGlobals();
        });
    });

    describe('syncCloudToLocal (Pull & Conflict Resolution)', () => {
        it('should priritize local dirty projects and prevent older remote data from overwriting loval changes', async () => {
            // Simulate an online network state
            vi.stubGlobal('navigator', { onLine: true });

            const olderTimestamp = new Date(
                '2026-01-01T00:00:00Z'
            ).toISOString();
            const newerTimestamp = new Date(
                '2026-01-02T00:00:00Z'
            ).toISOString();

            // Set up local dirty projects
            useProjectStore.setState({
                projects: [
                    {
                        id: '7a145ea4-5ada-4377-9be9-8e08d33906c7',
                        userId: mockUserId,
                        name: 'Local Test project',
                        slug: 'test-project',
                        craftType: 'knit',
                        status: 'active',
                        notes: 'Local Test notes',
                        createdAt: olderTimestamp,
                        updatedAt: newerTimestamp,
                        isDirty: true,
                        parts: [],
                    },
                ],
            });

            // Mock Supabase table query returning an older remote version
            const mockSelect = {
                select: vi.fn().mockReturnThis(),
                eq: vi.fn().mockResolvedValueOnce({
                    data: [
                        {
                            id: '7a145ea4-5ada-4377-9be9-8e08d33906c7',
                            userId: mockUserId,
                            name: 'Remote Test project',
                            slug: 'test-project',
                            craftType: 'knit',
                            status: 'active',
                            notes: 'Remote Test notes',
                            createdAt: olderTimestamp,
                            updatedAt: olderTimestamp,
                            isDirty: true,
                            parts: [],
                        },
                    ],
                    error: null,
                    count: null,
                    status: 200,
                    statusText: 'OK',
                }),
            };

            mockFrom.mockReturnValue(mockSelect);

            await syncCloudToLocal(mockUserId);

            // Verify local changes were prioritized and preserved
            const currentProject = useProjectStore.getState().projects;
            expect(currentProject[0].name).toBe('Local Test project');
            vi.unstubAllGlobals();
        });
    });
});
