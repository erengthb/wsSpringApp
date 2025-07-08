package com.hoaxify.ws.notification;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.hoaxify.ws.user.User;
import com.hoaxify.ws.user.UserRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public void createNotification(User targetUser, User triggeredBy, NotificationType type) {
        if (targetUser.getUsername().equals(triggeredBy.getUsername())) return; // Kendi kendini tetikleme

        Notification notification = Notification.builder()
                .targetUser(targetUser)
                .triggeredBy(triggeredBy)
                .type(type)
                .createdAt(LocalDateTime.now())
                .build();

        notificationRepository.save(notification);
    }

    public List<NotificationVM> getNotificationsForUser(String username) {
        User user = userRepository.findByUsername(username);
    
        List<Notification> notifications = notificationRepository
            .findByTargetUserOrTriggeredByOrderByCreatedAtDesc(user, user);
    
        return notifications.stream()
            .map(NotificationVM::new)
            .collect(Collectors.toList());
    }
    
}
