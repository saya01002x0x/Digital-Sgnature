package sis.hust.edu.vn.digital_signature.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import sis.hust.edu.vn.digital_signature.dto.AuthResponse;
import sis.hust.edu.vn.digital_signature.dto.LoginRequest;
import sis.hust.edu.vn.digital_signature.dto.RegisterRequest;
import sis.hust.edu.vn.digital_signature.entites.RefreshToken;
import sis.hust.edu.vn.digital_signature.entites.User;
import sis.hust.edu.vn.digital_signature.entites.enumEntity.Role;
import sis.hust.edu.vn.digital_signature.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;
    private final PasswordEncoder passwordEncoder;

    public AuthResponse register(RegisterRequest req) {
        User user = userRepository.save(
                User.builder()
                        .username(req.getUsername())
                        .password(passwordEncoder.encode(req.getPassword()))
                        .fullName(req.getFullName())
                        .role(Role.USER)
                        .build()
        );

        String token = jwtService.generateToken(user.getUsername());
        RefreshToken refresh = refreshTokenService.createRefreshToken(user);

        return new AuthResponse(token, refresh.getToken());
    }

    public AuthResponse login(LoginRequest req) {
        User user = userRepository.findByUsername(req.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw new RuntimeException("Wrong password");
        }

        String token = jwtService.generateToken(user.getUsername());
        RefreshToken refresh = refreshTokenService.createRefreshToken(user);

        return new AuthResponse(token, refresh.getToken());
    }

    public AuthResponse refreshToken(String refreshToken) {

        RefreshToken token = refreshTokenService.findByToken(refreshToken);

        if (refreshTokenService.isExpired(token)) {
            throw new RuntimeException("Refresh token expired");
        }

        String newAccessToken = jwtService.generateToken(
                token.getUser().getUsername()
        );

        return new AuthResponse(newAccessToken, refreshToken);
    }
}