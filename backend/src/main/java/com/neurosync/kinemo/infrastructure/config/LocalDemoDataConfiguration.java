package com.neurosync.kinemo.infrastructure.config;

import com.neurosync.kinemo.crisisalert.infrastructure.carenetwork.CaregiverAuthorizationJpaEntity;
import com.neurosync.kinemo.crisisalert.infrastructure.carenetwork.SpringDataCaregiverAuthorizationRepository;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

@Configuration
@Profile("local")
public class LocalDemoDataConfiguration {

    @Bean
    ApplicationRunner seedCareNetwork(SpringDataCaregiverAuthorizationRepository repository) {
        return args -> {
            if (!repository.existsById("demo-auth-001")) {
                repository.save(new CaregiverAuthorizationJpaEntity(
                        "demo-auth-001", "child-001", "caregiver-alert-001", "ACTIVE", null));
            }
            if (!repository.existsById("demo-auth-002")) {
                repository.save(new CaregiverAuthorizationJpaEntity(
                        "demo-auth-002", "child-001", "caregiver-alert-002", "ACTIVE", null));
            }
        };
    }
}
