export async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  retries = 3
): Promise<Response> {
  try {
    const res = await fetch(url, {
      ...options,
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`HTTP error: ${res.status}`);
    }

    return res;
  } catch (error) {
    if (retries <= 0) throw error;

    // small delay before retry
    await new Promise((res) => setTimeout(res, 1000));

    return fetchWithRetry(url, options, retries - 1);
  }
}