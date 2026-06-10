package com.trafficfines.backend.repository;

import com.trafficfines.backend.admin.CategoryReportItem;
import com.trafficfines.backend.admin.DistrictReportItem;
import com.trafficfines.backend.entity.FineStatus;
import com.trafficfines.backend.entity.TrafficFine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface TrafficFineRepository extends JpaRepository<TrafficFine, Long> {

    Optional<TrafficFine> findByFineReferenceNumber(String fineReferenceNumber);

    @Query("""
        SELECT new com.trafficfines.backend.admin.DistrictReportItem(
            tf.district, SUM(tf.amount), COUNT(tf))
        FROM TrafficFine tf
        WHERE tf.status = com.trafficfines.backend.entity.FineStatus.PAID
        GROUP BY tf.district
        ORDER BY SUM(tf.amount) DESC
        """)
    List<DistrictReportItem> findCollectionsByDistrict();

    @Query("""
        SELECT new com.trafficfines.backend.admin.CategoryReportItem(
            tf.fineCategory.code, tf.fineCategory.description, SUM(tf.amount), COUNT(tf))
        FROM TrafficFine tf
        WHERE tf.status = com.trafficfines.backend.entity.FineStatus.PAID
        GROUP BY tf.fineCategory.code, tf.fineCategory.description
        ORDER BY SUM(tf.amount) DESC
        """)
    List<CategoryReportItem> findCollectionsByCategory();

    @Query("SELECT COALESCE(SUM(tf.amount), 0) FROM TrafficFine tf WHERE tf.status = com.trafficfines.backend.entity.FineStatus.PAID")
    BigDecimal sumCollectedAmount();

    @Query("SELECT COUNT(tf) FROM TrafficFine tf WHERE tf.status = com.trafficfines.backend.entity.FineStatus.PAID")
    Long countPaidFines();

    @Query("SELECT COUNT(tf) FROM TrafficFine tf WHERE tf.status = com.trafficfines.backend.entity.FineStatus.UNPAID")
    Long countUnpaidFines();
}
