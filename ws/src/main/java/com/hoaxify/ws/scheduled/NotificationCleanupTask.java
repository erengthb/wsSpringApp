package com.hoaxify.ws.scheduled;

import java.time.LocalDateTime;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.hoaxify.ws.notification.NotificationRepository;

@Component
public class NotificationCleanupTask {

    private final NotificationRepository notificationRepository;

    public NotificationCleanupTask(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    @Transactional
    @Scheduled(cron = "0 0 3 * * *", zone = "Europe/Istanbul")
    public void cleanupOlderThanAWeek() {
        LocalDateTime threshold = LocalDateTime.now().minusDays(7);
        notificationRepository.deleteByCreatedAtBefore(threshold);
    }
}
