package com.hoaxify.ws.notification;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import com.hoaxify.ws.shared.CurrentUserAnnotation;
import com.hoaxify.ws.user.User;

import java.util.List;

@RestController
@RequestMapping("/api/1.0/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public List<NotificationVM> getUserFollowNotifications(
            @CurrentUserAnnotation User loggedInUser,
            @RequestParam(name = "page",  required = false) Integer page,
            @RequestParam(name = "limit", required = false) Integer limit
    ) {
        return notificationService.getFollowNotificationsForUser(
                loggedInUser.getUsername(), page, limit);
    }
}
