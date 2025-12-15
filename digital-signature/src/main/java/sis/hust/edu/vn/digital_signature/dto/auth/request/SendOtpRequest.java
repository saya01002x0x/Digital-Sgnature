package sis.hust.edu.vn.digital_signature.dto.auth.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import sis.hust.edu.vn.digital_signature.entity.enums.OtpType;

@Data
public class SendOtpRequest {

    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;

    @NotBlank(message = "OTP type is required")
    private String type;
}

