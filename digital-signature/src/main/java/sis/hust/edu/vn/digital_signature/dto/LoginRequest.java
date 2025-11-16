package sis.hust.edu.vn.digital_signature.dto;

import lombok.Data;

@Data
public class LoginRequest {
    private String username;
    private String password;
}