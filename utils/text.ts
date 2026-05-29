// utils/text.ts
// FIX: Consolidates HTML/text helpers that were duplicated in:
//   - utils/home.ts (cleanText)
//   - app/[slug]/page.tsx (stripHtml, cleanSlug)
//   - app/blog/admin/PostsTable.tsx (cleanText, truncate)

/**
 * Strip HTML tags and decode common HTML entities.
 */
export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g,  " ")
    .replace(/&amp;/g,   "&")
    .replace(/&lt;/g,    "<")
    .replace(/&gt;/g,    ">")
    .trim();
}

/**
 * Strip HTML and truncate to `limit` characters with ellipsis.
 */
export function cleanText(html: string, limit = 120): string {
  const text = stripHtml(html);
  return text.length > limit ? text.slice(0, limit) + "..." : text;
}

/**
 * Truncate plain text to `max` characters.
 */
export function truncate(text: string, max: number): string {
  return text.length > max ? text.slice(0, max) + "..." : text;
}

/**
 * Convert a title/string into a URL-safe slug.
 */
export function slugify(text: string): string {
  return stripHtml(text)
    .replace(/&[^;]+;/g,    "")
    .replace(/[^a-z0-9\s-]/gi, "")
    .trim()
    .replace(/\s+/g,  "-")
    .replace(/-+/g,   "-")
    .toLowerCase();
}
