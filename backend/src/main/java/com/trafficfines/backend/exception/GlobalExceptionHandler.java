package com.trafficfines.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(FineNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ErrorResponse handleFineNotFound(FineNotFoundException e) {
        return new ErrorResponse(e.getMessage(), "FINE_NOT_FOUND");
    }

    @ExceptionHandler(CategoryMismatchException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleCategoryMismatch(CategoryMismatchException e) {
        return new ErrorResponse(e.getMessage(), "CATEGORY_MISMATCH");
    }

    @ExceptionHandler(AmountMismatchException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleAmountMismatch(AmountMismatchException e) {
        return new ErrorResponse(e.getMessage(), "AMOUNT_MISMATCH");
    }

    @ExceptionHandler(FineAlreadyPaidException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public ErrorResponse handleFineAlreadyPaid(FineAlreadyPaidException e) {
        return new ErrorResponse(e.getMessage(), "FINE_ALREADY_PAID");
    }
}
