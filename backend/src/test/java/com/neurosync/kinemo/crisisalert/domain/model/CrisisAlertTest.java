package com.neurosync.kinemo.crisisalert.domain.model;

import org.junit.jupiter.api.Test;
import java.time.Instant;
import static org.junit.jupiter.api.Assertions.*;

class CrisisAlertTest {
    private static final Instant NOW = Instant.parse("2026-11-11T12:00:00Z");

    @Test
    void createsActiveAlertAndMovesThroughLifecycle() {
        CrisisAlert alert = CrisisAlert.activate("child-001", "caregiver-alert-001",
                "Ruido fuerte", NOW);
        assertEquals(AlertStatus.ACTIVE, alert.status());
        assertNull(alert.attendedAt());

        CrisisAlert attended = alert.attend("caregiver-alert-002", NOW.plusSeconds(30));
        assertEquals(AlertStatus.ATTENDED, attended.status());
        assertEquals("caregiver-alert-002", attended.attendedBy());

        CrisisAlert closed = attended.close("caregiver-alert-001", NOW.plusSeconds(60));
        assertEquals(AlertStatus.CLOSED, closed.status());
        assertNotNull(closed.closedAt());
        assertEquals(AlertStatus.ACTIVE, alert.status()); // immutable aggregate snapshots
    }

    @Test
    void rejectsInvalidLifecycleTransitions() {
        CrisisAlert active = CrisisAlert.activate("child-001", "caregiver-alert-001", "", NOW);
        assertThrows(DomainRuleViolation.class,
                () -> active.close("caregiver-alert-001", NOW));
        CrisisAlert attended = active.attend("caregiver-alert-001", NOW);
        assertThrows(DomainRuleViolation.class,
                () -> attended.attend("caregiver-alert-001", NOW));
    }

    @Test
    void rejectsMissingCaregiverAndLongDescription() {
        assertThrows(DomainRuleViolation.class,
                () -> CrisisAlert.activate("child-001", "", "", NOW));
        assertThrows(DomainRuleViolation.class,
                () -> CrisisAlert.activate("child-001", "caregiver-alert-001",
                        "x".repeat(501), NOW));
    }
}
