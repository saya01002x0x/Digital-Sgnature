package sis.hust.edu.vn.digital_signature.entity.model;

import jakarta.persistence.*;
import lombok.*;
import sis.hust.edu.vn.digital_signature.entity.BaseEntity;

import java.time.LocalDateTime;

/**
 * Entity to store digital signature for each signer on a document.
 * Contains the document hash at signing time and the cryptographic signature.
 */
@Entity
@Table(name = "document_signatures")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
public class DocumentSignature extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "document_id", nullable = false)
    private String documentId;

    @Column(name = "signer_id", nullable = false)
    private String signerId;

    @Column(name = "user_id", nullable = false)
    private String userId;  // The user who signed (must be registered)

    @Column(name = "document_hash", nullable = false)
    private String documentHash;  // SHA-256 hash of document at signing time

    @Column(name = "signature", columnDefinition = "TEXT", nullable = false)
    private String signature;  // Base64 encoded digital signature

    @Column(name = "algorithm", nullable = false)
    @Builder.Default
    private String algorithm = "SHA256withRSA";

    @Column(name = "signed_at", nullable = false)
    private LocalDateTime signedAt;

    @Column(name = "is_valid")
    @Builder.Default
    private Boolean isValid = true;  // Cached validation result
}
