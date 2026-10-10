package com.onlinebanking.controller;

import com.onlinebanking.dto.LoginRequest;
import com.onlinebanking.dto.LoginResponse;
import com.onlinebanking.entity.User;
import com.onlinebanking.repository.UserRepository;
import com.onlinebanking.service.JwtService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthController(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody LoginRequest loginRequest) {

        User user = userRepository
                .findByEmail(loginRequest.getEmail())
                .orElse(null);

        if (user == null) {
            return ResponseEntity
                    .badRequest()
                    .body("Invalid email or password");
        }

        if ("BLOCKED".equalsIgnoreCase(user.getStatus())) {
            return ResponseEntity
                    .status(403)
                    .body("Your account is blocked. Please contact the administrator.");
        }

        boolean passwordMatch = passwordEncoder.matches(
                loginRequest.getPassword(),
                user.getPassword()
        );

        if (!passwordMatch) {
            return ResponseEntity
                    .badRequest()
                    .body("Invalid email or password");
        }

        String token = jwtService.generateToken(user.getEmail());

        return ResponseEntity.ok(
                new LoginResponse(
                        token,
                        user.getRole(),
                        user.getName()
                )
        );
    }
}