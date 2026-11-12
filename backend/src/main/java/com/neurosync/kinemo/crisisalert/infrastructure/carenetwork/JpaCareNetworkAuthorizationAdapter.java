package com.neurosync.kinemo.crisisalert.infrastructure.carenetwork;

import com.neurosync.kinemo.crisisalert.application.port.CareNetworkAuthorizationPort;
import org.springframework.stereotype.Component;
import java.util.List;

@Component
public class JpaCareNetworkAuthorizationAdapter implements CareNetworkAuthorizationPort {
    private final SpringDataCaregiverAuthorizationRepository jpa;

    public JpaCareNetworkAuthorizationAdapter(SpringDataCaregiverAuthorizationRepository jpa) {
        this.jpa = jpa;
    }

    @Override
    public List<String> findAuthorizedCaregiverIds(String childId) {
        return jpa.findByChildIdAndStatusAndRevokedAtIsNull(childId, "ACTIVE").stream()
                .map(CaregiverAuthorizationJpaEntity::caregiverId).distinct().toList();
    }
}
