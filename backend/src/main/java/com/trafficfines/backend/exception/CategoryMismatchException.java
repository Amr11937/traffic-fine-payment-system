package com.trafficfines.backend.exception;

public class CategoryMismatchException extends RuntimeException {
    public CategoryMismatchException(String message) {
        super(message);
    }
}
