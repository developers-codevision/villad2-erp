// Generic fetch wrapper to centralize API calls
export type RequestConfig = RequestInit & { query?: Record<string, string | number | boolean | undefined> };

const getBaseUrl = () => {
  return (import.meta.env?.VITE_API_BASE_URL as string) || "/api";
};

function buildQuery(query?: Record<string, string | number | boolean | undefined>) {
  if (!query) return "";
  const params = new URLSearchParams();
  Object.entries(query).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    params.append(k, String(v));
  });
  const s = params.toString();
  return s ? `?${s}` : "";
}

export async function apiFetch<T = unknown>(
  path: string,
  config: RequestConfig = {}
): Promise<T> {
  const url = `${getBaseUrl()}${path}${buildQuery(config.query)}`;

  const headers = {
    "Content-Type": "application/json",
    ...(config.headers || {}),
  } as Record<string, string>;

  const init: RequestInit = {
    ...config,
    headers,
  };

  if (init.body && typeof init.body !== "string") {
    init.body = JSON.stringify(init.body);
  }

  const res = await fetch(url, init);
  if (!res.ok) {
    const text = await res.text();
    let data: any = text;
    try { data = JSON.parse(text); } catch {};
    const err: any = new Error(data?.message || res.statusText || "Request failed");
    err.status = res.status;
    err.data = data;
    throw err;
  }

  if (res.status === 204) return undefined as unknown as T;
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return res.json() as Promise<T>;
  }
  const text = await res.text();
  return text as unknown as T;
}

