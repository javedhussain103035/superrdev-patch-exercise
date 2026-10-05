# Handwritten explanations

This folder is where photographed/scaned handwritten notes go.

The exercise requires one handwritten note per bug fixed, covering:
1. Where the bug is (file, line, layer)
2. How you discovered it
3. What the root cause is
4. How you fixed it and why you chose that approach

> **IMPORTANT — add your own photos before submitting.**
> The repository currently contains only this `README.md` as a placeholder.
> Submissions without handwritten photos are considered incomplete.
>
> Replace this README (or keep it alongside your photos) with images named
> like `01-sql-precedence.jpg`, `02-thread-sleep.jpg`, etc.

## Suggested photo list (one per fix)

| # | Suggested filename        | Bug                                                                 | Files touched                                                                                         |
|---|---------------------------|---------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------|
| 1 | `01-sql-precedence.jpg`   | SQL operator precedence leaked archived rows; status filter partial | `backend/.../TaskRepository.java`, `db/queries/search_tasks.sql`, `db/oracle/task_search_package.sql` |
| 2 | `02-thread-sleep.jpg`     | Artificial `Thread.sleep` up to 1s on every short search            | `backend/.../TaskController.java`                                                                     |
| 3 | `03-invalid-status.jpg`   | `TaskStatus.valueOf` threw → 500 instead of 400                     | `backend/.../TaskController.java`                                                                     |
| 4 | `04-page-validation.jpg`  | `?page=0` / `?pageSize=-1` → `IndexOutOfBoundsException` → 500      | `backend/.../TaskController.java`                                                                     |
| 5 | `05-page-reset.jpg`       | Page not reset on filter change → empty table after new search      | `frontend/src/App.jsx`                                                                                |
| 6 | `06-usetasks-hook.jpg`    | `useTasks`: loading stuck, error not cleared, race conditions       | `frontend/src/hooks/useTasks.js`, `frontend/src/api.js`                                              |

(Items 3 and 4 are both in `TaskController.java` and can be combined into a single photo if you prefer.)
