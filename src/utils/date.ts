/**
 * Form an ISO date string into a concise relative time label (e.g., 2h ago, 3 weeks ago...)
 *
 * @param dateString - Valid ISO date string
 * @returns Human-readable relative time string
 */
export function formatRelativeTime(dateString: string): string {
    const targetDate = new Date(dateString).getTime();
    const now = new Date();

    const seconds = Math.max(
        0,
        Math.floor((now.getTime() - targetDate) / 1000)
    );

    if (seconds < 60) return 'just now';

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;

    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;

    const weeks = Math.floor(days / 7);
    if (weeks < 4) return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;

    const months = Math.floor(days / 30);
    if (months < 12)
        return `${months} ${months === 1 ? 'month' : 'months'} ago`;

    const years = Math.floor(days / 365);
    return `${years} ${years === 1 ? 'year' : 'years'} ago`;
}
