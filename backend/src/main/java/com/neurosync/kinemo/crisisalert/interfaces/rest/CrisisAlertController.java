package com.neurosync.kinemo.crisisalert.interfaces.rest;

import com.neurosync.kinemo.crisisalert.application.command.ActivateAlertCommand;
import com.neurosync.kinemo.crisisalert.application.command.ChangeAlertStatusCommand;
import com.neurosync.kinemo.crisisalert.application.handler.AlertCommandHandler;
import com.neurosync.kinemo.crisisalert.application.handler.AlertQueryHandler;
import com.neurosync.kinemo.crisisalert.application.query.AlertsForChildQuery;
import com.neurosync.kinemo.crisisalert.domain.model.AlertNotification;
import com.neurosync.kinemo.crisisalert.domain.model.CrisisAlert;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.security.Principal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/crisis-alerts")
public class CrisisAlertController {
    private final AlertCommandHandler commands;
    private final AlertQueryHandler queries;

    public CrisisAlertController(AlertCommandHandler commands, AlertQueryHandler queries) {
        this.commands = commands;
        this.queries = queries;
    }

    public record ActivateRequest(
            @NotBlank @Size(max = 80) String childId,
            @Size(max = 500) String description
    ) {}

    public record CrisisAlertResponse(
            UUID id, String childId, String caregiverId, String description,
            String status, Instant createdAt, Instant attendedAt, Instant closedAt,
            String attendedById, String closedById
    ) {
        static CrisisAlertResponse from(CrisisAlert alert) {
            return new CrisisAlertResponse(alert.id(), alert.childId(), alert.caregiverId(),
                    alert.description(), alert.status().name(), alert.createdAt(),
                    alert.attendedAt(), alert.closedAt(), alert.attendedBy(), alert.closedBy());
        }
    }

    public record ActivationResponse(CrisisAlertResponse alert, int queuedNotices) {}

    @PostMapping
    public ResponseEntity<ActivationResponse> activate(
            @Valid @RequestBody ActivateRequest request, Principal principal) {
        var result = commands.handle(
                new ActivateAlertCommand(request.childId(), request.description()),
                principal.getName()
        );
        return ResponseEntity.created(URI.create("/api/v1/crisis-alerts/" + result.alert().id()))
                .body(new ActivationResponse(CrisisAlertResponse.from(result.alert()),
                        result.queuedNotices()));
    }

    @GetMapping
    public List<CrisisAlertResponse> listByChild(
            @RequestParam String childId, Principal principal) {
        return queries.handle(new AlertsForChildQuery(childId), principal.getName()).stream()
                .map(CrisisAlertResponse::from).toList();
    }

    @PatchMapping("/{alertId}/attend")
    public CrisisAlertResponse attend(@PathVariable UUID alertId, Principal principal) {
        return CrisisAlertResponse.from(
                commands.attend(new ChangeAlertStatusCommand(alertId), principal.getName()));
    }

    @PatchMapping("/{alertId}/close")
    public CrisisAlertResponse close(@PathVariable UUID alertId, Principal principal) {
        return CrisisAlertResponse.from(
                commands.close(new ChangeAlertStatusCommand(alertId), principal.getName()));
    }

    @GetMapping("/notifications")
    public List<AlertNotification> myNotifications(Principal principal) {
        // The recipient is always derived from the authenticated principal.
        return queries.inbox(principal.getName());
    }
}
