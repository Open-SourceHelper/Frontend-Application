package com.neurosync.kinemo.crisisalert.domain.model;

/** Domain failure: independent of HTTP, Spring and persistence. */
public class DomainRuleViolation extends RuntimeException {
    public DomainRuleViolation(String message) {
        super(message);
    }
}
