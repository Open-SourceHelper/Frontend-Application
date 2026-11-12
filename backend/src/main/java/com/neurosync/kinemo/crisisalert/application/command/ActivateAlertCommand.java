package com.neurosync.kinemo.crisisalert.application.command;

/** CQRS command - write intent only, independent of HTTP. */
public record ActivateAlertCommand(String childId, String description) {}
