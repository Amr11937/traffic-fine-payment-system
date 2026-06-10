package com.trafficfines.backend.payment;

import com.trafficfines.backend.entity.FineStatus;
import com.trafficfines.backend.entity.Payment;
import com.trafficfines.backend.exception.AmountMismatchException;
import com.trafficfines.backend.exception.CategoryMismatchException;
import com.trafficfines.backend.exception.FineAlreadyPaidException;
import com.trafficfines.backend.exception.FineNotFoundException;
import com.trafficfines.backend.notification.NotificationService;
import com.trafficfines.backend.repository.PaymentRepository;
import com.trafficfines.backend.repository.TrafficFineRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final TrafficFineRepository trafficFineRepository;
    private final PaymentRepository paymentRepository;
    private final NotificationService notificationService;

    @Transactional
    public PaymentResponse processPayment(PaymentRequest req) {
        var fine = trafficFineRepository.findByFineReferenceNumber(req.referenceNumber())
            .orElseThrow(() -> new FineNotFoundException("Fine not found for reference: " + req.referenceNumber()));

        if (!fine.getFineCategory().getCode().equals(req.categoryCode())) {
            throw new CategoryMismatchException(
                "Category code '" + req.categoryCode() + "' does not match fine reference '" + req.referenceNumber() + "'"
            );
        }

        if (req.amount().compareTo(fine.getAmount()) != 0) {
            throw new AmountMismatchException(
                "Payment amount " + req.amount() + " does not match fine amount " + fine.getAmount()
            );
        }

        if (fine.getStatus() == FineStatus.PAID) {
            throw new FineAlreadyPaidException("Fine '" + req.referenceNumber() + "' has already been paid");
        }

        String transactionReference = "TXN-" + UUID.randomUUID().toString().toUpperCase();
        LocalDateTime now = LocalDateTime.now();

        paymentRepository.save(Payment.builder()
            .trafficFine(fine)
            .amount(fine.getAmount())
            .paymentMethod(req.paymentMethod())
            .transactionReference(transactionReference)
            .paidTimestamp(now)
            .build());

        fine.setStatus(FineStatus.PAID);
        fine.setPaidTimestamp(now);

        notificationService.sendPaymentConfirmation(
            fine.getIssuingOfficer().getPhoneNumber(),
            fine.getFineReferenceNumber()
        );

        return new PaymentResponse(transactionReference, fine.getFineReferenceNumber(), FineStatus.PAID.name(), now);
    }
}
