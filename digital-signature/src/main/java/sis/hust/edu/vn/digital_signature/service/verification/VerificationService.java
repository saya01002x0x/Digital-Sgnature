package sis.hust.edu.vn.digital_signature.service.verification;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import sis.hust.edu.vn.digital_signature.dto.verification.SignatureVerification;
import sis.hust.edu.vn.digital_signature.dto.verification.VerificationResponse;
import sis.hust.edu.vn.digital_signature.entity.model.Document;
import sis.hust.edu.vn.digital_signature.entity.model.DocumentSignature;
import sis.hust.edu.vn.digital_signature.entity.model.Signer;
import sis.hust.edu.vn.digital_signature.entity.model.UserKeyPair;
import sis.hust.edu.vn.digital_signature.exception.entity.EntityNotFoundException;
import sis.hust.edu.vn.digital_signature.repository.crypto.DocumentSignatureRepository;
import sis.hust.edu.vn.digital_signature.repository.crypto.UserKeyPairRepository;
import sis.hust.edu.vn.digital_signature.repository.document.DocumentRepository;
import sis.hust.edu.vn.digital_signature.repository.signer.SignerRepository;
import sis.hust.edu.vn.digital_signature.service.crypto.CryptoService;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.PublicKey;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Service for verifying document integrity and digital signatures.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class VerificationService {

    private final DocumentRepository documentRepository;
    private final DocumentSignatureRepository documentSignatureRepository;
    private final UserKeyPairRepository userKeyPairRepository;
    private final SignerRepository signerRepository;
    private final CryptoService cryptoService;

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    /**
     * Verify all digital signatures on a document.
     * Checks both cryptographic validity and document integrity (hash comparison).
     */
    public VerificationResponse verifyDocument(String documentId) {
        log.info("Starting verification for document: {}", documentId);

        // 1. Get document
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new EntityNotFoundException("Document not found"));

        // 2. Get all digital signatures for this document
        List<DocumentSignature> signatures = documentSignatureRepository.findByDocumentId(documentId);

        if (signatures.isEmpty()) {
            log.warn("No digital signatures found for document: {}", documentId);
            return VerificationResponse.builder()
                    .documentId(documentId)
                    .documentTitle(document.getTitle())
                    .valid(false)
                    .documentModified(false)
                    .currentHash(null)
                    .signatures(new ArrayList<>())
                    .totalSignatures(0)
                    .validSignatures(0)
                    .verifiedAt(LocalDateTime.now())
                    .build();
        }

        // 3. Calculate current document hash
        String currentHash = calculateCurrentDocumentHash(document);

        // 4. Verify each signature
        List<SignatureVerification> verificationResults = new ArrayList<>();
        int validCount = 0;
        boolean anyModified = false;

        for (DocumentSignature docSig : signatures) {
            SignatureVerification verification = verifySingleSignature(docSig, currentHash);
            verificationResults.add(verification);

            if (verification.isSignatureValid() && verification.isHashMatches()) {
                validCount++;
            }
            if (!verification.isHashMatches()) {
                anyModified = true;
            }
        }

        // 5. Build response
        boolean allValid = validCount == signatures.size() && !anyModified;

        VerificationResponse response = VerificationResponse.builder()
                .documentId(documentId)
                .documentTitle(document.getTitle())
                .valid(allValid)
                .documentModified(anyModified)
                .currentHash(currentHash)
                .signatures(verificationResults)
                .totalSignatures(signatures.size())
                .validSignatures(validCount)
                .verifiedAt(LocalDateTime.now())
                .build();

        log.info("Verification complete for document {}. Valid: {}, Modified: {}", 
                documentId, allValid, anyModified);

        return response;
    }

    /**
     * Verify a single digital signature.
     */
    private SignatureVerification verifySingleSignature(DocumentSignature docSig, String currentHash) {
        // Get signer info
        Signer signer = signerRepository.findById(docSig.getSignerId()).orElse(null);
        String signerName = signer != null ? signer.getName() : "Unknown";
        String signerEmail = signer != null ? signer.getEmail() : "Unknown";

        // Check if hash matches (document integrity)
        boolean hashMatches = docSig.getDocumentHash().equals(currentHash);

        // Verify cryptographic signature
        boolean signatureValid = false;
        String statusMessage;

        try {
            // Get user's public key
            UserKeyPair keyPair = userKeyPairRepository.findByUserId(docSig.getUserId()).orElse(null);
            
            if (keyPair == null) {
                statusMessage = "Public key not found for signer";
            } else {
                PublicKey publicKey = cryptoService.base64ToPublicKey(keyPair.getPublicKey());
                signatureValid = cryptoService.verifySignature(
                        docSig.getDocumentHash(), 
                        docSig.getSignature(), 
                        publicKey
                );

                if (signatureValid && hashMatches) {
                    statusMessage = "Signature valid and document unmodified";
                } else if (signatureValid && !hashMatches) {
                    statusMessage = "Signature valid but document has been modified since signing";
                } else {
                    statusMessage = "Signature verification failed";
                }
            }
        } catch (Exception e) {
            log.error("Error verifying signature for signer {}: {}", docSig.getSignerId(), e.getMessage());
            statusMessage = "Error during verification: " + e.getMessage();
        }

        return SignatureVerification.builder()
                .signerId(docSig.getSignerId())
                .signerName(signerName)
                .signerEmail(signerEmail)
                .signatureValid(signatureValid)
                .hashMatches(hashMatches)
                .originalHash(docSig.getDocumentHash())
                .algorithm(docSig.getAlgorithm())
                .signedAt(docSig.getSignedAt())
                .statusMessage(statusMessage)
                .build();
    }

    /**
     * Calculate the current SHA-256 hash of the document file.
     */
    private String calculateCurrentDocumentHash(Document document) {
        try {
            // Extract filename from fileUrl (e.g., "http://localhost:8555/api/files/uuid.pdf" -> "uuid.pdf")
            String fileUrl = document.getFileUrl();
            String fileName = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);
            
            Path filePath = Paths.get(uploadDir, fileName);
            
            if (!Files.exists(filePath)) {
                log.error("Document file not found: {}", filePath);
                throw new RuntimeException("Document file not found");
            }

            byte[] fileBytes = Files.readAllBytes(filePath);
            return cryptoService.hashDocument(fileBytes);
        } catch (IOException e) {
            log.error("Error reading document file: {}", e.getMessage());
            throw new RuntimeException("Error reading document file", e);
        }
    }

    /**
     * Get document file bytes for hashing during signing.
     */
    public byte[] getDocumentBytes(String fileUrl) {
        try {
            String fileName = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);
            Path filePath = Paths.get(uploadDir, fileName);
            return Files.readAllBytes(filePath);
        } catch (IOException e) {
            log.error("Error reading document file: {}", e.getMessage());
            throw new RuntimeException("Error reading document file", e);
        }
    }
}
