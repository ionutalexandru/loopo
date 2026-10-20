import { get, set, del } from 'idb-keyval';
import { StateStorage } from 'zustand/middleware';

export const indexedDbStorage: StateStorage = {
    getItem: async (name: string): Promise<string | null> => {
        // 1. Try to read from IndexedDB
        const value = await get<string>(name);
        if (value !== undefined) {
            return value;
        }

        // 2. If there's no IndexedDB, try to get the data from localStorage
        if (typeof window !== undefined) {
            const legacyData = localStorage.getItem(name);
            if (legacyData) {
                // migrate from localStorage to IndexedDB
                await set(name, legacyData);
                localStorage.removeItem(name);
                return legacyData;
            }
        }

        return null;
    },

    setItem: async (name: string, value: string): Promise<void> => {
        await set(name, value);
    },

    removeItem: async (name: string): Promise<void> => {
        await del(name);
    },
};
