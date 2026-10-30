/**
 * Wraps a promise with a timeout mechanism. If the promise does not resolve
 * or reject within the specified timeframe, it rejects with a timeout error.
 *
 * @template T - The expected return type of promise.
 * @param {PromiseLike<T>} promise - The target promise or query to execute.
 * @param {number} timeoutMS - Maximum waiting time in ms (default: 10 seconds)
 * @returns {Promise<T>} A promise resolving the original promise's result.
 */
export const fetchWithTimeout = async <T>(
    promise: PromiseLike<T>,
    timeoutMS: number = 10000 // 10s
): Promise<T> => {
    let timeout: NodeJS.Timeout;

    // Create a rejecting promise that fires after the timeout threshold
    const timeoutPromise = new Promise<never>((_, reject) => {
        timeout = setTimeout(() => {
            reject(new Error('Sync operation timed out'));
        }, timeoutMS);
    });

    try {
        // Race the target operation against the timeout boundary
        return await Promise.race([promise, timeoutPromise]);
    } finally {
        // Clean up the timer to prevent memory leaks
        clearTimeout(timeout!);
    }
};
