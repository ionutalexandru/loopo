import { z } from 'zod';
import { ProjectPart } from '@/types/project';

export type CreatePartDTO = Pick<
    ProjectPart,
    'name' | 'currentRow' | 'totalRows' | 'needleSize' | 'yarnDetails' | 'notes'
>;

export const createPartSchema: z.ZodType<CreatePartDTO> = z.object({
    name: z
        .string()
        .trim()
        .min(5, 'Input must be at least 5 characters.')
        .max(80, 'Input must be 80 characters or less.'),
    currentRow: z.coerce
        .number()
        .int()
        .min(0, 'Input must be 0 or positive.')
        .default(0),
    totalRows: z.coerce.number().int().positive().optional(),
    needleSize: z
        .string()
        .trim()
        .max(40, 'Input must be 40 characters or less.')
        .optional(),
    yarnDetails: z
        .string()
        .trim()
        .max(120, 'Input must be 120 characters or less.')
        .optional(),
    notes: z
        .string()
        .trim()
        .max(500, 'Input must be 500 characters or less')
        .optional(),
});
