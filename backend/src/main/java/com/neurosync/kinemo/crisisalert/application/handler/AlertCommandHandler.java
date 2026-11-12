package com.neurosync.kinemo.crisisalert.application.handler;

import com.neurosync.kinemo.crisisalert.application.UseCaseException;
import com.neurosync.kinemo.crisisalert.application.command.ActivateAlertCommand;
import com.neurosync.kinemo.crisisalert.application.command.ChangeAlertStatusCommand;
import com.neurosync.kinemo.crisisalert.application.dto.ActivationReceipt;
import com.neurosync.kinemo.crisisalert.application.port.CareNetworkAuthorizationPort;
import com.neurosync.kinemo.crisisalert.domain.model.AlertNotification;
import com.neurosync.kinemo.crisisalert.domain.model.CrisisAlert;
import com.neurosync.kinemo.crisisalert.domain.repository.AlertNotificationRepository;
import com.neurosync.kinemo.crisisalert.domain.repository.CrisisAlertRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
public class AlertCommandHandler {
    private final CrisisAlertRepository alerts;
    private final AlertNotificationRepository notifications;
    private final CareNetworkAuthorizationPort careNetwork;

    public AlertCommandHandler(CrisisAlertRepository alerts,
                               AlertNotificationRepository notifications,
                               CareNetworkAuthorizationPort careNetwork) {
        this.alerts = alerts;
        this.notifications = notifications;
        this.careNetwork = careNetwork;
    }

    @Transactional
    public ActivationReceipt handle(ActivateAlertCommand command, String actorId) {
        if (command.childId() == null || command.childId().isBlank()) {
            throw new UseCaseException("INVALID_REQUEST", "El perfil del niño es obligatorio.");
        }
        String childId = command.childId().trim();
        List<String> authorizedCaregivers = requireAuthorization(childId, actorId);

        if (alerts.existsOpenAlert(childId)) {
            throw new UseCaseException("ALERT_ALREADY_OPEN",
                    "Ya existe una alerta sin cerrar para este niño.");
        }

        CrisisAlert saved = alerts.save(
                CrisisAlert.activate(childId, actorId, command.description(), Instant.now())
        );
        int count = 0;
        for (String recipient : authorizedCaregivers.stream().distinct().toList()) {
            if (!recipient.equals(actorId)) {
                notifications.queue(AlertNotification.queue(saved.id(), saved.childId(),
                        recipient, Instant.now()));
                count++;
            }
        }
        return new ActivationReceipt(saved, count);
    }

    @Transactional
    public CrisisAlert attend(ChangeAlertStatusCommand command, String actorId) {
        CrisisAlert alert = authorizedAlert(command, actorId);
        return alerts.save(alert.attend(actorId, Instant.now()));
    }

    @Transactional
    public CrisisAlert close(ChangeAlertStatusCommand command, String actorId) {
        CrisisAlert alert = authorizedAlert(command, actorId);
        return alerts.save(alert.close(actorId, Instant.now()));
    }

    private CrisisAlert authorizedAlert(ChangeAlertStatusCommand command, String actorId) {
        CrisisAlert alert = alerts.findById(command.alertId()).orElseThrow(
                () -> new UseCaseException("ALERT_NOT_FOUND", "La alerta no existe.")
        );
        requireAuthorization(alert.childId(), actorId);
        return alert;
    }

    private List<String> requireAuthorization(String childId, String actorId) {
        List<String> ids = careNetwork.findAuthorizedCaregiverIds(childId);
        if (actorId == null || !ids.contains(actorId)) {
            throw new UseCaseException("ACCESS_DENIED",
                    "Este cuidador no tiene autorización vigente para el niño.");
        }
        return ids;
    }
}
