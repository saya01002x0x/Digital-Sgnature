package sis.hust.edu.vn.digital_signature.entity.model;

import jakarta.persistence.*;
import lombok.*;
import sis.hust.edu.vn.digital_signature.entity.BaseEntity;
import sis.hust.edu.vn.digital_signature.entity.enums.SignatureType;

@Entity
@Table(name = "signatures")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
public class Signature extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(name = "type", nullable = false)
    @Enumerated(EnumType.STRING)
    private SignatureType type;

    @Column(name = "image_data", columnDefinition = "TEXT", nullable = false)
    private String imageData; // Base64 PNG or SVG data URL

    @Column(name = "is_default", nullable = false)
    @Builder.Default
    private Boolean isDefault = false;

    @Column(name = "name")
    private String name; // Optional label (e.g., "Formal", "Casual")
}

