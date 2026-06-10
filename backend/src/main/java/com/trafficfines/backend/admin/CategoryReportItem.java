package com.trafficfines.backend.admin;

import java.math.BigDecimal;

public record CategoryReportItem(
    String categoryCode,
    String categoryDescription,
    BigDecimal totalCollected,
    Long paidCount
) {}
