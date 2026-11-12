package com.neurosync.kinemo.crisisalert.domain.model;

import java.time.Instant;
import java.util.Objects;
import java.util.UUID;

/** Aggregate root of Crisis Alert Management. No framework dependencies. */
public record CrisisAlert(
        UUID id,
        String childId,
        String caregiverId,
        String description,
        AlertStatus status,
        Instant createdAt,
        Instant attendedAt,
        Instant closedAt,
        String attendedBy,
        String closedBy
) {
    public CrisisAlert {
        Objects.requireNonNull(id, "id");
        Objects.requireNonNull(childId, "childId");
        Objects.requireNonNull(caregiverId, "caregiverId");
        Objects.requireNonNull(description, "description");
        Objects.requireNonNull(status, "status");
        Objects.requireNonNull(createdAt, "createdAt");
    }

    public static CrisisAlert activate(String childId, String caregiverId,
                                       String description, Instant now) {
        if (childId == null || childId.isBlank() ||
            caregiverId == null || caregiverId.isBlank()) {
            throw new DomainRuleViolation("El niño y el cuidador son obligatorios.");
        }
        String cleanDescription = description == null ? "" : description.trim();
        if (cleanDescription.length() > 500) {
            throw new DomainRuleViolation("La descripción no puede superar 500 caracteres.");
        }
        return new CrisisAlert(UUID.randomUUID(), childId.trim(), caregiverId.trim(),
                cleanDescription, AlertStatus.ACTIVE, Objects.requireNonNull(now),
                null, null, null, null);
    }

    public CrisisAlert attend(String actorId, Instant now) {
        if (status != AlertStatus.ACTIVE) {
            throw new DomainRuleViolation("Solo puede atenderse una alerta activa.");
        }
        requireActor(actorId);
        return new CrisisAlert(id, childId, caregiverId, description, AlertStatus.ATTENDED,
                createdAt, Objects.requireNonNull(now), null, actorId, null);
    }

    public CrisisAlert close(String actorId, Instant now) {
        if (status != AlertStatus.ATTENDED) {
            throw new DomainRuleViolation("Debe atenderse la alerta antes de cerrarla.");
        }
        requireActor(actorId);
        return new CrisisAlert(id, childId, caregiverId, description, AlertStatus.CLOSED,
                createdAt, attendedAt, Objects.requireNonNull(now), attendedBy, actorId);
    }

    private static void requireActor(String actorId) {
        if (actorId == null || actorId.isBlank()) {
            throw new DomainRuleViolation("Se requiere un cuidador identificado.");
        }
    }
}
