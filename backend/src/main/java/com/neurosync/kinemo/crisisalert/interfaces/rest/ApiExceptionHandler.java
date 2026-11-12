package com.neurosync.kinemo.crisisalert.interfaces.rest;

import com.neurosync.kinemo.crisisalert.application.UseCaseException;
import com.neurosync.kinemo.crisisalert.domain.model.DomainRuleViolation;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.Instant;

@RestControllerAdvice
public class ApiExceptionHandler {
    public record ErrorResponse(String code, String message, Instant timestamp) {}

    @ExceptionHandler(UseCaseException.class)
    public ResponseEntity<ErrorResponse> useCase(UseCaseException ex) {
        HttpStatus status = switch (ex.code()) {
            case "ACCESS_DENIED" -> HttpStatus.FORBIDDEN;
            case "ALERT_NOT_FOUND" -> HttpStatus.NOT_FOUND;
            case "ALERT_ALREADY_OPEN" -> HttpStatus.CONFLICT;
            default -> HttpStatus.BAD_REQUEST;
        };
        return error(status, ex.code(), ex.getMessage());
    }

    @ExceptionHandler(DomainRuleViolation.class)
    public ResponseEntity<ErrorResponse> domain(DomainRuleViolation ex) {
        return error(HttpStatus.CONFLICT, "DOMAIN_RULE_VIOLATION", ex.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> validation(MethodArgumentNotValidException ex) {
        return error(HttpStatus.BAD_REQUEST, "VALIDATION_ERROR",
                "Revisa los campos de la solicitud.");
    }

    @ExceptionHandler({DataIntegrityViolationException.class,
            ObjectOptimisticLockingFailureException.class})
    public ResponseEntity<ErrorResponse> concurrency(Exception ex) {
        return error(HttpStatus.CONFLICT, "CONFLICT",
                "La alerta cambió o ya existe otra alerta abierta. Actualiza y vuelve a intentar.");
    }

    private ResponseEntity<ErrorResponse> error(HttpStatus status, String code, String message) {
        return ResponseEntity.status(status)
                .body(new ErrorResponse(code, message, Instant.now()));
    }
}
