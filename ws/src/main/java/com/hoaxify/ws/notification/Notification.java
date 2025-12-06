package com.hoaxify.ws.notification;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

import com.hoaxify.ws.user.User;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
@Table(
    name = "notification",
    indexes = {
        @Index(name = "idx_notification_target_type_created", columnList = "target_user_id,type,created_at"),
        @Index(name = "idx_notification_created_at", columnList = "created_at")
    }
)
public class Notification {

    @Id
    @SequenceGenerator(name = "notification_seq", sequenceName = "notification_seq", allocationSize = 50)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "notification_seq")
    private Long id;

    // hedef kullanıcıyı LAZY bırakıyoruz ama sorguda EntityGraph kullanacağız (aşağıda).
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "target_user_id", nullable = false)
    private User targetUser;

    // tetikleyen kullanıcıyı da LAZY bırakıyoruz; VM'e maplerken N+1 olmasın diye repository'de join fetch kullanıyoruz.
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "triggered_by_id", nullable = false)
    private User triggeredBy;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private NotificationType type;

    @Column(name = "reference_id")
    private Long referenceId;

    @Column(columnDefinition = "TEXT")
    private String message;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

@Column(nullable = false)
@Builder.Default
private boolean read = false;

    @PrePersist
    private void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}
