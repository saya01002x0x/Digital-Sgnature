package sis.hust.edu.vn.digital_signature.dto.document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import sis.hust.edu.vn.digital_signature.entity.enums.DocumentStatus;

import java.time.LocalDateTime;

/**
 * DTO for document list item with owner information
 * Used to display documents in the list view with owner name
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DocumentListItem {
    private String id;
    private String title;
    private String fileUrl;
    private Long fileSize;
    private Integer pageCount;
    private DocumentStatus status;
    private String ownerId;
    private String ownerName;  // Display name of the owner
    private Boolean isOwner;   // True if current user is the owner
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime completedAt;
    private LocalDateTime declinedAt;
    private String declinedBy;
    private String declineReason;
}
