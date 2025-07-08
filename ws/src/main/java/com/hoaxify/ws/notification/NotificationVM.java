
package com.hoaxify.ws.notification;

import lombok.Data;
import java.time.LocalDateTime;

import com.hoaxify.ws.user.vm.UserVM;

@Data
public class NotificationVM {
    private Long id;
    private String type;
    private boolean read;
    private LocalDateTime createdAt;
    private UserVM triggeredBy;

    public NotificationVM(Notification notification) {
        this.id = notification.getId();
        this.type = notification.getType().name();
        this.read = notification.isRead();
        this.createdAt = notification.getCreatedAt();
        this.triggeredBy = new UserVM(notification.getTriggeredBy());
    }
}
