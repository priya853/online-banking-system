package com.onlinebanking.config;

import com.onlinebanking.repository.UserRepository;
import com.onlinebanking.security.JwtAuthenticationFilter;
import com.onlinebanking.service.JwtService;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class SecurityConfig {

    private final JwtService jwtService;
    private final UserRepository userRepository;

    public SecurityConfig(
            JwtService jwtService,
            UserRepository userRepository) {

        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // =========================================================
    // CORS
    // =========================================================

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration =
                new CorsConfiguration();

        configuration.setAllowedOrigins(
                List.of(
                        "http://localhost:5173"
                )
        );

        configuration.setAllowedMethods(
                List.of(
                        "GET",
                        "POST",
                        "PUT",
                        "PATCH",
                        "DELETE",
                        "OPTIONS"
                )
        );

        configuration.setAllowedHeaders(
                List.of(
                        "Authorization",
                        "Content-Type"
                )
        );

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
                "/**",
                configuration
        );

        return source;
    }

    // =========================================================
    // JWT FILTER
    // =========================================================

    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() {

        return new JwtAuthenticationFilter(
                jwtService,
                userRepository
        );
    }

    // =========================================================
    // SECURITY FILTER CHAIN
    // =========================================================

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())

                .cors(cors ->
                        cors.configurationSource(
                                corsConfigurationSource()
                        )
                )

                .authorizeHttpRequests(auth -> auth

                        // -------------------------------------------------
                        // Authentication APIs
                        // -------------------------------------------------
                        .requestMatchers(
                                "/api/auth/**"
                        ).permitAll()

                        // -------------------------------------------------
                        // Customer registration
                        // -------------------------------------------------
                        .requestMatchers(
                                "/api/users"
                        ).permitAll()

                        // -------------------------------------------------
                        // Swagger
                        // -------------------------------------------------
                        .requestMatchers(
                                "/swagger-ui/**",
                                "/swagger-ui.html",
                                "/v3/api-docs/**"
                        ).permitAll()

                        // -------------------------------------------------
                        // ADMIN APIs
                        // ROLE_ADMIN
                        // -------------------------------------------------
                        .requestMatchers(
                                "/api/admin/**"
                        ).hasRole("ADMIN")

                        // -------------------------------------------------
                        // BANK APIs
                        // ROLE_BANK
                        // -------------------------------------------------
                        .requestMatchers(
                                "/api/bank/**"
                        ).hasRole("BANK")

                        // -------------------------------------------------
                        // Everything else
                        // -------------------------------------------------
                        .anyRequest().authenticated()
                )

                // ---------------------------------------------------------
                // JWT Authentication Filter
                // ---------------------------------------------------------
                .addFilterBefore(
                        jwtAuthenticationFilter(),
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }
}