export const sleep = (ms: number) =>
  new Promise((r) => setTimeout(r, ms));

export const fetchWithRetry = async <T,>(
  fn: () => Promise<T>,
  retry = 2
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    if (retry > 0) {
      await sleep(800);
      return fetchWithRetry(fn, retry - 1);
    }
    throw error;
  }
};

export const cleanText = (html: string, limit = 120) => {
  const text = html
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();

  return text.length > limit ? text.slice(0, limit) + "..." : text;
};