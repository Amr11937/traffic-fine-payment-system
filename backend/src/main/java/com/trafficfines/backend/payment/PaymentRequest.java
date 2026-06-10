package com.trafficfines.backend.payment;

import java.math.BigDecimal;

public record PaymentRequest(
    String referenceNumber,
    String categoryCode,
    String paymentMethod,
    BigDecimal amount
) {}
