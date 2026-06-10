package com.trafficfines.backend.notification;

public interface NotificationService {
    void sendPaymentConfirmation(String officerPhone, String fineRef);
}
