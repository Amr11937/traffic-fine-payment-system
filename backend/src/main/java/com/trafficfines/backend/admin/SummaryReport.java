package com.trafficfines.backend.admin;

import java.math.BigDecimal;

public record SummaryReport(BigDecimal totalCollected, Long paidCount, Long unpaidCount) {}
