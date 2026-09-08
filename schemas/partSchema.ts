import { z } from 'zod';
import { ProjectPart } from '@/types/project';

/**
 * Data Transfer Object for creating and updating project parts.
 */
export type PartDTO = Pick<
    ProjectPart,
    'name' | 'currentRow' | 'totalRows' | 'needleSize' | 'yarnDetails' | 'notes'
>;

export type CreatePartDTO = PartDTO;
export type UpdatePartDTO = PartDTO;

export const partSchema: z.ZodType<PartDTO> = z.object({
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
    totalRows: z.coerce
        .number()
        .int()
        .min(0, 'Input must be 0 or positive.')
        .optional(),
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

export const createPartSchema: z.ZodType<CreatePartDTO> = partSchema;
export const updatePartSchema: z.ZodType<UpdatePartDTO> = partSchema;
