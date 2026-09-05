package com.medicompare.user.service;

import com.medicompare.admin.service.JwtService;
import com.medicompare.user.dto.RegisterRequest;
import com.medicompare.user.dto.RegisterResponse;
import com.medicompare.user.dto.UserLoginRequest;
import com.medicompare.user.dto.UserLoginResponse;
import com.medicompare.user.entity.User;
import com.medicompare.user.repository.UserRepository;

import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public UserService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Transactional
    public RegisterResponse register(
            RegisterRequest request
    ) {

        if (request == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Registration request is required."
            );
        }

        if (request.getEmail() == null
                || request.getEmail().trim().isEmpty()) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Email is required."
            );
        }

        if (request.getPassword() == null
                || request.getPassword().isEmpty()) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Password is required."
            );
        }

        String email = request.getEmail()
                .trim()
                .toLowerCase();

        if (userRepository.existsByEmailIgnoreCase(email)) {

            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "An account with this email already exists."
            );
        }

        User user = new User();

        user.setName(
                request.getName() != null
                        ? request.getName().trim()
                        : ""
        );

        user.setEmail(email);

        /*
         * Always store the password encoded.
         */
        user.setPassword(
                passwordEncoder.encode(
                        request.getPassword()
                )
        );

        /*
         * Public registration can NEVER create an ADMIN.
         */
        user.setRole("USER");

        user.setEnabled(true);

        User savedUser =
                userRepository.save(user);

        return new RegisterResponse(
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getEmail(),
                savedUser.getRole(),
                "Account created successfully."
        );
    }

    @Transactional
    public UserLoginResponse login(
            UserLoginRequest request
    ) {

        /*
         * Validate request.
         */
        if (request == null) {
            throw new BadCredentialsException(
                    "Invalid email or password."
            );
        }

        if (request.getEmail() == null
                || request.getEmail().trim().isEmpty()) {

            throw new BadCredentialsException(
                    "Invalid email or password."
            );
        }

        if (request.getPassword() == null
                || request.getPassword().isEmpty()) {

            throw new BadCredentialsException(
                    "Invalid email or password."
            );
        }

        String email = request.getEmail()
                .trim()
                .toLowerCase();

        /*
         * Find user by email.
         */
        User user =
                userRepository
                        .findByEmailIgnoreCase(email)
                        .orElseThrow(() ->
                                new BadCredentialsException(
                                        "Invalid email or password."
                                )
                        );

        /*
         * Check whether the account is enabled.
         */
        if (!user.isEnabled()) {

            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Your account has been disabled."
            );
        }

        /*
         * Make sure a password exists in the database.
         */
        if (user.getPassword() == null
                || user.getPassword().isEmpty()) {

            throw new BadCredentialsException(
                    "Invalid email or password."
            );
        }

        /*
         * Normal password authentication.
         *
         * This compares the raw password supplied by the user
         * with the encoded password stored in PostgreSQL.
         */
        boolean passwordMatches =
                passwordEncoder.matches(
                        request.getPassword(),
                        user.getPassword()
                );

        /*
         * Legacy support:
         *
         * If an old account has a plaintext password stored in
         * the database, allow the login once and immediately
         * replace it with an encoded password.
         */
        if (!passwordMatches
                && request.getPassword()
                .equals(user.getPassword())) {

            user.setPassword(
                    passwordEncoder.encode(
                            request.getPassword()
                    )
            );

            userRepository.save(user);

            passwordMatches = true;
        }

        /*
         * Password is incorrect.
         */
        if (!passwordMatches) {

            throw new BadCredentialsException(
                    "Invalid email or password."
            );
        }

        /*
         * Generate JWT after successful authentication.
         */
        String token =
                jwtService.generateToken(
                        user.getEmail(),
                        user.getRole()
                );

        /*
         * Return login response.
         */
        return new UserLoginResponse(
                token,
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole()
        );
    }

    @Transactional(readOnly = true)
    public User getByEmail(
            String email
    ) {

        if (email == null
                || email.trim().isEmpty()) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Email is required."
            );
        }

        return userRepository
                .findByEmailIgnoreCase(
                        email.trim()
                )
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "User not found."
                        )
                );
    }
}