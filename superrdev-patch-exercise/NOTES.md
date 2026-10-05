# NOTES.md

## Summary of changes

Six focused fixes, all small diffs against existing files:

1. **SQL operator precedence** (`TaskRepository.java`, `db/queries/search_tasks.sql`, `db/oracle/task_search_package.sql`) — added parentheses around `(title OR description)`. Without them `AND` bound tighter than `OR`, so `archived = FALSE` only constrained title matches and the status filter only constrained description matches. Empty-search queries leaked all 49 rows including the 2 archived.
2. **Removed artificial `Thread.sleep`** in `TaskController` — was sleeping `(10 - query.length()) * 100` ms, up to 1s on every short search. Now sub-20ms.
3. **Invalid status → 400, not 500** — `TaskStatus.valueOf()` was throwing uncaught `IllegalArgumentException`. Now caught and returned with the list of valid values.
4. **`page` / `pageSize` clamping** — `?page=0` or `?pageSize=-1` triggered `subList` `IndexOutOfBoundsException` → 500. Now clamped to `page >= 1`, `1 <= pageSize <= 100`.
5. **Reset page on filter change** (`App.jsx`) — typing a new search while on page 3 showed an empty table.
6. **`useTasks` hook hardening** — added 250ms debounce, `AbortController` for stale requests, `loading` reset on error, `error` clear-on-retry. Replaced `System.out.println` with SLF4J.

## What I chose not to change

- **`@CrossOrigin`** — redundant given the Vite proxy, but harmless.
- **In-memory pagination** — controller still loads all matches then slices with `subList`. Right fix is a `Pageable` repository method, larger change.
- **No tests added** — stayed inside the timebox.

## Biggest remaining risk

Every search materializes the full result set before paginating. Past ~10k rows this degrades badly. The Oracle artifact already shows `OFFSET/FETCH` — porting that into the JPA query is next.

## Tools / AI used

Used Claude to draft the debounce + AbortController pattern and talk through the SQL precedence reasoning. I wrote every edit myself and verified each fix against the running app via `curl`. No code accepted without review.
