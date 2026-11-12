package com.neurosync.kinemo.crisisalert.application.command;

import java.util.UUID;

/** CQRS command: authenticated actor comes from the service call. */
public record ChangeAlertStatusCommand(UUID alertId) {}
