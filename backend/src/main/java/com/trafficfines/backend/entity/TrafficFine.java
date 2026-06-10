package com.trafficfines.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "traffic_fines")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class TrafficFine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String fineReferenceNumber;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "fine_category_id", nullable = false)
    private FineCategory fineCategory;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private FineStatus status;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "issuing_officer_id", nullable = false)
    private Officer issuingOfficer;

    @Column(nullable = false, length = 100)
    private String district;

    @Column(nullable = false, length = 50)
    private String driverLicenseNumber;

    @Column(nullable = false, length = 50)
    private String vehicleNumber;

    @Column(nullable = false)
    private LocalDateTime issuedTimestamp;

    @Column
    private LocalDateTime paidTimestamp;
}
