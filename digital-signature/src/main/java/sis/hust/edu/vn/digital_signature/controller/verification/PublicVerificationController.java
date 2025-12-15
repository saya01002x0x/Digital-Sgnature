package sis.hust.edu.vn.digital_signature.controller.verification;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sis.hust.edu.vn.digital_signature.controller.BaseController;
import sis.hust.edu.vn.digital_signature.dto.common.response.Response;
import sis.hust.edu.vn.digital_signature.dto.verification.PublicVerificationResponse;
import sis.hust.edu.vn.digital_signature.dto.verification.VerificationResponse;
import sis.hust.edu.vn.digital_signature.service.verification.VerificationService;

import java.time.LocalDateTime;
import java.util.stream.Collectors;

/**
 * Public controller for document verification.
 * Accessible without authentication for QR code scanning.
 */
@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
@Slf4j
public class PublicVerificationController extends BaseController {

    private final VerificationService verificationService;

    /**
     * Public endpoint for verifying a document via QR code scan.
     * Does not require authentication.
     * 
     * @param documentId The document ID to verify
     * @return Public verification result with limited information
     */
    @GetMapping("/verify/{documentId}")
    public ResponseEntity<Response<PublicVerificationResponse>> publicVerifyDocument(
            @PathVariable String documentId) {
        
        log.info("Public verification request for document: {}", documentId);
        
        try {
            // Use existing verification service
            VerificationResponse fullResponse = verificationService.verifyDocument(documentId);
            
            // Convert to public response with limited info
            PublicVerificationResponse publicResponse = PublicVerificationResponse.builder()
                    .documentId(fullResponse.getDocumentId())
                    .documentTitle(fullResponse.getDocumentTitle())
                    .valid(fullResponse.isValid())
                    .documentModified(fullResponse.isDocumentModified())
                    .validSignatures(fullResponse.getValidSignatures())
                    .totalSignatures(fullResponse.getTotalSignatures())
                    .signerNames(fullResponse.getSignatures().stream()
                            .map(sig -> sig.getSignerName())
                            .collect(Collectors.toList()))
                    .verifiedAt(LocalDateTime.now())
                    .statusMessage(getStatusMessage(fullResponse))
                    .build();
            
            return success(publicResponse);
            
        } catch (Exception e) {
            log.error("Public verification failed for document: {}", documentId, e);
            
            // Return a safe error response
            PublicVerificationResponse errorResponse = PublicVerificationResponse.builder()
                    .documentId(documentId)
                    .valid(false)
                    .verifiedAt(LocalDateTime.now())
                    .statusMessage("Document not found or verification failed")
                    .build();
            
            return success(errorResponse);
        }
    }

    /**
     * Generate a user-friendly status message.
     */
    private String getStatusMessage(VerificationResponse response) {
        if (response.getTotalSignatures() == 0) {
            return "No digital signatures found on this document";
        }
        
        if (response.isDocumentModified()) {
            return "WARNING: Document has been modified after signing!";
        }
        
        if (response.isValid()) {
            return String.format("Document is valid with %d verified signature(s)", 
                    response.getValidSignatures());
        }
        
        return "Document verification failed - signatures may be invalid";
    }
}
