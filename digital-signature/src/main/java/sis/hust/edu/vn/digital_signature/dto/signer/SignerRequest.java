package sis.hust.edu.vn.digital_signature.dto.signer;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SignerRequest {
    private String email;
    private String name;
    private Integer order;
}

