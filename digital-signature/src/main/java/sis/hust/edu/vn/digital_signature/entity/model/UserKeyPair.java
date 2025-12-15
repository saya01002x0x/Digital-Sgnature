package sis.hust.edu.vn.digital_signature.entity.model;

import jakarta.persistence.*;
import lombok.*;
import sis.hust.edu.vn.digital_signature.entity.BaseEntity;

/**
 * Entity to store user's RSA key pair for digital signing.
 * Public key is stored as Base64.
 * Private key is encrypted with AES before storage.
 */
@Entity
@Table(name = "user_key_pairs")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
public class UserKeyPair extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "user_id", nullable = false, unique = true)
    private String userId;

    @Column(name = "public_key", columnDefinition = "TEXT", nullable = false)
    private String publicKey;  // Base64 encoded RSA public key

    @Column(name = "private_key_encrypted", columnDefinition = "TEXT", nullable = false)
    private String privateKeyEncrypted;  // AES encrypted, Base64 encoded

    @Column(name = "algorithm", nullable = false)
    @Builder.Default
    private String algorithm = "RSA-2048";
}
