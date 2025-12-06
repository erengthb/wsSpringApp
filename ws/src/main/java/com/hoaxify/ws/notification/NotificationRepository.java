package com.hoaxify.ws.notification;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    @EntityGraph(attributePaths = {"triggeredBy"})
    Slice<Notification> findByTargetUser_Username(String username, Pageable pageable);

    void deleteByCreatedAtBefore(java.time.LocalDateTime threshold);
}
