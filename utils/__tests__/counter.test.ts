import { describe, it, expect } from 'vitest';

import {
    getCounterRowRange,
    hasCounterOverlap,
    getActiveSecondaryCounter,
    getSecondaryCounterProgress,
} from '../counter';
import { SecondaryCounter } from '@/types/project';

describe('Counter Utility Functions', () => {
    const mockCounter: SecondaryCounter = {
        id: 'motif-cable-01',
        partId: 'part-body-01',
        name: '8-Row Cable Repeat',
        startsOnGlobalRow: 10,
        rowsPerRepeat: 8,
        totalRepeats: 2, // Range: [10, 25]
        createdAt: '2026-02-01T00:00:00.000Z',
        updatedAt: '2026-02-01T00:00:00.000Z',
    };

    describe('getCounterRowRange', () => {
        it('calculates start row, end row, and total span correctly', () => {
            const range = getCounterRowRange(mockCounter);

            expect(range.startRow).toBe(10);
            expect(range.endRow).toBe(25);
            expect(range.totalRows).toBe(16);
        });
    });

    describe('hasCounterOverlap', () => {
        it('detects a collision when a candidate range is nested inside existing counter', () => {
            const candidate = {
                startsOnGlobalRow: 12,
                rowsPerRepeat: 4,
                totalRepeats: 1, // Range: [12, 15]
            };
            expect(hasCounterOverlap([mockCounter], candidate)).toBe(true);
        });

        it('detects a collision when candidate range starts on th exact endind row boundaries', () => {
            const candidate = {
                startsOnGlobalRow: 25,
                rowsPerRepeat: 4,
                totalRepeats: 1, // Range: [25, 28]
            };
            expect(hasCounterOverlap([mockCounter], candidate)).toBe(true);
        });

        it('allows non-overlapping candidates before and after the exising range', () => {
            const candidateBefore = {
                startsOnGlobalRow: 1,
                rowsPerRepeat: 4,
                totalRepeats: 2, // Range: [1, 8]
            };

            const candidateAfter = {
                startsOnGlobalRow: 26,
                rowsPerRepeat: 4,
                totalRepeats: 2, // Range: [26, 33]
            };

            expect(hasCounterOverlap([mockCounter], candidateBefore)).toBe(
                false
            );
            expect(hasCounterOverlap([mockCounter], candidateAfter)).toBe(
                false
            );
        });

        it('ignores self-collision when updating an existing counter with excludeCounterId', () => {
            expect(
                hasCounterOverlap([mockCounter], mockCounter, 'motif-cable-01')
            ).toBe(false);
        });
    });

    describe('getActiveSecondaryCounter', () => {
        it('returns undefined if the current row has not reach the motif', () => {
            const active = getActiveSecondaryCounter([mockCounter], 9);
            expect(active).toBeUndefined();
        });

        it('returns the active counter when the current row is within range', () => {
            const activeAtStart = getActiveSecondaryCounter([mockCounter], 10);
            const activeAtEnd = getActiveSecondaryCounter([mockCounter], 25);

            expect(activeAtStart?.id).toBe('motif-cable-01');
            expect(activeAtEnd?.id).toBe('motif-cable-01');
        });

        it('returns undefined after the motif range has been elapsed', () => {
            const active = getActiveSecondaryCounter([mockCounter], 26);
            expect(active).toBeUndefined();
        });
    });

    describe('getSecondaryCounterProgress', () => {
        it('handles state before motif starting row', () => {
            const progress = getSecondaryCounterProgress(mockCounter, 8);

            expect(progress.hasStarted).toBe(false);
            expect(progress.isCompleted).toBe(false);
            expect(progress.currentRepeat).toBe(0);
            expect(progress.rowInCurrentRepeat).toBe(0);
            expect(progress.progressPercentage).toBe(0);
        });

        it('calculates repeat transition accurately(row 13 -> repeat 1, row 4 of 8)', () => {
            const progress = getSecondaryCounterProgress(mockCounter, 13);

            expect(progress.hasStarted).toBe(true);
            expect(progress.isCompleted).toBe(false);
            expect(progress.currentRepeat).toBe(1);
            expect(progress.rowInCurrentRepeat).toBe(4);
            expect(progress.rowsCompleted).toBe(4);
            expect(progress.progressPercentage).toBe(25);
        });

        it('calculates repeat transition accurately(row 18 -> repeat 2, row 1 of 8)', () => {
            const progress = getSecondaryCounterProgress(mockCounter, 18);

            expect(progress.hasStarted).toBe(true);
            expect(progress.isCompleted).toBe(false);
            expect(progress.currentRepeat).toBe(2);
            expect(progress.rowInCurrentRepeat).toBe(1);
            expect(progress.rowsCompleted).toBe(9);
            expect(progress.progressPercentage).toBe(56);
        });

        it('handles completed state once current row passes total motif span', () => {
            const progress = getSecondaryCounterProgress(mockCounter, 30);

            expect(progress.hasStarted).toBe(true);
            expect(progress.isCompleted).toBe(true);
            expect(progress.currentRepeat).toBe(2);
            expect(progress.rowInCurrentRepeat).toBe(8);
            expect(progress.rowsCompleted).toBe(16);
            expect(progress.progressPercentage).toBe(100);
        });
    });
});
