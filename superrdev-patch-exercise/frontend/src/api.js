const API_BASE = '/api';

/**
 * fetchTasks — fetch a page of tasks from the backend.
 *
 * Pass `signal` (an AbortSignal) to make the request cancellable. The useTasks
 * hook uses this to abort stale in-flight requests when the user keeps typing.
 */
export async function fetchTasks({ query = '', status = '', page = 1, pageSize = 10, signal } = {}) {
  const params = new URLSearchParams();
  if (query) params.set('q', query);
  if (status) params.set('status', status);
  params.set('page', String(page));
  params.set('pageSize', String(pageSize));

  const url = `${API_BASE}/tasks?${params.toString()}`;
  console.log('[api] fetching:', url);

  const response = await fetch(url, { signal });

  if (!response.ok) {
    // Try to surface the backend's error payload when present; fall back to
    // the HTTP status text otherwise.
    let detail = `Request failed: ${response.status}`;
    try {
      const body = await response.json();
      if (body?.message) detail = body.message;
    } catch {
      // response had no JSON body — keep the default detail
    }
    throw new Error(detail);
  }

  return response.json();
}
