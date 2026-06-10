package com.trafficfines.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "officers")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Officer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, unique = true, length = 20)
    private String badgeNumber;

    @Column(nullable = false, length = 20)
    private String phoneNumber;

    @Column(nullable = false, length = 100)
    private String district;
}
