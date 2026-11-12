package com.neurosync.kinemo.crisisalert.infrastructure.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface SpringDataAlertNotificationRepository
        extends JpaRepository<AlertNotificationJpaEntity, UUID> {
    List<AlertNotificationJpaEntity> findByRecipientCaregiverIdOrderByCreatedAtDesc(
            String recipientCaregiverId
    );
}
