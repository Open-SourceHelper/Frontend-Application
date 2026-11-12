package com.neurosync.kinemo.crisisalert.domain.repository;

import com.neurosync.kinemo.crisisalert.domain.model.AlertNotification;
import java.util.List;

public interface AlertNotificationRepository {
    AlertNotification queue(AlertNotification notification);
    List<AlertNotification> findByRecipient(String caregiverId);
}
