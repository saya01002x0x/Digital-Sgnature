package sis.hust.edu.vn.digital_signature.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import sis.hust.edu.vn.digital_signature.entity.User;
import sis.hust.edu.vn.digital_signature.entity.enums.Role;
import sis.hust.edu.vn.digital_signature.repository.user.UserRepository;

import java.util.Optional;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        initializeAdminUser();
    }

    private void initializeAdminUser() {
        String adminUsername = "miiao29";
        Optional<User> existingAdmin = userRepository.findByUsername(adminUsername);

        if (existingAdmin.isPresent()) {
            log.info("Admin user '{}' already exists, skipping creation", adminUsername);
            return;
        }

        User admin = User.builder()
                .username(adminUsername)
                .password(passwordEncoder.encode("miiao29"))
                .email("miiao29@example.com")
                .fullName("Admin User")
                .isActive(true)
                .role(Role.ADMIN)
                .build();

        userRepository.save(admin);
        log.info("Admin user '{}' created successfully", adminUsername);
    }
}

