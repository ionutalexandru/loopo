export type CraftType = 'knit' | 'crochet';
export type ProjectStatus = 'active' | 'paused' | 'completed' | 'archived';

export interface SecondaryCounter {
    id: string;
    userId?: string;
    partId: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string | null;
    startsOnGlobalRow: number;
    rowsPerRepeat: number;
    totalRepeats: number;
    notes?: string;
}

export interface ProjectPart {
    id: string;
    userId?: string;
    projectId: string;
    slug: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string | null;
    currentRows: number;
    totalRows?: number;
    needleSize?: string;
    yarnDetails?: string;
    notes?: string;
    secondaryCounters?: SecondaryCounter[];
}

export interface Project {
    id: string;
    name: string;
    slug: string;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string | null;
    isDirty?: boolean;
    userId: string;
    craftType: CraftType;
    parts?: ProjectPart[];
    status: ProjectStatus;
    patternName?: string;
    notes?: string;
}
