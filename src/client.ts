const BASE_URL = "https://backendapp.prospi.ai/api";

function getApiKey(): string {
  const key = process.env.PROSPI_API_KEY;
  if (!key) throw new Error("PROSPI_API_KEY environment variable is required");
  return key;
}

export async function prospiRequest<T>(
  endpoint: string,
  options: { method?: string; body?: unknown } = {}
): Promise<T> {
  const { method = "GET", body } = options;
  const url = `${BASE_URL}${endpoint}`;
  const res = await fetch(url, {
    method,
    headers: {
      "x-api-key": getApiKey(),
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Prospi API error ${res.status}: ${text}`);
  }
  return res.json() as Promise<T>;
}
