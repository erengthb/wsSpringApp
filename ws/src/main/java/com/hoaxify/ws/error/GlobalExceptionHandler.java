
package com.hoaxify.ws.error;

import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.hoaxify.ws.log.LogRecord;
import com.hoaxify.ws.log.LogRecordRepository;

import org.springframework.http.ResponseEntity;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;

@ControllerAdvice
public class GlobalExceptionHandler {

    @Autowired
    private LogRecordRepository logRecordRepository;

    @Transactional
    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleAllExceptions(Exception ex, HttpServletRequest request) {
        // Log kaydı oluştur
        LogRecord log = new LogRecord();
        log.setMethod(request.getMethod());
        log.setUri(request.getRequestURI());
        log.setRequestBody("N/A"); // İstersen request body almak için ekstra sarıcılar ekle
        log.setResponseBody(ex.getMessage());
        log.setStatus(500);
        log.setDuration(0L);
        log.setTimestamp(LocalDateTime.now());
        log.setRemoteAddress(request.getRemoteAddr());

        logRecordRepository.save(log);

        // İstersen standart hata yanıtı dön
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal Server Error");
    }
}
