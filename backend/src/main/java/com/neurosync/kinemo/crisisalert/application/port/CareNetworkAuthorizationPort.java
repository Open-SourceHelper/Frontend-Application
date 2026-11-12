package com.neurosync.kinemo.crisisalert.application.port;

import java.util.List;

/**
 * Anti-corruption boundary with BC02 (Care Network).
 * BC03 depends on this contract, not on BC02 persistence internals.
 */
public interface CareNetworkAuthorizationPort {
    List<String> findAuthorizedCaregiverIds(String childId);
}
