package sis.hust.edu.vn.digital_signature.dto.verification;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Public verification response DTO.
 * Contains minimal information for public verification without authentication.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PublicVerificationResponse {
    
    /**
     * Document ID
     */
    private String documentId;
    
    /**
     * Document title
     */
    private String documentTitle;
    
    /**
     * Overall validity - true if document is valid and unmodified
     */
    private boolean valid;
    
    /**
     * True if document has been modified after signing
     */
    private boolean documentModified;
    
    /**
     * Status message for display
     */
    private String statusMessage;
    
    /**
     * Number of valid signatures
     */
    private int validSignatures;
    
    /**
     * Total number of signatures
     */
    private int totalSignatures;
    
    /**
     * List of signer names who signed the document
     */
    private List<String> signerNames;
    
    /**
     * When the document was completed (all signatures done)
     */
    private LocalDateTime completedAt;
    
    /**
     * When this verification was performed
     */
    private LocalDateTime verifiedAt;
    
    /**
     * Hash algorithm used
     */
    @Builder.Default
    private String hashAlgorithm = "SHA-256";
    
    /**
     * Signature algorithm used
     */
    @Builder.Default
    private String signatureAlgorithm = "SHA256withRSA";
}
