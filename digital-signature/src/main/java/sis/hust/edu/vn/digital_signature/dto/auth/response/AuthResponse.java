package sis.hust.edu.vn.digital_signature.dto.auth.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class AuthResponse {
    private String accessToken;
    private String refreshToken;
}

