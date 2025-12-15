package sis.hust.edu.vn.digital_signature.controller.verification;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sis.hust.edu.vn.digital_signature.controller.BaseController;
import sis.hust.edu.vn.digital_signature.dto.common.response.Response;
import sis.hust.edu.vn.digital_signature.dto.verification.VerificationResponse;
import sis.hust.edu.vn.digital_signature.service.verification.VerificationService;

/**
 * Controller for document verification endpoints.
 * Allows verifying the integrity and authenticity of signed documents.
 */
@RestController
@RequestMapping("/api/documents")
@RequiredArgsConstructor
public class VerificationController extends BaseController {

    private final VerificationService verificationService;

    /**
     * Verify all digital signatures on a document.
     * Checks both cryptographic validity and document integrity.
     * 
     * @param documentId The document ID to verify
     * @return Verification result with signature details
     */
    @GetMapping("/{documentId}/verify")
    public ResponseEntity<Response<VerificationResponse>> verifyDocument(
            @PathVariable String documentId) {
        VerificationResponse response = verificationService.verifyDocument(documentId);
        return success(response);
    }
}
