package com.trafficfines.backend.fine;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/fines")
@RequiredArgsConstructor
public class FineController {

    private final FineService fineService;

    @GetMapping("/lookup")
    public ResponseEntity<FineLookupResponse> lookup(
            @RequestParam String referenceNumber,
            @RequestParam String categoryCode) {
        return ResponseEntity.ok(fineService.lookupFine(referenceNumber, categoryCode));
    }
}
