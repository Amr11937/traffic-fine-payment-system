package com.trafficfines.backend.admin;

import com.trafficfines.backend.repository.TrafficFineRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final TrafficFineRepository trafficFineRepository;

    @Transactional(readOnly = true)
    public List<DistrictReportItem> byDistrict() {
        return trafficFineRepository.findCollectionsByDistrict();
    }

    @Transactional(readOnly = true)
    public List<CategoryReportItem> byCategory() {
        return trafficFineRepository.findCollectionsByCategory();
    }

    @Transactional(readOnly = true)
    public SummaryReport summary() {
        return new SummaryReport(
            trafficFineRepository.sumCollectedAmount(),
            trafficFineRepository.countPaidFines(),
            trafficFineRepository.countUnpaidFines()
        );
    }
}
