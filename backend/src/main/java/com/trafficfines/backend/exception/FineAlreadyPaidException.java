package com.trafficfines.backend.exception;

public class FineAlreadyPaidException extends RuntimeException {
    public FineAlreadyPaidException(String message) {
        super(message);
    }
}
