package com.hoaxify.ws.exception;

public class HoaxifyException extends Exception {
    public HoaxifyException(String message) {
        super(message);
    }

    public HoaxifyException(String message, Throwable cause) {
        super(message, cause);
    }
}

