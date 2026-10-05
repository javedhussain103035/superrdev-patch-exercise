package com.internal.tasktracker;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    // Search non-archived tasks by term (against title OR description) with an
    // optional status filter. Parentheses around the title/description OR branch
    // are required because AND binds tighter than OR in SQL. Without them the
    // archived=FALSE constraint only applies to title matches and the status
    // filter only applies to description matches, leaking archived rows.
    @Query(value = "SELECT * FROM tasks "
                 + "WHERE archived = FALSE "
                 + "  AND (LOWER(title) LIKE :term OR LOWER(description) LIKE :term) "
                 + "  AND (:status IS NULL OR status = :status) "
                 + "ORDER BY created_at DESC",
           nativeQuery = true)
    List<Task> searchTasks(@Param("term") String term, @Param("status") String status);
}
