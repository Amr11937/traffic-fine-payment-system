package com.trafficfines.backend.exception;

public class AmountMismatchException extends RuntimeException {
    public AmountMismatchException(String message) {
        super(message);
    }
}
