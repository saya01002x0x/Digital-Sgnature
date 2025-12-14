package sis.hust.edu.vn.digital_signature.config.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.header.writers.XXssProtectionHeaderWriter;
import sis.hust.edu.vn.digital_signature.security.filter.JwtAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> {})
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .headers(headers -> headers
                        .frameOptions(frame -> frame.deny())
                        .contentTypeOptions(contentType -> {})
                        .httpStrictTransportSecurity(hsts -> hsts
                                .maxAgeInSeconds(31536000)
                        )
                        .xssProtection(xss -> xss
                                .headerValue(XXssProtectionHeaderWriter.HeaderValue.ENABLED_MODE_BLOCK)
                        )
                )
                        .authorizeHttpRequests(auth -> auth
                                                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                                                // 1. Các API Public (Đăng ký, Đăng nhập, Refresh, OTP...) -> CHO PHÉP HẾT
                                                .requestMatchers(
                                                        "/api/auth/login",
                                                        "/api/auth/register",
                                                        "/api/auth/refresh",
                                                        "/api/auth/send-otp",
                                                        "/api/auth/verify-otp",
                                                        "/api/auth/forgot-password", // Nếu có
                                                        "/api/auth/reset-password"   // Nếu có
                                                ).permitAll()

                                                // 2. Các API liên quan đến File và Swagger -> CHO PHÉP HẾT
                                                .requestMatchers("/api/files/**", "/api/api/files/**").permitAll()
                                                .requestMatchers("/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()
                                                .requestMatchers("/actuator/health", "/actuator/info").permitAll()
                                                
                                                // 3. API Public để người ngoài vào ký (quan trọng cho flow Invite)
                                                .requestMatchers("/api/signing/**").permitAll()

                                                // 4. Riêng API lấy thông tin User (/me, đổi pass) -> BẮT BUỘC ĐĂNG NHẬP
                                                .requestMatchers("/api/auth/me", "/api/auth/change-password", "/api/auth/logout").authenticated()
                                                .requestMatchers("/api/signatures/**").authenticated()
                                                .requestMatchers("/api/documents/**").authenticated()

                                                // 5. Tất cả request còn lại -> BẮT BUỘC ĐĂNG NHẬP
                                                // 5. Tất cả request còn lại -> BẮT BUỘC ĐĂNG NHẬP

                                                .anyRequest().authenticated()
                                        )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(List.of("*")); // Use pattern instead for credentials
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "x-auth-token"));
        configuration.setExposedHeaders(List.of("x-auth-token", "Content-Disposition"));
        configuration.setAllowCredentials(true); // Enable credentials for Authorization header
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}

