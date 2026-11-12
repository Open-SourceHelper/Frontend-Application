package com.neurosync.kinemo.crisisalert.infrastructure.carenetwork;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SpringDataCaregiverAuthorizationRepository
        extends JpaRepository<CaregiverAuthorizationJpaEntity, String> {
    List<CaregiverAuthorizationJpaEntity> findByChildIdAndStatusAndRevokedAtIsNull(
            String childId, String status
    );
}
