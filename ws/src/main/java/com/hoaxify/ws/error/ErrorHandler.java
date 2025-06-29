package com.hoaxify.ws.error;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.time.LocalDateTime;

import com.hoaxify.ws.log.LogRecord;
import com.hoaxify.ws.log.LogRecordRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.error.ErrorAttributeOptions;
import org.springframework.boot.web.error.ErrorAttributeOptions.Include;
import org.springframework.boot.web.servlet.error.ErrorAttributes;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.WebRequest;

@RestController
public class ErrorHandler implements ErrorController {

    @Autowired
    private ErrorAttributes errorAttributes;

    @Autowired
    private LogRecordRepository logRecordRepository;

    @RequestMapping("/error")
    ApiError handleError(WebRequest webRequest) {
        Map<String, Object> attributes = this.errorAttributes.getErrorAttributes(
                webRequest,
                ErrorAttributeOptions.of(Include.MESSAGE, Include.BINDING_ERRORS)
        );

        String message = (String) attributes.get("message");
        String path = (String) attributes.get("path");
        int status = (int) attributes.get("status");

        ApiError error = new ApiError(status, message, path);

        if (attributes.containsKey("errors")) {
            @SuppressWarnings("unchecked")
            List<FieldError> fieldErrors = (List<FieldError>) attributes.get("errors");
            Map<String, String> validationErrors = new HashMap<>();
            for (FieldError fieldError : fieldErrors) {
                validationErrors.put(fieldError.getField(), fieldError.getDefaultMessage());
            }
            error.setValidationErrors(validationErrors);
        }
        try {
            LogRecord logRecord = new LogRecord();
            logRecord.setMethod("ERROR");
            logRecord.setUri(path);
            logRecord.setRequestBody(null);
            logRecord.setResponseBody(message + (error.getValidationErrors() != null ? " " + error.getValidationErrors().toString() : ""));
            logRecord.setStatus(status);
            logRecord.setDuration(0L);
            logRecord.setTimestamp(LocalDateTime.now());
            logRecord.setRemoteAddress(webRequest.getHeader("X-FORWARDED-FOR"));

            logRecordRepository.save(logRecord);
        } catch (Exception e) {
            // Burada log DB down olursa response bozulmasın
            e.printStackTrace();
        }

        return error;
    }

}
