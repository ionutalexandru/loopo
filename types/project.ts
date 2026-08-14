// TBD Alert

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
    createdAt: string;
    updatedAt: string;
    craftType: 'knit' | 'crochet';
    currentPartId: string; // active part id
    parts: ProjectPart[];
    status?: 'in_progress' | 'completed' | 'hibernating';
    patterName?: string;
    notes?: string;
}
