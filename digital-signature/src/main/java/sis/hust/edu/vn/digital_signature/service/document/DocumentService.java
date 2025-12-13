package sis.hust.edu.vn.digital_signature.service.document;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;

import sis.hust.edu.vn.digital_signature.dto.document.GetDocumentResponse;
import sis.hust.edu.vn.digital_signature.dto.signer.SignerResponse;
import sis.hust.edu.vn.digital_signature.entity.enums.DocumentStatus;
import sis.hust.edu.vn.digital_signature.entity.enums.FileType;
import sis.hust.edu.vn.digital_signature.entity.model.Document;
import sis.hust.edu.vn.digital_signature.entity.model.Field;
import sis.hust.edu.vn.digital_signature.entity.model.File;
import sis.hust.edu.vn.digital_signature.entity.model.Signer;
import sis.hust.edu.vn.digital_signature.exception.business.BusinessException;
import sis.hust.edu.vn.digital_signature.exception.entity.EntityNotFoundException;
import sis.hust.edu.vn.digital_signature.repository.document.DocumentRepository;
import sis.hust.edu.vn.digital_signature.repository.field.FieldRepository;
import sis.hust.edu.vn.digital_signature.repository.signer.SignerRepository;
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

    public Page<Document> listDocuments(String ownerId, DocumentStatus status, String search, Pageable pageable) {
        Specification<Document> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            
            // Filter by owner
            predicates.add(cb.equal(root.get("ownerId"), ownerId));
            
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
        
        return documentRepository.findAll(spec, pageable);
    }

    public Document getDocumentById(String documentId, String ownerId) {
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new EntityNotFoundException("Document not found"));
        
        // Check ownership
        if (!document.getOwnerId().equals(ownerId)) {
            throw new BusinessException("Access denied");
        }
        
        return document;
    }

    public GetDocumentResponse getDocumentWithFieldsAndSigners(String documentId, String ownerId) {
        Document document = getDocumentById(documentId, ownerId);
        
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

    public Document updateDocument(String documentId, String title, String ownerId) {
        Document document = getDocumentById(documentId, ownerId);
        
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
        Document document = getDocumentById(documentId, ownerId);
        
        // Only allow delete if status is DRAFT
        if (document.getStatus() != DocumentStatus.DRAFT) {
            throw new BusinessException("Cannot delete document with status: " + document.getStatus());
        }
        
        documentRepository.delete(document);
    }
}

