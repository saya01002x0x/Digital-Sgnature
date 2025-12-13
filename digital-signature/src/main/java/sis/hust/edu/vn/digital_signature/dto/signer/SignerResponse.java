package sis.hust.edu.vn.digital_signature.dto.signer;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SignerResponse {
    private String id;
    private String documentId;
    private String email;
    private String name;
    private Integer order;
    private String status;
    private String signingUrl;
    private LocalDateTime signedAt;
    private LocalDateTime declinedAt;
    private String declineReason;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

