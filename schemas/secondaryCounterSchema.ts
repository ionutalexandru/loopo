import { z } from 'zod';
import { SecondaryCounter } from '@/types/project';
import { getCounterRowRange, hasCounterOverlap } from '@/utils/counter';

export type BaseSecondaryCounterDTO = Pick<
    SecondaryCounter,
    'name' | 'startsOnGlobalRow' | 'rowsPerRepeat' | 'totalRepeats' | 'notes'
>;

export type EditSecondaryCounterDTO = BaseSecondaryCounterDTO & {
    id: SecondaryCounter['id'];
};

export interface SecondaryCounterValidationContext {
    currentGlobalRow: number;
    existingCounters?: SecondaryCounter[];
}

export const getEditSecondaryCounterSchema = (
    context?: SecondaryCounterValidationContext
): z.ZodType<EditSecondaryCounterDTO> =>
    z
        .object({
            id: z.string(),
            name: z
                .string()
                .trim()
                .min(5, 'Input must be at least 5 characters.')
                .max(50, 'Input must be 50 characters or less.'),
            startsOnGlobalRow: z.coerce.number().int().positive(),
            rowsPerRepeat: z.coerce.number().int().positive(),
            totalRepeats: z.coerce.number().int().positive(),
            notes: z
                .string()
                .trim()
                .max(30, 'Input must be 30 characters or less.')
                .optional(),
        })
        .superRefine((data, ctx) => {
            if (!ctx) return;
            if (!context) return;

            const { currentGlobalRow, existingCounters } = context;
            const { startRow, endRow } = getCounterRowRange(data);

            // Active counter cannot start in a future row
            if (data.startsOnGlobalRow > currentGlobalRow) {
                ctx.addIssue({
                    code: 'custom',
                    path: ['startsOnGlobalRow'],
                    message: `Cannot start on row ${data.startsOnGlobalRow} because current progress is on row ${currentGlobalRow}.`,
                });
            }

            // Active counter cannot end before the rows already crafted
            if (endRow < currentGlobalRow) {
                ['rowsPerRepeat', 'totalRepeats', 'startsOnGlobalRow'].map(
                    (fieldName) => {
                        ctx.addIssue({
                            code: 'custom',
                            path: [fieldName],
                            message: `Pattern ends on row ${endRow}, but current progress is already on row ${currentGlobalRow}.`,
                        });
                    }
                );
            }

            // Collision check agains all other existing counters
            if (
                existingCounters &&
                hasCounterOverlap(existingCounters, data, data.id)
            ) {
                ['totalRepeats', 'rowsPerRepeat', 'startsOnGlobalRow'].map(
                    (fieldName) => {
                        ctx.addIssue({
                            code: 'custom',
                            path: [fieldName],
                            message: `Row range [${startRow} - ${endRow}] overlaps with another existing counter.`,
                        });
                    }
                );
            }
        });
