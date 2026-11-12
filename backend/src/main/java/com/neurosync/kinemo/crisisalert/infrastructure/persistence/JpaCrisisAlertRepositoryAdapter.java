package com.neurosync.kinemo.crisisalert.infrastructure.persistence;

import com.neurosync.kinemo.crisisalert.domain.model.CrisisAlert;
import com.neurosync.kinemo.crisisalert.domain.repository.CrisisAlertRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public class JpaCrisisAlertRepositoryAdapter implements CrisisAlertRepository {
    private final SpringDataCrisisAlertRepository jpa;

    public JpaCrisisAlertRepositoryAdapter(SpringDataCrisisAlertRepository jpa) {
        this.jpa = jpa;
    }

    @Override
    public Optional<CrisisAlert> findById(UUID id) {
        return jpa.findById(id).map(CrisisAlertJpaEntity::toDomain);
    }

    @Override
    public List<CrisisAlert> findByChildId(String childId) {
        return jpa.findByChildIdOrderByCreatedAtDesc(childId).stream()
                .map(CrisisAlertJpaEntity::toDomain).toList();
    }

    @Override
    public boolean existsOpenAlert(String childId) {
        return jpa.existsByChildIdAndOpenSlot(childId, 1);
    }

    @Override
    public CrisisAlert save(CrisisAlert alert) {
        CrisisAlertJpaEntity entity = jpa.findById(alert.id())
                .orElseGet(() -> CrisisAlertJpaEntity.fromDomain(alert));
        entity.apply(alert);
        return jpa.saveAndFlush(entity).toDomain();
    }
}
