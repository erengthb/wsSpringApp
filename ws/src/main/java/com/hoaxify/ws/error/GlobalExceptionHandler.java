package com.hoaxify.ws.error;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.hoaxify.ws.log.LogRecord;
import com.hoaxify.ws.log.LogRecordRepository;

import jakarta.servlet.http.HttpServletRequest;

@ControllerAdvice
public class GlobalExceptionHandler {

    private final LogRecordRepository logRecordRepository;
    private final MessageSource messageSource;

    public GlobalExceptionHandler(LogRecordRepository logRecordRepository, MessageSource messageSource) {
        this.logRecordRepository = logRecordRepository;
        this.messageSource = messageSource;
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleValidationExceptions(MethodArgumentNotValidException ex, HttpServletRequest request, Locale locale) {
        Map<String, String> validationErrors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error -> {
            // i18n mesajını al
            String localizedMessage = messageSource.getMessage(error, locale);
            validationErrors.put(error.getField(), localizedMessage);
        });

        logException(ex, request, HttpStatus.BAD_REQUEST.value(), validationErrors.toString());
        return ResponseEntity.badRequest().body(Map.of("validationErrors", validationErrors));
    }

    @Transactional
    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleAllExceptions(Exception ex, HttpServletRequest request) {
        logException(ex, request, HttpStatus.INTERNAL_SERVER_ERROR.value(), ex.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal Server Error");
    }

    private void logException(Exception ex, HttpServletRequest request, int status, String responseBody) {
        try {
            LogRecord log = new LogRecord();
            log.setMethod(request.getMethod());
            log.setUri(request.getRequestURI());
            log.setRequestBody("N/A");
            log.setResponseBody(responseBody);
            log.setStatus(status);
            log.setDuration(0L);
            log.setTimestamp(LocalDateTime.now());
            log.setRemoteAddress(request.getRemoteAddr());

            logRecordRepository.save(log);
        } catch (Exception loggingEx) {
            loggingEx.printStackTrace();
        }
    }
}
