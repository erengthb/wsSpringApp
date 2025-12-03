package com.hoaxify.admin;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.FORBIDDEN)
public class AdminAccessDeniedException extends RuntimeException {

    public AdminAccessDeniedException() {
        super("Admin yetkisi gerekiyor");
    }
}
