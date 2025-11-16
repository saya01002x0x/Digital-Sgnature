package sis.hust.edu.vn.digital_signature.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import sis.hust.edu.vn.digital_signature.dto.AuthResponse;
import sis.hust.edu.vn.digital_signature.dto.LoginRequest;
import sis.hust.edu.vn.digital_signature.dto.RegisterRequest;
import sis.hust.edu.vn.digital_signature.service.AuthService;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public AuthResponse register(@RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @PostMapping("/refresh")
    public AuthResponse refresh(@RequestParam("token") String refreshToken) {
        return authService.refreshToken(refreshToken);
    }
}
