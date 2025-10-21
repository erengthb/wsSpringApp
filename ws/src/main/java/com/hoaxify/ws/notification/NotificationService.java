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

    @Transactional(readOnly = true)
    public List<NotificationVM> getFollowNotificationsForUser(String username,
                                                              Integer page,
                                                              Integer limit) {
        int size  = (limit == null || limit <= 0) ? DEFAULT_LIMIT : Math.min(limit, MAX_LIMIT);
        int pageNo = (page == null || page < 0) ? 0 : page;

        // Stabil sıralama: createdAt DESC, id DESC
        var sort = Sort.by(Sort.Order.desc("createdAt"), Sort.Order.desc("id"));

        var slice = notificationRepository.findByTargetUser_UsernameAndType(
                username, NotificationType.FOLLOW, PageRequest.of(pageNo, size, sort));

        return slice.getContent().stream().map(NotificationVM::new).toList();
    }
}
