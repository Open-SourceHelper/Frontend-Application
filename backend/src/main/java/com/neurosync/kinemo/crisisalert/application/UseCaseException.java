package com.neurosync.kinemo.crisisalert.application;

public class UseCaseException extends RuntimeException {
    private final String code;

    public UseCaseException(String code, String message) {
        super(message);
        this.code = code;
    }

    public String code() {
        return code;
    }
}
