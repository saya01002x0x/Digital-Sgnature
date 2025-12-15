package sis.hust.edu.vn.digital_signature.service.crypto;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sis.hust.edu.vn.digital_signature.entity.model.DocumentSignature;
import sis.hust.edu.vn.digital_signature.entity.model.User;
import sis.hust.edu.vn.digital_signature.entity.model.UserKeyPair;
import sis.hust.edu.vn.digital_signature.repository.crypto.DocumentSignatureRepository;
import sis.hust.edu.vn.digital_signature.repository.user.UserRepository;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.PrivateKey;
import java.time.LocalDateTime;

/**
 * Service for creating digital signatures during document signing.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class DigitalSignatureService {

    private final CryptoService cryptoService;
    private final KeyPairService keyPairService;
    private final DocumentSignatureRepository documentSignatureRepository;
    private final UserRepository userRepository;

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    /**
     * Create a digital signature for a document during the signing process.
     * Only registered users can create digital signatures.
     * 
     * @param documentId The document being signed
     * @param signerId The signer record ID
     * @param signerEmail The signer's email
     * @param fileUrl The document file URL
     * @return The created DocumentSignature, or null if user is not registered
     */
    @Transactional
    public DocumentSignature createDigitalSignature(String documentId, String signerId, 
            String signerEmail, String fileUrl) {
        
        // Find user by email - only registered users can create digital signatures
        User user = userRepository.findByEmail(signerEmail).orElse(null);
        
        if (user == null) {
            log.info("Signer {} is not a registered user, skipping digital signature", signerEmail);
            return null;
        }

        // Check if digital signature already exists for this signer on this document
        if (documentSignatureRepository.existsByDocumentIdAndSignerId(documentId, signerId)) {
            log.warn("Digital signature already exists for document {} and signer {}", 
                    documentId, signerId);
            return documentSignatureRepository.findByDocumentIdAndSignerId(documentId, signerId)
                    .orElse(null);
        }

        // Get or create user's key pair
        UserKeyPair keyPair = keyPairService.getOrCreateKeyPair(user.getId());
        
        // Get document bytes and calculate hash
        byte[] documentBytes = getDocumentBytes(fileUrl);
        String documentHash = cryptoService.hashDocument(documentBytes);
        
        // Sign the document hash
        PrivateKey privateKey = cryptoService.decryptPrivateKey(keyPair.getPrivateKeyEncrypted());
        String signature = cryptoService.signData(documentHash, privateKey);
        
        // Create and save document signature record
        DocumentSignature docSignature = DocumentSignature.builder()
                .documentId(documentId)
                .signerId(signerId)
                .userId(user.getId())
                .documentHash(documentHash)
                .signature(signature)
                .algorithm(cryptoService.getSignatureAlgorithm())
                .signedAt(LocalDateTime.now())
                .isValid(true)
                .build();

        DocumentSignature saved = documentSignatureRepository.save(docSignature);
        
        log.info("Created digital signature for document {} by user {} (signer {})", 
                documentId, user.getEmail(), signerId);
        
        return saved;
    }

    /**
     * Read document bytes from file storage.
     */
    private byte[] getDocumentBytes(String fileUrl) {
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
