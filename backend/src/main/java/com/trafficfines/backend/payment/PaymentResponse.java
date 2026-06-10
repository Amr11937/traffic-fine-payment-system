package com.trafficfines.backend.payment;

import java.time.LocalDateTime;

public record PaymentResponse(
    String transactionReference,
    String referenceNumber,
    String status,
    LocalDateTime paidAt
) {}
