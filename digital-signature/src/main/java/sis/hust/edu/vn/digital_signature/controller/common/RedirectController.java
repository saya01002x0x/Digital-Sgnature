package sis.hust.edu.vn.digital_signature.controller.common;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/")
@RequiredArgsConstructor
public class RedirectController {

    @Value("${frontend.url}")
    private String frontendUrl;

    @Value("${frontend.login-path:/login}")
    private String loginPath;

    @Value("${frontend.register-path:/register}")
    private String registerPath;

    @GetMapping("/login")
    public ResponseEntity<Map<String, String>> redirectToLogin() {
        Map<String, String> response = new HashMap<>();
        response.put("redirectUrl", frontendUrl + loginPath);
        response.put("message", "Please login at the frontend");
        return ResponseEntity.status(HttpStatus.FOUND)
                .header("Location", frontendUrl + loginPath)
                .body(response);
    }

    @GetMapping("/register")
    public ResponseEntity<Map<String, String>> redirectToRegister() {
        Map<String, String> response = new HashMap<>();
        response.put("redirectUrl", frontendUrl + registerPath);
        response.put("message", "Please register at the frontend");
        return ResponseEntity.status(HttpStatus.FOUND)
                .header("Location", frontendUrl + registerPath)
                .body(response);
    }
}


