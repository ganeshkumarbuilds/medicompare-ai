package com.medicompare.config;

import com.medicompare.admin.entity.Admin;
import com.medicompare.admin.repository.AdminRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminDataInitializer implements CommandLineRunner {

    private static final String ADMIN_EMAIL = "admin@medicompare.com";
    private static final String ADMIN_PASSWORD = "admin123";
    private static final String ADMIN_NAME = "MediCompare Admin";
    private static final String ADMIN_ROLE = "ADMIN";

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminDataInitializer(
            AdminRepository adminRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {

        Admin admin = adminRepository
                .findByEmail(ADMIN_EMAIL)
                .orElseGet(Admin::new);

        admin.setName(ADMIN_NAME);
        admin.setEmail(ADMIN_EMAIL);

        /*
         * Always store a BCrypt hash.
         *
         * This also repairs an old admin record whose password
         * was stored using a different hash or plain text.
         */
        if (!passwordEncoder.matches(
                ADMIN_PASSWORD,
                admin.getPassword() == null
                        ? ""
                        : admin.getPassword()
        )) {
            admin.setPassword(
                    passwordEncoder.encode(ADMIN_PASSWORD)
            );
        }

        admin.setRole(ADMIN_ROLE);
        admin.setActive(true);

        adminRepository.save(admin);

        System.out.println();
        System.out.println("==============================================");
        System.out.println("MediCompare admin account ready");
        System.out.println("Email    : " + ADMIN_EMAIL);
        System.out.println("Password : " + ADMIN_PASSWORD);
        System.out.println("Role     : " + ADMIN_ROLE);
        System.out.println("==============================================");
        System.out.println();
    }
}