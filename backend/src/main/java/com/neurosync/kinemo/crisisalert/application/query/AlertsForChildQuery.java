package com.neurosync.kinemo.crisisalert.application.query;

/** CQRS query - does not mutate the domain. */
public record AlertsForChildQuery(String childId) {}
