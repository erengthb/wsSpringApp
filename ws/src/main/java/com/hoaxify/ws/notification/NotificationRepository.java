package com.hoaxify.ws.notification;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hoaxify.ws.user.User;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByTargetUserAndTypeOrderByCreatedAtDesc(User targetUser, NotificationType type);
}


