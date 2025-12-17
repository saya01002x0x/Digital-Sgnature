package sis.hust.edu.vn.digital_signature.entity.model;

import jakarta.persistence.*;
import lombok.*;
import sis.hust.edu.vn.digital_signature.entity.BaseEntity;
import sis.hust.edu.vn.digital_signature.entity.enums.DocumentStatus;

import java.time.LocalDateTime;

@Entity
@Table(name = "documents")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Document extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "file_url", nullable = false, length = 1000)
    private String fileUrl;

    @Column(name = "file_size", nullable = false)
    private Long fileSize;

    @Column(name = "page_count", nullable = false)
    @Builder.Default
    private Integer pageCount = 1;

    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private DocumentStatus status = DocumentStatus.DRAFT;

    @Column(name = "owner_id", nullable = false)
    private String ownerId;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "declined_at")
    private LocalDateTime declinedAt;

    @Column(name = "declined_by")
    private String declinedBy;

    @Column(name = "decline_reason", columnDefinition = "TEXT")
    private String declineReason;
}

