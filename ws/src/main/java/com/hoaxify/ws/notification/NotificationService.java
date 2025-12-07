package com.hoaxify.ws.notification;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private static final int DEFAULT_LIMIT = 50;
    private static final int MAX_LIMIT = 500;

    private final NotificationRepository notificationRepository;

    @Transactional
    public void createFollowNotification(com.hoaxify.ws.user.User targetUser,
                                         com.hoaxify.ws.user.User triggeredBy) {
        if (targetUser == null || triggeredBy == null) return;
        if (targetUser.getUsername() != null &&
            targetUser.getUsername().equals(triggeredBy.getUsername())) return;

        Notification notification = Notification.builder()
                .targetUser(targetUser)
                .triggeredBy(triggeredBy)
                .type(NotificationType.FOLLOW)
                .build();

        notificationRepository.save(notification);
    }

    @Transactional
    public void createSupportMessageNotification(com.hoaxify.ws.user.User targetUser,
                                                 com.hoaxify.ws.user.User triggeredBy,
                                                 Long ticketId,
                                                 String message) {
        if (targetUser == null) return;
        if (triggeredBy != null && targetUser.getId() != null && targetUser.getId().equals(triggeredBy.getId())) {
            return;
        }
        Notification notification = Notification.builder()
                .targetUser(targetUser)
                .triggeredBy(triggeredBy != null ? triggeredBy : targetUser)
                .type(NotificationType.SUPPORT_MESSAGE)
                .referenceId(ticketId)
                .message(message)
                .build();
        notificationRepository.save(notification);
    }

    @Transactional
    public void createSupportStatusNotification(com.hoaxify.ws.user.User targetUser,
                                                com.hoaxify.ws.user.User triggeredBy,
                                                Long ticketId,
                                                String status) {
        if (targetUser == null) return;
        if (triggeredBy != null && targetUser.getId() != null && targetUser.getId().equals(triggeredBy.getId())) {
            return;
        }
        Notification notification = Notification.builder()
                .targetUser(targetUser)
                .triggeredBy(triggeredBy != null ? triggeredBy : targetUser)
                .type(NotificationType.SUPPORT_STATUS)
                .referenceId(ticketId)
                .message("Destek talebi #" + ticketId + " durumu: " + status)
                .build();
        notificationRepository.save(notification);
    }

    @Transactional(readOnly = true)
    public List<NotificationVM> getNotificationsForUser(String username,
                                                        Integer page,
                                                        Integer limit) {
        int size  = (limit == null || limit <= 0) ? DEFAULT_LIMIT : Math.min(limit, MAX_LIMIT);
        int pageNo = (page == null || page < 0) ? 0 : page;

        var sort = Sort.by(Sort.Order.desc("createdAt"), Sort.Order.desc("id"));

        var slice = notificationRepository.findByTargetUser_Username(
                username, PageRequest.of(pageNo, size, sort));

        return slice.getContent().stream().map(NotificationVM::new).toList();
    }
}
