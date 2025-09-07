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

    // Bildirim oluşturma (sadece FOLLOW tipi destekleniyor)
    public void createFollowNotification(User targetUser, User triggeredBy) {
        if (targetUser.getUsername().equals(triggeredBy.getUsername())) return; 

        Notification notification = Notification.builder()
                .targetUser(targetUser)
                .triggeredBy(triggeredBy)
                .type(NotificationType.FOLLOW)
                .createdAt(LocalDateTime.now())
                .build();

        notificationRepository.save(notification);
    }

    // Kullanıcıya gelen FOLLOW tipi bildirimleri getir
    public List<NotificationVM> getFollowNotificationsForUser(String username) {
        User user = userRepository.findByUsername(username);

        List<Notification> notifications = notificationRepository.findByTargetUserAndTypeOrderByCreatedAtDesc(user, NotificationType.FOLLOW);

        return notifications.stream()
                .map(NotificationVM::new)
                .collect(Collectors.toList());
    }
}

