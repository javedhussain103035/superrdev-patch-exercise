import { useState, useEffect } from 'react';
import { fetchTasks } from '../api';

const DEBOUNCE_MS = 250;

/**
 * useTasks — fetches a page of tasks matching the current search query and
 * status filter.
 *
 * Behavior:
 *   - The search query is debounced by DEBOUNCE_MS so each keystroke does not
 *     trigger an HTTP request.
 *   - The status filter and page number take effect immediately (no debounce).
 *   - Each in-flight request is tied to an AbortController. If inputs change
 *     before the previous request resolves, the previous request is aborted
 *     so a slow stale response can never overwrite a fresh one.
 *   - On retry after an error, the previous error is cleared and loading is
 *     set back to true.
 *   - On error, loading is always reset to false (the original code left it
 *     stuck on true, freezing the UI on the loading state).
 */
export function useTasks(query, status, page, pageSize) {
  const [tasks, setTasks] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Debounce the query so we don't fire a request on every keystroke. Status
  // and page are not debounced — those are deliberate user actions.
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  useEffect(() => {
    const handle = setTimeout(() => setDebouncedQuery(query), DEBOUNCE_MS);
    return () => clearTimeout(handle);
  }, [query]);

  useEffect(() => {
    const controller = new AbortController();

    setLoading(true);
    setError(null);

    fetchTasks({ query: debouncedQuery, status, page, pageSize, signal: controller.signal })
      .then((data) => {
        setTasks(data.items ?? []);
        setTotal(data.total ?? 0);
        setLoading(false);
      })
      .catch((err) => {
        // Aborts happen whenever inputs change before a request resolves —
        // they are not user-facing errors, so leave loading true here and
        // let the next effect iteration settle the final state.
        if (err?.name === 'AbortError') {
          return;
        }
        setError(err.message ?? 'Request failed');
        setLoading(false);
      });

    return () => controller.abort();
  }, [debouncedQuery, status, page, pageSize]);

  return { tasks, total, loading, error };
}
