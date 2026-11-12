package com.neurosync.kinemo.crisisalert.infrastructure.carenetwork;

import jakarta.persistence.*;
import java.time.Instant;

/** Local adapter fixture. Real BC02 access will replace this table adapter. */
@Entity
@Table(name = "caregiver_authorizations",
        indexes = @Index(name = "idx_auth_by_child", columnList = "child_id"))
public class CaregiverAuthorizationJpaEntity {
    @Id
    @Column(length = 100)
    private String id;

    @Column(name = "child_id", nullable = false, length = 80)
    private String childId;

    @Column(name = "caregiver_id", nullable = false, length = 80)
    private String caregiverId;

    @Column(nullable = false, length = 16)
    private String status;

    @Column(name = "revoked_at")
    private Instant revokedAt;

    protected CaregiverAuthorizationJpaEntity() {}

    public CaregiverAuthorizationJpaEntity(String id, String childId,
                                           String caregiverId, String status, Instant revokedAt) {
        this.id = id;
        this.childId = childId;
        this.caregiverId = caregiverId;
        this.status = status;
        this.revokedAt = revokedAt;
    }

    public String caregiverId() {
        return caregiverId;
    }
}
