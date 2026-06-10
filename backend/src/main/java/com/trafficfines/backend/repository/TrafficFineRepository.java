package com.trafficfines.backend.repository;

import com.trafficfines.backend.entity.TrafficFine;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TrafficFineRepository extends JpaRepository<TrafficFine, Long> {
    Optional<TrafficFine> findByFineReferenceNumber(String fineReferenceNumber);
}
