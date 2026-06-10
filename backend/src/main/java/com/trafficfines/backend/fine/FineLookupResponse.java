package com.trafficfines.backend.fine;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record FineLookupResponse(
    String referenceNumber,
    String categoryCode,
    String categoryDescription,
    BigDecimal amount,
    String status,
    String vehicleNumber,
    LocalDateTime issuedAt
) {}
