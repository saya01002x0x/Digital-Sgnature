package sis.hust.edu.vn.digital_signature.entity.model;

import jakarta.persistence.*;
import lombok.*;
import sis.hust.edu.vn.digital_signature.entity.BaseEntity;
import sis.hust.edu.vn.digital_signature.entity.enums.SignerStatus;

import java.time.LocalDateTime;

@Entity
@Table(name = "signers")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
public class Signer extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "document_id", nullable = false)
    private String documentId;

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "token", nullable = false, unique = true)
    private String token; // UUID, unique, để truy cập signing session

    @Column(name = "order_number", nullable = false)
    private Integer order; // thứ tự ký, 1+

    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private SignerStatus status = SignerStatus.PENDING;

    @Column(name = "signed_at")
    private LocalDateTime signedAt;

    @Column(name = "declined_at")
    private LocalDateTime declinedAt;

    @Column(name = "decline_reason", columnDefinition = "TEXT")
    private String declineReason;
}

