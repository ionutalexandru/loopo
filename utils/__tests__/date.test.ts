import { describe, it, expect } from 'vitest';
import { formatRelativeTime } from '../date';

describe('Relative Time Utility', () => {
    it('formats recent and elapsed interval into human-readable texts', () => {
        const now = Date.now();

        const justNow = new Date(now - 40 * 1000).toISOString();
        const minutesAgo = new Date(now - 40 * 60 * 1000).toISOString();
        const hoursAgo = new Date(now - 4 * 60 * 60 * 1000).toISOString();
        const daysAgo = new Date(now - 4 * 24 * 60 * 60 * 1000).toISOString();
        const weeksAgo = new Date(now - 21 * 24 * 60 * 60 * 1000).toISOString();
        const monthsAgo = new Date(
            now - 60 * 24 * 60 * 60 * 1000
        ).toISOString();

        expect(formatRelativeTime(justNow)).toBe('just now');
        expect(formatRelativeTime(minutesAgo)).toBe('40m ago');
        expect(formatRelativeTime(hoursAgo)).toBe('4h ago');
        expect(formatRelativeTime(daysAgo)).toBe('4d ago');
        expect(formatRelativeTime(weeksAgo)).toBe('3 weeks ago');
        expect(formatRelativeTime(monthsAgo)).toBe('2 months ago');
    });
});
