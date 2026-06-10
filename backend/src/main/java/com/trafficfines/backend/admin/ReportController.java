package com.trafficfines.backend.admin;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/by-district")
    public ResponseEntity<List<DistrictReportItem>> byDistrict() {
        return ResponseEntity.ok(reportService.byDistrict());
    }

    @GetMapping("/by-category")
    public ResponseEntity<List<CategoryReportItem>> byCategory() {
        return ResponseEntity.ok(reportService.byCategory());
    }

    @GetMapping("/summary")
    public ResponseEntity<SummaryReport> summary() {
        return ResponseEntity.ok(reportService.summary());
    }
}
