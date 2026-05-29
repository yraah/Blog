// utils/retry.ts
// FIX: Consolidates retry logic that was duplicated across:
//   - utils/fetchWithRetry.ts
//   - utils/home.ts (fetchWithRetry)
//   - CreatePostModal.tsx (uploadToCloudinary, createPostWithRetry)
//   - EditPostModal.tsx (uploadImage, updatePostWithRetry)
//   - Header.tsx (logoutWithRetry)
//   - CategoryTable.tsx (fetchCategoriesRef)
// Now there is one single retry utility used everywhere.

import { RETRY } from "@/lib/constants";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Retry a generic async function up to `attempts` times with a delay.
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  attempts: number = RETRY.attempts,
  delayMs:  number = RETRY.delayMs
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (attempts <= 0) throw error;
    await sleep(delayMs);
    return withRetry(fn, attempts - 1, delayMs);
  }
}

/**
 * Retry a fetch() call. Throws on non-ok responses.
 */
export async function fetchWithRetry(
  url:     string,
  options: RequestInit = {},
  attempts = RETRY.attempts
): Promise<Response> {
  return withRetry(async () => {
    const res = await fetch(url, { ...options, cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
    return res;
  }, attempts);
}
