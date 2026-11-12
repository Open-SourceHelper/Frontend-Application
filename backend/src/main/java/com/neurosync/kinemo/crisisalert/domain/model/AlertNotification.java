package com.neurosync.kinemo.crisisalert.domain.model;

import java.time.Instant;
import java.util.UUID;

/** Internal queued notice, NOT a delivered SMS/push notification. */
public record AlertNotification(
        UUID id,
        UUID alertId,
        String childId,
        String recipientCaregiverId,
        String channel,
        String status,
        Instant createdAt
) {
    public static AlertNotification queue(UUID alertId, String childId,
                                          String recipientCaregiverId, Instant now) {
        return new AlertNotification(UUID.randomUUID(), alertId, childId,
                recipientCaregiverId, "IN_APP", "QUEUED", now);
    }
}
