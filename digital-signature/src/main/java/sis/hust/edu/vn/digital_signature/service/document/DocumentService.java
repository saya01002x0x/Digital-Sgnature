package sis.hust.edu.vn.digital_signature.service.document;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import sis.hust.edu.vn.digital_signature.dto.document.DocumentListItem;
import sis.hust.edu.vn.digital_signature.dto.document.GetDocumentResponse;
import sis.hust.edu.vn.digital_signature.dto.signer.SignerResponse;
import sis.hust.edu.vn.digital_signature.entity.enums.DocumentStatus;
import sis.hust.edu.vn.digital_signature.entity.enums.FileType;
import sis.hust.edu.vn.digital_signature.entity.model.Document;
import sis.hust.edu.vn.digital_signature.entity.model.Field;
import sis.hust.edu.vn.digital_signature.entity.model.File;
import sis.hust.edu.vn.digital_signature.entity.model.Signer;
import sis.hust.edu.vn.digital_signature.entity.model.User;
import sis.hust.edu.vn.digital_signature.exception.business.BusinessException;
import sis.hust.edu.vn.digital_signature.exception.entity.EntityNotFoundException;
import sis.hust.edu.vn.digital_signature.repository.document.DocumentRepository;
import sis.hust.edu.vn.digital_signature.repository.field.FieldRepository;
import sis.hust.edu.vn.digital_signature.repository.signer.SignerRepository;
import sis.hust.edu.vn.digital_signature.repository.user.UserRepository;
import sis.hust.edu.vn.digital_signature.service.file.FileService;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class DocumentService {

    private final FileService fileService;
    private final DocumentRepository documentRepository;
    private final FieldRepository fieldRepository;
    private final SignerRepository signerRepository;
    private final UserRepository userRepository;

    @Value("${frontend.url:http://localhost:5556}")
    private String frontendUrl;

    public Document uploadDocument(MultipartFile multipartFile, String title, String ownerId) throws IOException {
        // Save file using FileService
        File savedFile = fileService.saveFile(multipartFile, FileType.DOCUMENT, ownerId);
        
        if (savedFile == null) {
            throw new BusinessException("Failed to save file");
        }

        // Use file name as title if title is not provided
        String documentTitle = title != null && !title.trim().isEmpty() 
            ? title 
            : savedFile.getOriginalName();

        // Create Document entity
        Document document = Document.builder()
                .title(documentTitle)
                .fileUrl(savedFile.getFileUrl())
                .fileSize(savedFile.getFileSize())
                .pageCount(1) // TODO: Extract actual page count from PDF using PDF library
                .status(sis.hust.edu.vn.digital_signature.entity.enums.DocumentStatus.DRAFT)
                .ownerId(ownerId)
                .build();

        // Save and return Document
        return documentRepository.save(document);
    }

    /**
     * List documents for a user - includes both owned documents and documents where user is a signer
     * @param ownerId Current user's ID
     * @param userEmail Current user's email (needed to find documents where invited as signer)
     * @param status Filter by status (optional)
     * @param search Filter by title search (optional)
     * @param pageable Pagination
     * @return Page of DocumentListItem with owner information
     */
    public Page<DocumentListItem> listDocumentsWithOwnerInfo(String ownerId, String userEmail, DocumentStatus status, String search, Pageable pageable) {
        // Step 1: Find document IDs where user is invited as signer
        List<String> invitedDocumentIds = signerRepository.findDocumentIdsBySignerEmail(userEmail);
        
        // Step 2: Build specification to find documents where:
        // - User is owner OR document ID is in invited list
        Specification<Document> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            
            // Owner OR invited signer
            Predicate isOwner = cb.equal(root.get("ownerId"), ownerId);
            Predicate isInvited = invitedDocumentIds.isEmpty() 
                ? cb.disjunction() // Always false if no invited docs
                : root.get("id").in(invitedDocumentIds);
            predicates.add(cb.or(isOwner, isInvited));
            
            // Filter by status if present
            if (status != null) {
                predicates.add(cb.equal(root.get("status"), status));
            }
            
            // Filter by search term if present
            if (search != null && !search.trim().isEmpty()) {
                String likePattern = "%" + search.toLowerCase() + "%";
                predicates.add(cb.like(cb.lower(root.get("title")), likePattern));
            }
            
            return cb.and(predicates.toArray(new Predicate[0]));
        };
        
        // Step 3: Fetch documents
        Page<Document> documentsPage = documentRepository.findAll(spec, pageable);
        
        // Step 4: Collect owner IDs and fetch owner names
        Set<String> ownerIds = documentsPage.getContent().stream()
            .map(Document::getOwnerId)
            .collect(Collectors.toSet());
        
        Map<String, String> ownerIdToName = userRepository.findAllById(ownerIds).stream()
            .collect(Collectors.toMap(User::getId, User::getFullName));
        
        // Step 5: Convert to DocumentListItem with owner info
        List<DocumentListItem> items = documentsPage.getContent().stream()
            .map(doc -> DocumentListItem.builder()
                .id(doc.getId())
                .title(doc.getTitle())
                .fileUrl(doc.getFileUrl())
                .fileSize(doc.getFileSize())
                .pageCount(doc.getPageCount())
                .status(doc.getStatus())
                .ownerId(doc.getOwnerId())
                .ownerName(ownerIdToName.getOrDefault(doc.getOwnerId(), "Unknown"))
                .isOwner(doc.getOwnerId().equals(ownerId))
                .createdAt(doc.getCreatedAt())
                .updatedAt(doc.getUpdatedAt())
                .completedAt(doc.getCompletedAt())
                .declinedAt(doc.getDeclinedAt())
                .declinedBy(doc.getDeclinedBy())
                .declineReason(doc.getDeclineReason())
                .build())
            .collect(Collectors.toList());
        
        return new PageImpl<>(items, pageable, documentsPage.getTotalElements());
    }

    /**
     * Get document by ID with access control
     * User can access document if they are the owner OR a signer
     */
    public Document getDocumentById(String documentId, String userId, String userEmail) {
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new EntityNotFoundException("Document not found"));
        
        // Check if user is owner
        boolean isOwner = document.getOwnerId().equals(userId);
        
        // Check if user is a signer (by email)
        boolean isSigner = false;
        if (!isOwner && userEmail != null) {
            List<Signer> signers = signerRepository.findByDocumentId(documentId);
            isSigner = signers.stream()
                .anyMatch(signer -> signer.getEmail().equalsIgnoreCase(userEmail));
        }
        
        if (!isOwner && !isSigner) {
            throw new BusinessException("Access denied. You are not the owner or a signer of this document.");
        }
        
        return document;
    }

    public GetDocumentResponse getDocumentWithFieldsAndSigners(String documentId, String userId, String userEmail) {
        Document document = getDocumentById(documentId, userId, userEmail);
        
        // Get fields
        List<Field> fields = fieldRepository.findByDocumentId(documentId);
        
        // Get signers
        List<Signer> signers = signerRepository.findByDocumentId(documentId);
        
        // Convert signers to SignerResponse
        List<SignerResponse> signerResponses = signers.stream()
                .map(signer -> {
                    String signingUrl = frontendUrl + "/signing/" + signer.getToken();
                    return SignerResponse.builder()
                            .id(signer.getId())
                            .documentId(signer.getDocumentId())
                            .email(signer.getEmail())
                            .name(signer.getName())
                            .order(signer.getOrder())
                            .status(signer.getStatus().name())
                            .signingUrl(signingUrl)
                            .signedAt(signer.getSignedAt())
                            .declinedAt(signer.getDeclinedAt())
                            .declineReason(signer.getDeclineReason())
                            .createdAt(signer.getCreatedAt())
                            .updatedAt(signer.getUpdatedAt())
                            .build();
                })
                .collect(Collectors.toList());
        
        return GetDocumentResponse.builder()
                .document(document)
                .fields(fields)
                .signers(signerResponses)
                .build();
    }

    /**
     * Get document by ID - OWNER ONLY access
     * Used for update/delete operations that require owner permission
     */
    private Document getDocumentByIdOwnerOnly(String documentId, String ownerId) {
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new EntityNotFoundException("Document not found"));
        
        if (!document.getOwnerId().equals(ownerId)) {
            throw new BusinessException("Access denied. Only the document owner can perform this action.");
        }
        
        return document;
    }

    public Document updateDocument(String documentId, String title, String ownerId) {
        Document document = getDocumentByIdOwnerOnly(documentId, ownerId);
        
        // Only allow update if status is DRAFT
        if (document.getStatus() != DocumentStatus.DRAFT) {
            throw new BusinessException("Cannot update document with status: " + document.getStatus());
        }
        
        if (title != null && !title.trim().isEmpty()) {
            document.setTitle(title);
        }
        
        return documentRepository.save(document);
    }

    public void deleteDocument(String documentId, String ownerId) {
        Document document = getDocumentByIdOwnerOnly(documentId, ownerId);
        
        // Only allow delete if status is DRAFT or DECLINED
        if (document.getStatus() != DocumentStatus.DRAFT && 
            document.getStatus() != DocumentStatus.DECLINED) {
            throw new BusinessException("Cannot delete document with status: " + document.getStatus());
        }
        
        documentRepository.delete(document);
    }
}

