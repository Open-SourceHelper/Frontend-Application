package com.neurosync.kinemo.crisisalert.infrastructure.persistence;

import com.neurosync.kinemo.crisisalert.domain.model.AlertNotification;
import com.neurosync.kinemo.crisisalert.domain.repository.AlertNotificationRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public class JpaAlertNotificationRepositoryAdapter implements AlertNotificationRepository {
    private final SpringDataAlertNotificationRepository jpa;

    public JpaAlertNotificationRepositoryAdapter(SpringDataAlertNotificationRepository jpa) {
        this.jpa = jpa;
    }

    @Override
    public AlertNotification queue(AlertNotification notification) {
        return jpa.save(AlertNotificationJpaEntity.fromDomain(notification)).toDomain();
    }

    @Override
    public List<AlertNotification> findByRecipient(String caregiverId) {
        return jpa.findByRecipientCaregiverIdOrderByCreatedAtDesc(caregiverId)
                .stream().map(AlertNotificationJpaEntity::toDomain).toList();
    }
}
