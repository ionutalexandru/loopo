export type CraftType = 'knit' | 'crochet';
export type ProjectStatus = 'active' | 'paused' | 'completed' | 'archived';

export interface SecondaryCounter {
    id: string;
    partId: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    startsOnGlobalRow: number;
    rowsPerRepeat: number;
    totalRepeats: number;
    notes?: string;
    isActive?: boolean;
}

export interface ProjectPart {
    id: string;
    projectId: string;
    slug: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    currentRow: number;
    totalRows?: number;
    needleSize?: string;
    yarnDetails?: string;
    notes?: string;
    secondaryCounters: SecondaryCounter[];
}

export interface Project {
    id: string;
    name: string;
    slug: string;
    createdAt: string;
    updatedAt: string;
    userId: string;
    craftType: CraftType;
    parts: ProjectPart[];
    status: ProjectStatus;
    patternName?: string;
    notes?: string;
}
