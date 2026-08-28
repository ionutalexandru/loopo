/**
 * Transform a guman-readable title into a URL-safe, normalized slug.
 *
 * @param text - Input string
 * @param prefix - Text to prepend to the slug
 * @param sufix - Text to append to the slug
 * @returns Sanitized slug
 */
export function slugify(
    text: string,
    prefix: string = '',
    sufix: string = ''
): string {
    const slug = text
        .toString()
        .toLocaleLowerCase()
        .trim()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
        .replace(/[^a-z0-9\s-]/g, '') // Replace non-alphanumeric characters
        .replace(/[\s_]+/g, '-') // Replace spaces and underscores with hyphens
        .replace(/^-+|-+$/g, '') // Trim leading and trailing hyphens
        .substring(0, 50);

    return [prefix, slug, sufix].filter((el) => el).join('-');
}
