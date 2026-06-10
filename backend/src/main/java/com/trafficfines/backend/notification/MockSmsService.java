package com.trafficfines.backend.notification;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class MockSmsService implements NotificationService {

    @Override
    public void sendPaymentConfirmation(String officerPhone, String fineRef) {
        log.info("SMS sent to officer {}: fine {} paid", officerPhone, fineRef);
    }
}
