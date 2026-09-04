package com.medicompare.admin.service;

import com.medicompare.admin.dto.LoginRequest;
import com.medicompare.admin.dto.LoginResponse;
import com.medicompare.admin.entity.Admin;
import com.medicompare.admin.repository.AdminRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AdminService {

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AdminService(
            AdminRepository adminRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService
    ) {
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public Admin createAdmin(
            String name,
            String email,
            String password
    ) {

        if (adminRepository.existsByEmail(email)) {
            throw new IllegalArgumentException(
                    "Admin with this email already exists"
            );
        }

        Admin admin = new Admin();

        admin.setName(name);
        admin.setEmail(email);
        admin.setPassword(
                passwordEncoder.encode(password)
        );
        admin.setRole("ADMIN");
        admin.setActive(true);

        return adminRepository.save(admin);
    }

    public LoginResponse login(LoginRequest request) {

        Admin admin = adminRepository
                .findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Invalid email or password"
                        )
                );

        if (!admin.isActive()) {
            throw new IllegalArgumentException(
                    "Admin account is inactive"
            );
        }

        if (!passwordEncoder.matches(
                request.getPassword(),
                admin.getPassword()
        )) {
            throw new IllegalArgumentException(
                    "Invalid email or password"
            );
        }

        String token = jwtService.generateToken(
                admin.getEmail(),
                admin.getRole()
        );

        return new LoginResponse(
                token,
                admin.getName(),
                admin.getEmail(),
                admin.getRole()
        );
    }

    public Admin findByEmail(String email) {

        return adminRepository.findByEmail(email)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Admin not found"
                        )
                );
    }
}