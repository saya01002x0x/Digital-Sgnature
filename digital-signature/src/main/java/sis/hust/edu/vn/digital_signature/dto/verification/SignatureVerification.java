package sis.hust.edu.vn.digital_signature.dto.verification;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO for individual signature verification result.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SignatureVerification {
    
    private String signerId;
    private String signerName;
    private String signerEmail;
    
    /**
     * True if the cryptographic signature is valid (verified with public key).
     */
    private boolean signatureValid;
    
    /**
     * True if current document hash matches the hash at signing time.
     */
    private boolean hashMatches;
    
    /**
     * The document hash that was signed (at signing time).
     */
    private String originalHash;
    
    /**
     * Algorithm used for signing.
     */
    private String algorithm;
    
    /**
     * When this signature was created.
     */
    private LocalDateTime signedAt;
    
    /**
     * Overall status message.
     */
    private String statusMessage;
}
