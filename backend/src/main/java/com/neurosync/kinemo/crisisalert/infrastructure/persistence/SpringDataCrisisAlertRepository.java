package com.neurosync.kinemo.crisisalert.infrastructure.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface SpringDataCrisisAlertRepository extends JpaRepository<CrisisAlertJpaEntity, UUID> {
    List<CrisisAlertJpaEntity> findByChildIdOrderByCreatedAtDesc(String childId);
    boolean existsByChildIdAndOpenSlot(String childId, Integer openSlot);
}
