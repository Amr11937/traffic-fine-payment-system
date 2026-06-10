package com.trafficfines.backend.admin;

import java.math.BigDecimal;

public record DistrictReportItem(String district, BigDecimal totalCollected, Long paidCount) {}
