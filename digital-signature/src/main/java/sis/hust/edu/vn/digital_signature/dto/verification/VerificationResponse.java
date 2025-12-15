package sis.hust.edu.vn.digital_signature.dto.verification;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Response DTO for document verification.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VerificationResponse {
    
    private String documentId;
    private String documentTitle;
    
    /**
     * Overall validity - true only if all signatures are valid AND document not modified.
     */
    private boolean valid;
    
    /**
     * True if the current document hash differs from any stored hash at signing time.
     */
    private boolean documentModified;
    
    /**
     * Current SHA-256 hash of the document.
     */
    private String currentHash;
    
    /**
     * List of signature verification results.
     */
    private List<SignatureVerification> signatures;
    
    /**
     * Total number of signatures on this document.
     */
    private int totalSignatures;
    
    /**
     * Number of valid signatures.
     */
    private int validSignatures;
    
    /**
     * Timestamp of this verification.
     */
    private LocalDateTime verifiedAt;
    
    /**
     * Algorithm used for hashing.
     */
    @Builder.Default
    private String hashAlgorithm = "SHA-256";
}
