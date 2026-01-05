package sis.hust.edu.vn.digital_signature.controller.verification;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sis.hust.edu.vn.digital_signature.controller.BaseController;
import sis.hust.edu.vn.digital_signature.dto.common.response.Response;
import sis.hust.edu.vn.digital_signature.entity.model.Document;
import sis.hust.edu.vn.digital_signature.entity.model.Signer;
import sis.hust.edu.vn.digital_signature.exception.entity.EntityNotFoundException;
import sis.hust.edu.vn.digital_signature.repository.document.DocumentRepository;
import sis.hust.edu.vn.digital_signature.repository.signer.SignerRepository;
import sis.hust.edu.vn.digital_signature.service.storage.StorageService;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Public controller for document verification.
 * Accessible without authentication for QR code scanning.
 * 
 * NEW FLOW: Simply display the original document for visual comparison.
 */
@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
@Slf4j
public class PublicVerificationController extends BaseController {

    private final DocumentRepository documentRepository;
    private final SignerRepository signerRepository;
    private final StorageService storageService;
    
    @Value("${app.base-url:http://localhost:5555}")
    private String baseUrl;

    /**
     * Public endpoint for viewing a document via QR code scan.
     * Returns document info and file URL for visual comparison.
     * Does not require authentication.
     * 
     * @param documentId The document ID to view
     * @return Document info with file URL
     */
    @GetMapping("/verify/{documentId}")
    public ResponseEntity<Response<Map<String, Object>>> getDocumentForVerification(
            @PathVariable String documentId) {
        
        log.info("Public document view request for: {}", documentId);
        
        try {
            // Get document
            Document document = documentRepository.findById(documentId)
                    .orElseThrow(() -> new EntityNotFoundException("Document not found"));
            
            // Get signers
            List<Signer> signers = signerRepository.findByDocumentIdOrderByOrderAsc(documentId);
            
            // Get file URL (using backend proxy URL for CORS)
            String fileName = document.getFileUrl().substring(document.getFileUrl().lastIndexOf("/") + 1);
            String fileUrl = baseUrl + "/api/files/" + fileName;
            
            // Build response
            Map<String, Object> response = new HashMap<>();
            response.put("documentId", document.getId());
            response.put("documentTitle", document.getTitle());
            response.put("status", document.getStatus().name());
            response.put("pageCount", document.getPageCount());
            response.put("fileUrl", fileUrl);
            response.put("createdAt", document.getCreatedAt());
            response.put("completedAt", document.getCompletedAt());
            
            // Signer info (simplified)
            List<Map<String, Object>> signerInfo = signers.stream()
                    .filter(s -> "SIGNED".equals(s.getStatus().name()))
                    .map(s -> {
                        Map<String, Object> info = new HashMap<>();
                        info.put("name", s.getName());
                        info.put("signedAt", s.getSignedAt());
                        return info;
                    })
                    .collect(Collectors.toList());
            
            response.put("signers", signerInfo);
            response.put("totalSigners", signers.size());
            response.put("signedCount", signerInfo.size());
            response.put("verifiedAt", LocalDateTime.now());
            
            return success("Document found", response);
            
        } catch (EntityNotFoundException e) {
            log.warn("Document not found for verification: {}", documentId);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("documentId", documentId);
            errorResponse.put("error", "Document not found");
            errorResponse.put("verifiedAt", LocalDateTime.now());
            return badRequest("Document not found");
            
        } catch (Exception e) {
            log.error("Error getting document for verification: {}", documentId, e);
            return badRequest("Unable to load document");
        }
    }
}
