package com.neurosync.kinemo.crisisalert.application.dto;

import com.neurosync.kinemo.crisisalert.domain.model.CrisisAlert;

public record ActivationReceipt(CrisisAlert alert, int queuedNotices) {}
