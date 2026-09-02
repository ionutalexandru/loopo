import { z } from 'zod';
import { Project } from '@/types/project';

export type CreateProjectDTO = Pick<
    Project,
    'name' | 'craftType' | 'patternName' | 'notes'
>;

export const createProjectSchema: z.ZodType<CreateProjectDTO> = z.object({
    name: z
        .string()
        .trim()
        .min(5, 'Input must be at least 5 characters.')
        .max(80, 'Input must be 80 characters or less.'),
    craftType: z.enum(['knit', 'crochet']),
    patternName: z
        .string()
        .trim()
        .max(120, 'Input must be 120 characters or less')
        .optional(),
    notes: z
        .string()
        .trim()
        .max(500, 'Input must be 500 characters or less')
        .optional(),
});
