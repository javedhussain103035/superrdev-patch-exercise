-- H2-compatible task search query
-- Used by the Spring Data repository layer
--
-- Parameters:
--   :term   — search term wrapped in wildcards, e.g. '%api%'
--   :status — status filter or NULL for all statuses
--
-- NOTE: parentheses around the (title OR description) branch are required.
-- Without them, AND binds tighter than OR in SQL, so:
--   * archived = FALSE would only constrain title matches, leaking archived
--     rows whenever a description matches, and
--   * the status filter would only constrain description matches.

SELECT *
FROM tasks
WHERE archived = FALSE
  AND (LOWER(title) LIKE :term OR LOWER(description) LIKE :term)
  AND (:status IS NULL OR status = :status)
ORDER BY created_at DESC;
