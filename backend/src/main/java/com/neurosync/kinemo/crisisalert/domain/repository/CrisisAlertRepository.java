package com.neurosync.kinemo.crisisalert.domain.repository;

import com.neurosync.kinemo.crisisalert.domain.model.CrisisAlert;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CrisisAlertRepository {
    Optional<CrisisAlert> findById(UUID id);
    List<CrisisAlert> findByChildId(String childId);
    boolean existsOpenAlert(String childId);
    CrisisAlert save(CrisisAlert alert);
}
