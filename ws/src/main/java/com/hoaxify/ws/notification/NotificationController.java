package com.hoaxify.ws.notification;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import com.hoaxify.ws.shared.CurrentUserAnnotation;
import com.hoaxify.ws.user.User;
import com.hoaxify.ws.user.UserService;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/1.0/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping
    public List<NotificationVM> getUserNotifications(@CurrentUserAnnotation User loggedInUser) {
        return notificationService.getNotificationsForUser(loggedInUser.getUsername());
    }
}

