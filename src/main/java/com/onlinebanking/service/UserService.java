package com.onlinebanking.service;

import com.onlinebanking.entity.User;
import com.onlinebanking.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // Create new user
    public User saveUser(User user) {

        // Check duplicate email
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException(
                    "Email already registered"
            );
        }

        // Default role
        if (user.getRole() == null ||
                user.getRole().isBlank()) {

            user.setRole("ROLE_CUSTOMER");
        }

        // Default status
        if (user.getStatus() == null ||
                user.getStatus().isBlank()) {

            user.setStatus("ACTIVE");
        }

        // Encrypt password
        user.setPassword(
                passwordEncoder.encode(
                        user.getPassword()
                )
        );

        return userRepository.save(user);
    }

    // Get all users
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Get user by ID
    public User getUserById(Long id) {

        return userRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"
                        ));
    }

    // Update user
    public User updateUser(
            Long id,
            User updatedUser) {

        User existingUser =
                userRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                ));

        // Check whether email is being changed
        if (!existingUser.getEmail()
                .equalsIgnoreCase(
                        updatedUser.getEmail())) {

            if (userRepository
                    .findByEmail(
                            updatedUser.getEmail()
                    )
                    .isPresent()) {

                throw new RuntimeException(
                        "Email already registered"
                );
            }
        }

        existingUser.setName(
                updatedUser.getName()
        );

        existingUser.setEmail(
                updatedUser.getEmail()
        );

        // Update phone number
        existingUser.setPhone(
                updatedUser.getPhone()
        );

        // Update password only if provided
        if (updatedUser.getPassword() != null &&
                !updatedUser.getPassword().isBlank()) {

            existingUser.setPassword(
                    passwordEncoder.encode(
                            updatedUser.getPassword()
                    )
            );
        }

        return userRepository.save(existingUser);
    }

    // Delete user
    public void deleteUser(Long id) {

        User user =
                userRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                ));

        userRepository.delete(user);
    }
}