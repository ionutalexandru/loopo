import { describe, it, expect } from 'vitest';
import { Project } from '@/types/project';
import { getProjectProgressSummary } from '../projectProgress';

describe('Project Progress Calculation Utility', () => {
    it('resolves the active part by most recent updatedAt', () => {
        const project: Project = {
            id: 'proj-01',
            userId: 'user-local',
            name: 'Icelandic Pullover',
            slug: 'icelandic-pullover',
            craftType: 'knit',
            createdAt: '2026-08-01T10:00:00.000Z',
            updatedAt: '2026-08-02T10:00:00.000Z',
            status: 'active',
            parts: [
                {
                    id: 'part-01',
                    projectId: 'proj-01',
                    name: 'Back Panel',
                    slug: 'back-panel',
                    currentRow: 250,
                    totalRows: 300,
                    createdAt: '2026-08-01T10:00:00.000Z',
                    updatedAt: '2026-08-02T10:00:00.000Z',
                    secondaryCounters: [],
                },
                {
                    id: 'part-02',
                    projectId: 'proj-01',
                    name: 'Front Panel',
                    slug: 'front-panel',
                    currentRow: 10,
                    totalRows: 300,
                    createdAt: '2026-08-10T10:00:00.000Z',
                    updatedAt: '2026-08-12T10:00:00.000Z',
                    secondaryCounters: [],
                },
            ],
        };

        const summary = getProjectProgressSummary(project);

        expect(summary.hasParts).toBe(true);
        expect(summary.activePartName).toBe('Front Panel');
        expect(summary.currentRow).toBe(10);
        expect(summary.totalRows).toBe(300);
        expect(summary.lastUpdated).toBeDefined();
        expect(summary.isCompleted).toBe(false);
        expect(summary.url).toBe(
            '/projects/icelandic-pullover/parts/front-panel'
        );
    });

    it('handles project without parts', () => {
        const project: Project = {
            id: 'proj-01',
            userId: 'user-local',
            name: 'Icelandic Pullover',
            slug: 'icelandic-pullover',
            craftType: 'knit',
            createdAt: '2026-08-01T10:00:00.000Z',
            updatedAt: '2026-08-02T10:00:00.000Z',
            status: 'active',
            parts: [],
        };

        const summary = getProjectProgressSummary(project);

        expect(summary.hasParts).toBe(false);
        expect(summary.activePartName).toBeUndefined();
        expect(summary.currentRow).toBe(0);
        expect(summary.totalRows).toBeUndefined();
        expect(summary.lastUpdated).toBeUndefined();
        expect(summary.isCompleted).toBe(false);
        expect(summary.url).toBe('/projects/icelandic-pullover/parts/new');
    });

    it('handles open-ended parts without fixed total rows target', () => {
        const project: Project = {
            id: 'proj-01',
            userId: 'user-local',
            name: 'Icelandic Pullover',
            slug: 'icelandic-pullover',
            craftType: 'knit',
            createdAt: '2026-08-01T10:00:00.000Z',
            updatedAt: '2026-08-02T10:00:00.000Z',
            status: 'active',
            parts: [
                {
                    id: 'part-01',
                    projectId: 'proj-01',
                    name: 'Back Panel',
                    slug: 'back-panel',
                    currentRow: 250,
                    createdAt: '2026-08-01T10:00:00.000Z',
                    updatedAt: '2026-08-02T10:00:00.000Z',
                    secondaryCounters: [],
                },
            ],
        };

        const summary = getProjectProgressSummary(project);

        expect(summary.hasParts).toBe(true);
        expect(summary.activePartName).toBe('Back Panel');
        expect(summary.totalRows).toBeUndefined();
        expect(summary.lastUpdated).toBeDefined();
        expect(summary.isCompleted).toBe(false);
    });
});
