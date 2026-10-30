import { describe, it, expect } from 'vitest';
import { fetchWithTimeout } from '../fetch';

describe('fetchWithTimeout Utility', () => {
    it('should resolve successfully if the promise completes before the timeout', async () => {
        const fastPromise = Promise.resolve('data received');

        const result = await fetchWithTimeout(fastPromise, 1000);
        expect(result).toBe('data received');
    });

    it('should reject with a timeout error if the promise takes too long', async () => {
        const slowPromise = new Promise((resolve) => {
            setTimeout(() => resolve('too late'), 200);
        });

        const fetchPromise = fetchWithTimeout(slowPromise, 20);

        await expect(fetchPromise).rejects.toThrow('Sync operation timed out');
    });
});
