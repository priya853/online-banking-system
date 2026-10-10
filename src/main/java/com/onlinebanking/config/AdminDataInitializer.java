package com.onlinebanking.config;

import com.onlinebanking.entity.User;
import com.onlinebanking.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminDataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${admin.password}")
    private String adminPassword;

    public AdminDataInitializer(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {

        String adminEmail = "admin@onlinebanking.com";

        User admin;

        if (userRepository.findByEmail(adminEmail).isEmpty()) {

            admin = new User();

            admin.setName("Admin User");
            admin.setEmail(adminEmail);
            admin.setRole("ROLE_ADMIN");
            admin.setStatus("ACTIVE");

            admin.setPassword(
                    passwordEncoder.encode(adminPassword)
            );

            userRepository.save(admin);

            System.out.println(
                    "Admin user created successfully!"
            );

        } else {

            admin = userRepository
                    .findByEmail(adminEmail)
                    .orElseThrow();

            admin.setPassword(
                    passwordEncoder.encode(adminPassword)
            );

            admin.setRole("ROLE_ADMIN");
            admin.setStatus("ACTIVE");

            userRepository.save(admin);

            System.out.println(
                    "Admin user password synchronized successfully."
            );
        }
    }
}
