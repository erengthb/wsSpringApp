package com.hoaxify.ws.support;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.hoaxify.ws.user.User;

public interface SupportTicketRepository extends JpaRepository<SupportTicket, Long> {

    Page<SupportTicket> findByCreatedBy(User user, Pageable pageable);

    Page<SupportTicket> findByCreatedByAndStatus(User user, SupportTicketStatus status, Pageable pageable);

    @Query("""
        SELECT t FROM SupportTicket t
        LEFT JOIN t.createdBy u
        WHERE (:status IS NULL OR t.status = :status)
          AND (:type IS NULL OR t.type = :type)
          AND (:search IS NULL OR :search = '' OR
               lower(t.title) LIKE lower(concat('%', :search, '%')) OR
               CAST(t.id AS string) LIKE concat('%', :search, '%') OR
               lower(u.username) LIKE lower(concat('%', :search, '%')))
        """)
    Page<SupportTicket> searchForAdmin(
            @Param("search") String search,
            @Param("status") SupportTicketStatus status,
            @Param("type") SupportTicketType type,
            Pageable pageable);
}
