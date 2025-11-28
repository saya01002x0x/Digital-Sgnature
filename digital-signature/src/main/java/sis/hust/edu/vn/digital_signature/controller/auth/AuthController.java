package sis.hust.edu.vn.digital_signature.controller.auth;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import sis.hust.edu.vn.digital_signature.controller.base.BaseController;
import sis.hust.edu.vn.digital_signature.dto.auth.request.ChangePasswordRequest;
import sis.hust.edu.vn.digital_signature.dto.auth.request.LoginRequest;
import sis.hust.edu.vn.digital_signature.dto.auth.request.RegisterRequest;
import sis.hust.edu.vn.digital_signature.dto.auth.request.SendOtpRequest;
import sis.hust.edu.vn.digital_signature.dto.auth.request.VerifyOtpRequest;
import sis.hust.edu.vn.digital_signature.dto.auth.response.AuthResponse;
import sis.hust.edu.vn.digital_signature.dto.common.response.Response;
import sis.hust.edu.vn.digital_signature.dto.user.response.UserResponse;
import sis.hust.edu.vn.digital_signature.entity.User;
import sis.hust.edu.vn.digital_signature.mapper.user.UserMapper;
import sis.hust.edu.vn.digital_signature.security.CurrentUser;
import sis.hust.edu.vn.digital_signature.service.auth.AuthService;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController extends BaseController {

    private final AuthService authService;
    private final UserMapper userMapper;

    @PostMapping("/register")
    public ResponseEntity<Response<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse authResponse = authService.register(request);
        return success("User registered successfully", authResponse);
    }

    @PostMapping("/login")
    public ResponseEntity<Response<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse authResponse = authService.login(request);
        return success("Login successful", authResponse);
    }

    @PostMapping("/refresh")
    public ResponseEntity<Response<AuthResponse>> refresh(@RequestParam("token") String refreshToken) {
        AuthResponse authResponse = authService.refreshToken(refreshToken);
        return success("Token refreshed successfully", authResponse);
    }

    @PostMapping("/logout")
    public ResponseEntity<Response<Void>> logout(@RequestParam("token") String refreshToken) {
        authService.logout(refreshToken);
        return success("Logout successful", null);
    }

    @GetMapping("/me")
    public ResponseEntity<Response<UserResponse>> getProfile(@CurrentUser User user) {
        User currentUser = authService.getCurrentUserProfile(user);
        UserResponse userResponse = userMapper.toDto(currentUser);
        return success(userResponse);
    }

    @PostMapping("/change-password")
    public ResponseEntity<Response<Void>> changePassword(
            @CurrentUser User user,
            @Valid @RequestBody ChangePasswordRequest request) {
        authService.changePassword(user, request.getCurrentPassword(), request.getNewPassword());
        return success("Password changed successfully", null);
    }

    @PostMapping("/send-otp")
    public ResponseEntity<Response<Map<String, String>>> sendOtp(@Valid @RequestBody SendOtpRequest request) {
        String otp = authService.sendOtp(request.getEmail());
        Map<String, String> response = new HashMap<>();
        response.put("otp", otp);
        response.put("message", "OTP has been generated");
        return success("OTP generated successfully", response);
    }

    @PostMapping(value = "/verify-otp", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Response<AuthResponse>> verifyOtp(
            @RequestPart("username") String username,
            @RequestPart("email") String email,
            @RequestPart("password") String password,
            @RequestPart("fullName") String fullName,
            @RequestPart(value = "phone", required = false) String phone,
            @RequestPart(value = "address", required = false) String address,
            @RequestPart(value = "dateOfBirth", required = false) String dateOfBirth,
            @RequestPart(value = "gender", required = false) String gender,
            @RequestPart("otp") String otp,
            @RequestPart(value = "avatar", required = false) MultipartFile avatar) {
        AuthResponse authResponse = authService.verifyOtpAndRegister(
                username, email, password, fullName, phone, address, dateOfBirth, gender, otp, avatar);
        return success("Registration successful", authResponse);
    }
}

