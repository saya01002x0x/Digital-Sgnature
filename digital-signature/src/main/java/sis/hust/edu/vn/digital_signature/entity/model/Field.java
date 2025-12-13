package sis.hust.edu.vn.digital_signature.entity.model;

import jakarta.persistence.*;
import lombok.*;
import sis.hust.edu.vn.digital_signature.entity.BaseEntity;
import sis.hust.edu.vn.digital_signature.entity.enums.FieldType;

@Entity
@Table(name = "fields")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
public class Field extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "document_id", nullable = false)
    private String documentId;

    @Column(name = "type", nullable = false)
    @Enumerated(EnumType.STRING)
    private FieldType type;

    @Column(name = "page_number", nullable = false)
    private Integer pageNumber; // 1-indexed

    @Column(name = "position_x", nullable = false)
    private Double positionX; // % of page width (0-100)

    @Column(name = "position_y", nullable = false)
    private Double positionY; // % of page height (0-100)

    @Column(name = "width", nullable = false)
    private Double width; // % of page width

    @Column(name = "height", nullable = false)
    private Double height; // % of page height

    @Column(name = "signer_id")
    private String signerId; // optional, foreign key to Signer

    @Column(name = "value", columnDefinition = "TEXT")
    private String value; // optional, contains signature data URL, date, or text

    @Column(name = "is_required", nullable = false)
    @Builder.Default
    private Boolean isRequired = true;

    @Column(name = "placeholder", columnDefinition = "TEXT")
    private String placeholder; // optional
}

