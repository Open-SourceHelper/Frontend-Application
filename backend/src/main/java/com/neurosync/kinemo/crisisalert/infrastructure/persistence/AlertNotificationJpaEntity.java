package com.neurosync.kinemo.crisisalert.infrastructure.persistence;

import com.neurosync.kinemo.crisisalert.domain.model.AlertNotification;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "crisis_alert_notifications")
public class AlertNotificationJpaEntity {
    @Id
    private UUID id;

    @Column(name = "alert_id", nullable = false)
    private UUID alertId;

    @Column(name = "child_id", nullable = false, length = 80)
    private String childId;

    @Column(name = "recipient_caregiver_id", nullable = false, length = 80)
    private String recipientCaregiverId;

    @Column(nullable = false, length = 20)
    private String channel;

    @Column(nullable = false, length = 20)
    private String status;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    protected AlertNotificationJpaEntity() {}

    public static AlertNotificationJpaEntity fromDomain(AlertNotification domain) {
        AlertNotificationJpaEntity entity = new AlertNotificationJpaEntity();
        entity.id = domain.id();
        entity.alertId = domain.alertId();
        entity.childId = domain.childId();
        entity.recipientCaregiverId = domain.recipientCaregiverId();
        entity.channel = domain.channel();
        entity.status = domain.status();
        entity.createdAt = domain.createdAt();
        return entity;
    }

    public AlertNotification toDomain() {
        return new AlertNotification(id, alertId, childId, recipientCaregiverId,
                channel, status, createdAt);
    }
}
