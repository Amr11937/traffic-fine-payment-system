package com.trafficfines.backend.config;

import com.trafficfines.backend.entity.AdminUser;
import com.trafficfines.backend.repository.AdminUserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final AdminUserRepository adminUserRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (adminUserRepository.count() == 0) {
            adminUserRepository.save(AdminUser.builder()
                .username("admin")
                .passwordHash(passwordEncoder.encode("admin123"))
                .role("ADMIN")
                .build());
            log.info("Seeded default admin user 'admin' (password: admin123) — change after first login");
        }
    }
}
