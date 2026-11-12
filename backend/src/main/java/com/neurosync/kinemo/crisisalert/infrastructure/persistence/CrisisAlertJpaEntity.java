package com.neurosync.kinemo.crisisalert.infrastructure.persistence;

import com.neurosync.kinemo.crisisalert.domain.model.AlertStatus;
import com.neurosync.kinemo.crisisalert.domain.model.CrisisAlert;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "crisis_alerts",
        uniqueConstraints = @UniqueConstraint(name = "uq_open_alert_per_child",
                columnNames = {"child_id", "open_slot"}))
public class CrisisAlertJpaEntity {
    @Id
    private UUID id;

    @Version
    private Long version;

    @Column(name = "child_id", nullable = false, length = 80)
    private String childId;

    @Column(name = "caregiver_id", nullable = false, length = 80)
    private String caregiverId;

    @Column(length = 500, nullable = false)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private AlertStatus status;

    // ACTIVE / ATTENDED = 1, CLOSED = NULL.
    // The composite unique constraint prevents two open alerts for one child.
    @Column(name = "open_slot")
    private Integer openSlot;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "attended_at")
    private Instant attendedAt;

    @Column(name = "closed_at")
    private Instant closedAt;

    @Column(name = "attended_by", length = 80)
    private String attendedBy;

    @Column(name = "closed_by", length = 80)
    private String closedBy;

    protected CrisisAlertJpaEntity() {}

    public static CrisisAlertJpaEntity fromDomain(CrisisAlert domain) {
        CrisisAlertJpaEntity entity = new CrisisAlertJpaEntity();
        entity.apply(domain);
        return entity;
    }

    public void apply(CrisisAlert domain) {
        id = domain.id();
        childId = domain.childId();
        caregiverId = domain.caregiverId();
        description = domain.description();
        status = domain.status();
        openSlot = domain.status() == AlertStatus.CLOSED ? null : 1;
        createdAt = domain.createdAt();
        attendedAt = domain.attendedAt();
        closedAt = domain.closedAt();
        attendedBy = domain.attendedBy();
        closedBy = domain.closedBy();
    }

    public CrisisAlert toDomain() {
        return new CrisisAlert(id, childId, caregiverId, description,
                status, createdAt, attendedAt, closedAt, attendedBy, closedBy);
    }
}
