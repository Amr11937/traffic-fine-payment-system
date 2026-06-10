package com.trafficfines.backend.exception;

public class FineNotFoundException extends RuntimeException {
    public FineNotFoundException(String message) {
        super(message);
    }
}
