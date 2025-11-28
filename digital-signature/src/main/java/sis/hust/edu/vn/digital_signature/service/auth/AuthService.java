package sis.hust.edu.vn.digital_signature.service.auth;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import sis.hust.edu.vn.digital_signature.constants.ErrorMessages;
import sis.hust.edu.vn.digital_signature.dto.auth.request.LoginRequest;
import sis.hust.edu.vn.digital_signature.dto.auth.request.RegisterRequest;
import sis.hust.edu.vn.digital_signature.dto.auth.request.VerifyOtpRequest;
import sis.hust.edu.vn.digital_signature.dto.auth.response.AuthResponse;
import sis.hust.edu.vn.digital_signature.entity.RefreshToken;
import sis.hust.edu.vn.digital_signature.entity.User;
import sis.hust.edu.vn.digital_signature.entity.enums.Role;
import sis.hust.edu.vn.digital_signature.exception.BusinessException;
import sis.hust.edu.vn.digital_signature.exception.EntityNotFoundException;
import sis.hust.edu.vn.digital_signature.repository.user.UserRepository;
import sis.hust.edu.vn.digital_signature.security.JwtService;
import sis.hust.edu.vn.digital_signature.service.file.FileService;
import sis.hust.edu.vn.digital_signature.entity.enums.FileType;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;
    private final PasswordEncoder passwordEncoder;
    private final OtpService otpService;
    private final FileService fileService;

    public AuthResponse register(RegisterRequest req) {
        if (userRepository.findByUsername(req.getUsername()).isPresent()) {
            throw new BusinessException(ErrorMessages.USERNAME_ALREADY_EXISTS);
        }

        if (userRepository.findByEmail(req.getEmail()).isPresent()) {
            throw new BusinessException(ErrorMessages.EMAIL_ALREADY_EXISTS);
        }

        User user = userRepository.save(
                User.builder()
                        .username(req.getUsername())
                        .password(passwordEncoder.encode(req.getPassword()))
                        .email(req.getEmail())
                        .fullName(req.getFullName())
                        .phone(req.getPhone())
                        .address(req.getAddress())
                        .dateOfBirth(req.getDateOfBirth())
                        .gender(req.getGender())
                        .isActive(true)
                        .role(Role.USER)
                        .build()
        );

        String token = jwtService.generateToken(user.getUsername());
        RefreshToken refresh = refreshTokenService.createRefreshToken(user);

        return new AuthResponse(token, refresh.getToken());
    }

    public AuthResponse login(LoginRequest req) {
        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new EntityNotFoundException(ErrorMessages.USER_NOT_FOUND));

        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw new BusinessException(ErrorMessages.WRONG_PASSWORD);
        }

        String token = jwtService.generateToken(user.getUsername());
        RefreshToken refresh = refreshTokenService.createRefreshToken(user);

        return new AuthResponse(token, refresh.getToken());
    }

    public AuthResponse refreshToken(String refreshToken) {
        RefreshToken token = refreshTokenService.findByToken(refreshToken);

        if (refreshTokenService.isExpired(token)) {
            throw new BusinessException(ErrorMessages.REFRESH_TOKEN_EXPIRED);
        }

        String newAccessToken = jwtService.generateToken(
                token.getUser().getUsername()
        );

        return new AuthResponse(newAccessToken, refreshToken);
    }

    public void logout(String refreshToken) {
        RefreshToken token = refreshTokenService.findByToken(refreshToken);
        refreshTokenService.deleteToken(token);
    }

    public User getCurrentUserProfile(User user) {
        return userRepository.findByIdWithAvatar(user.getId())
                .orElseThrow(() -> new EntityNotFoundException(ErrorMessages.USER_NOT_FOUND));
    }

    public void changePassword(User user, String currentPassword, String newPassword) {
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new BusinessException(ErrorMessages.WRONG_PASSWORD);
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    public String sendOtp(String email) {
        if (userRepository.findByEmail(email).isPresent()) {
            throw new BusinessException(ErrorMessages.EMAIL_ALREADY_EXISTS);
        }

        String otp = otpService.generateOtp(email);

        log.info("OTP {} generated for email: {}", otp, email);

        return otp;
    }

    public AuthResponse verifyOtpAndRegister(VerifyOtpRequest request) {
        if (!otpService.verifyOtp(request.getEmail(), request.getOtp())) {
            throw new BusinessException("Invalid or expired OTP");
        }

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new BusinessException(ErrorMessages.EMAIL_ALREADY_EXISTS);
        }

        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new BusinessException(ErrorMessages.USERNAME_ALREADY_EXISTS);
        }

        User user = userRepository.save(
                User.builder()
                        .username(request.getUsername())
                        .password(passwordEncoder.encode(request.getPassword()))
                        .email(request.getEmail())
                        .fullName(request.getFullName())
                        .phone(request.getPhone())
                        .address(request.getAddress())
                        .dateOfBirth(request.getDateOfBirth())
                        .gender(request.getGender())
                        .isActive(true)
                        .role(Role.USER)
                        .build()
        );

        String token = jwtService.generateToken(user.getEmail());
        RefreshToken refresh = refreshTokenService.createRefreshToken(user);

        return new AuthResponse(token, refresh.getToken());
    }

    public AuthResponse verifyOtpAndRegister(
            String username, String email, String password, String fullName,
            String phone, String address, String dateOfBirth, String gender,
            String otp, MultipartFile avatar) {
        if (!otpService.verifyOtp(email, otp)) {
            throw new BusinessException("Invalid or expired OTP");
        }

        if (userRepository.findByEmail(email).isPresent()) {
            throw new BusinessException(ErrorMessages.EMAIL_ALREADY_EXISTS);
        }

        if (userRepository.findByUsername(username).isPresent()) {
            throw new BusinessException(ErrorMessages.USERNAME_ALREADY_EXISTS);
        }

        sis.hust.edu.vn.digital_signature.entity.File avatarFile = null;
        if (avatar != null && !avatar.isEmpty()) {
            try {
                avatarFile = fileService.saveFile(avatar, FileType.AVATAR, email);
            } catch (IOException e) {
                log.error("Error saving avatar file", e);
            }
        }

        User.UserBuilder userBuilder = User.builder()
                .username(username)
                .password(passwordEncoder.encode(password))
                .email(email)
                .fullName(fullName)
                .phone(phone)
                .address(address)
                .avatar(avatarFile)
                .isActive(true)
                .role(Role.USER);

        if (dateOfBirth != null && !dateOfBirth.isEmpty()) {
            try {
                userBuilder.dateOfBirth(java.time.LocalDate.parse(dateOfBirth));
            } catch (Exception e) {
                log.warn("Invalid date format: {}", dateOfBirth);
            }
        }

        if (gender != null && !gender.isEmpty()) {
            try {
                userBuilder.gender(sis.hust.edu.vn.digital_signature.entity.enums.Gender.valueOf(gender));
            } catch (Exception e) {
                log.warn("Invalid gender: {}", gender);
            }
        }

        User user = userRepository.save(userBuilder.build());

        String token = jwtService.generateToken(user.getEmail());
        RefreshToken refresh = refreshTokenService.createRefreshToken(user);

        return new AuthResponse(token, refresh.getToken());
    }
}

