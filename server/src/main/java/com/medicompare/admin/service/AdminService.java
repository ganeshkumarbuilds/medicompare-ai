package com.medicompare.admin.service;

import com.medicompare.admin.dto.LoginRequest;
import com.medicompare.admin.dto.LoginResponse;
import com.medicompare.admin.entity.Admin;
import com.medicompare.admin.repository.AdminRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

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

        String normalizedEmail = email != null
                ? email.trim()
                : "";

        if (adminRepository.existsByEmailIgnoreCase(normalizedEmail)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Admin with this email already exists"
            );
        }

        Admin admin = new Admin();

        admin.setName(name != null ? name.trim() : "");
        admin.setEmail(normalizedEmail);
        admin.setPassword(
                passwordEncoder.encode(password)
        );
        admin.setRole("ADMIN");
        admin.setActive(true);

        return adminRepository.save(admin);
    }

    public LoginResponse login(LoginRequest request) {

        if (request == null
                || request.getEmail() == null
                || request.getPassword() == null) {

            throw new BadCredentialsException(
                    "Invalid email or password."
            );
        }

        String email = request.getEmail().trim();

        Admin admin = adminRepository
                .findByEmailIgnoreCase(email)
                .orElseThrow(() ->
                        new BadCredentialsException(
                                "Invalid email or password."
                        )
                );

        if (!admin.isActive()) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Admin account is inactive."
            );
        }

        boolean passwordMatches = passwordEncoder.matches(
                request.getPassword(),
                admin.getPassword()
        );

        if (!passwordMatches) {
            throw new BadCredentialsException(
                    "Invalid email or password."
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

        String normalizedEmail = email != null
                ? email.trim()
                : "";

        return adminRepository
                .findByEmailIgnoreCase(normalizedEmail)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Admin not found"
                        )
                );
    }
}