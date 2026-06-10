package com.trafficfines.backend.fine;

import com.trafficfines.backend.exception.CategoryMismatchException;
import com.trafficfines.backend.exception.FineNotFoundException;
import com.trafficfines.backend.repository.TrafficFineRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class FineService {

    private final TrafficFineRepository trafficFineRepository;

    @Transactional(readOnly = true)
    public FineLookupResponse lookupFine(String referenceNumber, String categoryCode) {
        var fine = trafficFineRepository.findByFineReferenceNumber(referenceNumber)
            .orElseThrow(() -> new FineNotFoundException("Fine not found for reference: " + referenceNumber));

        if (!fine.getFineCategory().getCode().equals(categoryCode)) {
            throw new CategoryMismatchException(
                "Category code '" + categoryCode + "' does not match fine reference '" + referenceNumber + "'"
            );
        }

        return new FineLookupResponse(
            fine.getFineReferenceNumber(),
            fine.getFineCategory().getCode(),
            fine.getFineCategory().getDescription(),
            fine.getAmount(),
            fine.getStatus().name(),
            fine.getVehicleNumber(),
            fine.getIssuedTimestamp()
        );
    }
}
