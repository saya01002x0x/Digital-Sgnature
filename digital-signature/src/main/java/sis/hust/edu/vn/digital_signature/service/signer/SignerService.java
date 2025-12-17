package sis.hust.edu.vn.digital_signature.service.signer;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sis.hust.edu.vn.digital_signature.dto.signer.*;
import sis.hust.edu.vn.digital_signature.entity.enums.DocumentStatus;
import sis.hust.edu.vn.digital_signature.entity.enums.SignerStatus;
import sis.hust.edu.vn.digital_signature.entity.model.Document;
import sis.hust.edu.vn.digital_signature.entity.model.Field;
import sis.hust.edu.vn.digital_signature.entity.model.Signer;
import sis.hust.edu.vn.digital_signature.exception.business.BusinessException;
import sis.hust.edu.vn.digital_signature.exception.entity.EntityNotFoundException;
import sis.hust.edu.vn.digital_signature.repository.document.DocumentRepository;
import sis.hust.edu.vn.digital_signature.repository.field.FieldRepository;
import sis.hust.edu.vn.digital_signature.repository.signer.SignerRepository;
import sis.hust.edu.vn.digital_signature.service.crypto.DigitalSignatureService;
import sis.hust.edu.vn.digital_signature.service.storage.StorageService;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class SignerService {

    private final SignerRepository signerRepository;
    private final DocumentRepository documentRepository;
    private final FieldRepository fieldRepository;
    private final DigitalSignatureService digitalSignatureService;
    private final StorageService storageService;

    @Value("${frontend.url:http://localhost:5556}")
    private String frontendUrl;

    @Transactional
    public InviteSignersResponse inviteSigners(String documentId, InviteSignersRequest request, String ownerId) {
        // Validate document exists, status = DRAFT, owner = current user
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new EntityNotFoundException("Document not found"));

        if (document.getStatus() != DocumentStatus.DRAFT) {
            throw new BusinessException("Cannot invite signers to document with status: " + document.getStatus());
        }

        if (!document.getOwnerId().equals(ownerId)) {
            throw new BusinessException("Only document owner can invite signers");
        }

        // Update document status to SIGNING
        document.setStatus(DocumentStatus.SIGNING);
        document = documentRepository.save(document);

        // Create Signer records with token
        List<Signer> signers = request.getSigners().stream()
                .map(signerRequest -> {
                    String token = UUID.randomUUID().toString();
                    return Signer.builder()
                            .documentId(documentId)
                            .email(signerRequest.getEmail())
                            .name(signerRequest.getName())
                            .token(token)
                            .order(signerRequest.getOrder())
                            .status(SignerStatus.PENDING)
                            .build();
                })
                .collect(Collectors.toList());

        List<Signer> savedSigners = signerRepository.saveAll(signers);

        // Assign fields to signers based on fieldAssignments (fieldId -> signerEmail)
        if (request.getFieldAssignments() != null && !request.getFieldAssignments().isEmpty()) {
            // Create email -> signerId map for quick lookup
            java.util.Map<String, String> emailToSignerId = savedSigners.stream()
                    .collect(Collectors.toMap(Signer::getEmail, Signer::getId));

            for (java.util.Map.Entry<String, String> entry : request.getFieldAssignments().entrySet()) {
                String fieldId = entry.getKey();
                String signerEmail = entry.getValue();

                // Find the signer ID for this email
                String signerId = emailToSignerId.get(signerEmail);
                if (signerId != null) {
                    // Update the field with the signer ID
                    Field field = fieldRepository.findById(fieldId).orElse(null);
                    if (field != null && field.getDocumentId().equals(documentId)) {
                        field.setSignerId(signerId);
                        fieldRepository.save(field);
                    }
                }
            }
        }

        // Generate signingUrl for each signer
        List<SignerResponse> signerResponses = savedSigners.stream()
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

        return InviteSignersResponse.builder()
                .document(document)
                .signers(signerResponses)
                .build();
    }

    public SigningSessionResponse getSigningSession(String token) {
        // Find signer by token
        Signer signer = signerRepository.findByToken(token)
                .orElseThrow(() -> new EntityNotFoundException("Invalid signing token"));

        // Get document first to check document-level status
        Document document = documentRepository.findById(signer.getDocumentId())
                .orElseThrow(() -> new EntityNotFoundException("Document not found"));

        // Check document status - if document is DECLINED or DONE, signing is not allowed
        if (document.getStatus() == DocumentStatus.DECLINED) {
            throw new BusinessException("This document has been declined and signing is no longer available.");
        }
        if (document.getStatus() == DocumentStatus.DONE) {
            throw new BusinessException("This document has been completed. All signatures have been collected.");
        }
        if (document.getStatus() == DocumentStatus.DRAFT) {
            throw new BusinessException("This document is not ready for signing yet.");
        }

        // Validate this signer's status = PENDING (each signer has their own status)
        if (signer.getStatus() == SignerStatus.SIGNED) {
            throw new BusinessException("You have already signed this document.");
        }
        if (signer.getStatus() == SignerStatus.DECLINED) {
            throw new BusinessException("You have declined to sign this document.");
        }
        if (signer.getStatus() != SignerStatus.PENDING) {
            throw new BusinessException("Signing session is no longer available. Status: " + signer.getStatus());
        }

        // Get fields assigned to this signer
        List<Field> fields = fieldRepository.findBySignerId(signer.getId());

        // Get all signers for display
        List<Signer> allSigners = signerRepository.findByDocumentId(signer.getDocumentId());
        List<SignerResponse> allSignerResponses = allSigners.stream()
                .map(s -> {
                    String signingUrl = frontendUrl + "/signing/" + s.getToken();
                    return SignerResponse.builder()
                            .id(s.getId())
                            .documentId(s.getDocumentId())
                            .email(s.getEmail())
                            .name(s.getName())
                            .order(s.getOrder())
                            .status(s.getStatus().name())
                            .signingUrl(signingUrl)
                            .signedAt(s.getSignedAt())
                            .declinedAt(s.getDeclinedAt())
                            .declineReason(s.getDeclineReason())
                            .createdAt(s.getCreatedAt())
                            .updatedAt(s.getUpdatedAt())
                            .build();
                })
                .collect(Collectors.toList());

        // Build signer response
        String signingUrl = frontendUrl + "/signing/" + signer.getToken();
        SignerResponse signerResponse = SignerResponse.builder()
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

        // Refresh fileUrl to ensure it's always a valid proxy URL
        document.setFileUrl(refreshFileUrl(document.getFileUrl()));

        return SigningSessionResponse.builder()
                .document(document)
                .signer(signerResponse)
                .fields(fields)
                .allSigners(allSignerResponses)
                .build();
    }

    @Transactional
    public SigningCompleteResponse completeSigning(String token, SigningCompleteRequest request) {
        // Validate signer exists and status = PENDING
        Signer signer = signerRepository.findByToken(token)
                .orElseThrow(() -> new EntityNotFoundException("Invalid signing token"));

        if (signer.getStatus() != SignerStatus.PENDING) {
            throw new BusinessException("Signing session is no longer available. Status: " + signer.getStatus());
        }

        // Update field values
        for (FieldValue fieldValue : request.getFieldValues()) {
            Field field = fieldRepository.findById(fieldValue.getFieldId())
                    .orElseThrow(() -> new EntityNotFoundException("Field not found: " + fieldValue.getFieldId()));
            
            // Validate field belongs to this signer
            if (!field.getSignerId().equals(signer.getId())) {
                throw new BusinessException("Field does not belong to this signer");
            }
            
            field.setValue(fieldValue.getValue());
            fieldRepository.save(field);
        }

        // Get document for digital signature
        Document document = documentRepository.findById(signer.getDocumentId())
                .orElseThrow(() -> new EntityNotFoundException("Document not found"));

        // === PKI: Create Digital Signature ===
        // This creates a cryptographic signature using the signer's RSA private key
        // Only works for registered users (external signers won't have digital signatures)
        try {
            digitalSignatureService.createDigitalSignature(
                    document.getId(),
                    signer.getId(),
                    signer.getEmail(),
                    document.getFileUrl()
            );
        } catch (Exception e) {
            log.warn("Failed to create digital signature for signer {}: {}", 
                    signer.getEmail(), e.getMessage());
            // Continue with signing even if digital signature fails
            // This allows external signers (without accounts) to still complete signing
        }

        // Update signer status = SIGNED, signedAt = now
        signer.setStatus(SignerStatus.SIGNED);
        signer.setSignedAt(LocalDateTime.now());
        signer = signerRepository.save(signer);

        // Check if all signers signed → update document status = DONE, completedAt = now
        long totalSigners = signerRepository.countByDocumentIdAndStatus(document.getId(), SignerStatus.PENDING);
        if (totalSigners == 0) {
            // All signers have signed
            document.setStatus(DocumentStatus.DONE);
            document.setCompletedAt(LocalDateTime.now());
            document = documentRepository.save(document);
        }

        // Build response
        String signingUrl = frontendUrl + "/signing/" + signer.getToken();
        SignerResponse signerResponse = SignerResponse.builder()
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

        return SigningCompleteResponse.builder()
                .signer(signerResponse)
                .document(document)
                .build();
    }

// File: digital-signature/src/main/java/sis.hust.edu.vn/digital_signature/service/signer/SignerService.java

// ... (Các imports và khai báo lớp giữ nguyên)

    @Transactional
    public DeclineResponse declineSigning(String token, DeclineRequest request) {
        // 1. Validate signer exists
        Signer signer = signerRepository.findByToken(token)
                .orElseThrow(() -> new EntityNotFoundException("Invalid signing token")); //

        // 2. Validate status = PENDING (chỉ cho phép từ chối khi đang chờ ký)
        if (signer.getStatus() != SignerStatus.PENDING) {
            throw new BusinessException("Signing session is no longer available. Status: " + signer.getStatus()); //
        }

        // 3. Validate reason length
        if (request.getReason() == null || request.getReason().trim().length() < 10) {
            // BusinessException là cách tốt nhất để trả về 400 Bad Request cho Spring
            throw new BusinessException("Decline reason must be at least 10 characters"); //
        }

        // 4. Update Signer (Status -> DECLINED)
        signer.setStatus(SignerStatus.DECLINED); //
        signer.setDeclinedAt(LocalDateTime.now()); //
        signer.setDeclineReason(request.getReason()); //
        signer = signerRepository.save(signer); //

        // 5. Update Document (Status -> DECLINED)
        Document document = documentRepository.findById(signer.getDocumentId())
                .orElseThrow(() -> new EntityNotFoundException("Document not found")); //

        document.setStatus(DocumentStatus.DECLINED); //
        document.setDeclinedAt(LocalDateTime.now()); //
        document.setDeclinedBy(signer.getId()); //
        document.setDeclineReason(request.getReason()); //
        document = documentRepository.save(document); //

        // 6. Build response
        String signingUrl = frontendUrl + "/signing/" + signer.getToken(); //
        SignerResponse signerResponse = SignerResponse.builder()
                .id(signer.getId()) //
                .documentId(signer.getDocumentId()) //
                .email(signer.getEmail()) //
                .name(signer.getName()) //
                .order(signer.getOrder()) //
                .status(signer.getStatus().name()) //
                .signingUrl(signingUrl) //
                .signedAt(signer.getSignedAt()) //
                .declinedAt(signer.getDeclinedAt()) //
                .declineReason(signer.getDeclineReason()) //
                .createdAt(signer.getCreatedAt()) //
                .updatedAt(signer.getUpdatedAt()) //
                .build();

        return DeclineResponse.builder()
                .signer(signerResponse) //
                .document(document) //
                .build();
    }

    @Transactional
    public SelfSignResponse selfSign(String documentId, String ownerId, String ownerEmail, String ownerName) {
        // Validate document exists, status = DRAFT, owner = current user
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new EntityNotFoundException("Document not found"));

        if (document.getStatus() != DocumentStatus.DRAFT) {
            throw new BusinessException("Cannot self-sign document with status: " + document.getStatus());
        }

        if (!document.getOwnerId().equals(ownerId)) {
            throw new BusinessException("Only document owner can self-sign");
        }

        // Check if owner already has a signer record
        List<Signer> existingSigners = signerRepository.findByDocumentId(documentId);
        Signer ownerSigner = existingSigners.stream()
                .filter(s -> s.getEmail().equals(ownerEmail))
                .findFirst()
                .orElse(null);

        if (ownerSigner != null) {
            // Owner already invited as signer, return existing signing URL
            String signingUrl = frontendUrl + "/signing/" + ownerSigner.getToken();
            SignerResponse signerResponse = SignerResponse.builder()
                    .id(ownerSigner.getId())
                    .documentId(ownerSigner.getDocumentId())
                    .email(ownerSigner.getEmail())
                    .name(ownerSigner.getName())
                    .order(ownerSigner.getOrder())
                    .status(ownerSigner.getStatus().name())
                    .signingUrl(signingUrl)
                    .signedAt(ownerSigner.getSignedAt())
                    .declinedAt(ownerSigner.getDeclinedAt())
                    .declineReason(ownerSigner.getDeclineReason())
                    .createdAt(ownerSigner.getCreatedAt())
                    .updatedAt(ownerSigner.getUpdatedAt())
                    .build();

            return SelfSignResponse.builder()
                    .signingUrl(signingUrl)
                    .signer(signerResponse)
                    .build();
        }

        // Create new signer for owner
        String token = UUID.randomUUID().toString();
        Signer signer = Signer.builder()
                .documentId(documentId)
                .email(ownerEmail)
                .name(ownerName)
                .token(token)
                .order(1) // Owner gets order 1
                .status(SignerStatus.PENDING)
                .build();

        signer = signerRepository.save(signer);

        // Assign all unassigned fields to this signer
        List<Field> unassignedFields = fieldRepository.findByDocumentIdAndSignerIdIsNull(documentId);
        for (Field field : unassignedFields) {
            field.setSignerId(signer.getId());
            fieldRepository.save(field);
        }

        // Update document status to SIGNING
        document.setStatus(DocumentStatus.SIGNING);
        documentRepository.save(document);

        // Build response
        String signingUrl = frontendUrl + "/signing/" + token;
        SignerResponse signerResponse = SignerResponse.builder()
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

        return SelfSignResponse.builder()
                .signingUrl(signingUrl)
                .signer(signerResponse)
                .build();
    }

    /**
     * Extract fileName from any URL format and generate fresh proxy URL.
     * Handles both old R2 presigned URLs and new proxy URLs.
     */
    private String refreshFileUrl(String storedFileUrl) {
        if (storedFileUrl == null || storedFileUrl.isEmpty()) {
            return storedFileUrl;
        }
        
        String fileName;
        if (storedFileUrl.contains("?")) {
            // R2 URL with query params
            String pathPart = storedFileUrl.split("\\?")[0];
            fileName = pathPart.substring(pathPart.lastIndexOf("/") + 1);
        } else {
            fileName = storedFileUrl.substring(storedFileUrl.lastIndexOf("/") + 1);
        }
        
        return storageService.getFileUrl(fileName);
    }
}

