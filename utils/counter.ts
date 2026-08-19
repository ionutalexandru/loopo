import { SecondaryCounter } from '@/types/project';

/**
 * Represents the detailed progress of a secundary counter relative to the
 * current global row number.
 */
export interface SecondaryCounterProgress {
    // current row has reached the counter's starting row
    hasStarted: boolean;
    // all repeats completed
    isCompleted: boolean;
    // active repeat index
    currentRepeat: number;
    // current row position within the active repeat sequence
    rowInCurrentRepeat: number;
    // total number of rows required to finish all repeats
    totalRows: number;
}

/**
 * Calculate the absolute start and end row boundaries of a secondary counter.
 * Example: starts on row 10, 8 rows/repeat, 3 repeats -> rows 10 to 33 (24 rows).
 *
 * @param counter - counter to be calculated.
 * @returns `startRow`, `endRow` and `totalRows`.
 */
export function getCounterRowRange(
    counter: Pick<
        SecondaryCounter,
        'startsOnGlobalRow' | 'rowsPerRepeat' | 'totalRepeats'
    >
): { startRow: number; endRow: number; totalRows: number } {
    const { rowsPerRepeat, totalRepeats, startsOnGlobalRow } = counter;
    const totalRows = rowsPerRepeat * totalRepeats;
    const startRow = startsOnGlobalRow;
    const endRow = startRow + totalRows - 1;
    return { startRow, endRow, totalRows };
}

/**
 * Determines whether a candidate counter's row interval overlaps with any existing
 * counter. Ensure that only one secondary counter can be active in any given row range.
 *
 * @param existingCounters - The list of secondary counters.
 * @param candidate - The counter to validate.
 * @param ignoreCounterId - Optional Id to ignore during collision checks.
 * @returns - `true` if an overlap, false otherwise
 */
export function hasCounterOverlap(
    existingCounters: SecondaryCounter[],
    candidate: Pick<
        SecondaryCounter,
        'startsOnGlobalRow' | 'rowsPerRepeat' | 'totalRepeats'
    >,
    ignoreCounterId?: string
): boolean {
    const candidateRange = getCounterRowRange(candidate);

    return existingCounters.some((counter) => {
        if (ignoreCounterId && counter.id === ignoreCounterId) return false;

        const currentRange = getCounterRowRange(counter);

        return (
            Math.max(candidateRange.startRow, currentRange.startRow) <=
            Math.min(candidateRange.endRow, currentRange.endRow)
        );
    });
}

/**
 * Finds the currently active counter for a given global row.
 *
 * @param counters - The list of secondary counters.
 * @param currentRow - The current global row number.
 * @returns - The active `SecondaryCounter` or `undefined` if no counter covers the row.
 */
export function getActiveSecondaryCounter(
    counters: SecondaryCounter[],
    currentRow: number
): SecondaryCounter | undefined {
    return counters.find((counter) => {
        const { startRow, endRow } = getCounterRowRange(counter);
        return currentRow >= startRow && currentRow <= endRow;
    });
}

/**
 * Computes the progress state of a secondary counter based on the part's current row.
 *
 * @param counter - The target secondary counter.
 * @param currentRow - The current global row number.
 * @returns - Progress state object.
 */

export function getSecondaryCounterProgress(
    counter: SecondaryCounter,
    currentRow: number
): SecondaryCounterProgress {
    const { startRow, totalRows } = getCounterRowRange(counter);

    // 1. State: the counter has not started yet
    if (currentRow < startRow) {
        return {
            hasStarted: false,
            isCompleted: false,
            currentRepeat: 0,
            rowInCurrentRepeat: 0,
            totalRows,
        };
    }

    const rowsElapsed = currentRow - startRow;

    // 2. State: the counter sequence has been completed
    if (rowsElapsed >= totalRows) {
        return {
            hasStarted: true,
            isCompleted: true,
            currentRepeat: counter.totalRepeats,
            rowInCurrentRepeat: counter.rowsPerRepeat,
            totalRows,
        };
    }

    // 3. State: the counter is in progress
    const currentRepeat = Math.floor(rowsElapsed / counter.rowsPerRepeat) + 1;
    const rowInCurrentRepeat = (rowsElapsed % counter.rowsPerRepeat) + 1;

    return {
        hasStarted: true,
        isCompleted: false,
        currentRepeat,
        rowInCurrentRepeat,
        totalRows,
    };
}
