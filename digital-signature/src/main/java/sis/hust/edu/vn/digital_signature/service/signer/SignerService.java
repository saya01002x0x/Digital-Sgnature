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

        // Validate status = PENDING
        if (signer.getStatus() != SignerStatus.PENDING) {
            throw new BusinessException("Signing session is no longer available. Status: " + signer.getStatus());
        }

        // Get document
        Document document = documentRepository.findById(signer.getDocumentId())
                .orElseThrow(() -> new EntityNotFoundException("Document not found"));

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

        // Update signer status = SIGNED, signedAt = now
        signer.setStatus(SignerStatus.SIGNED);
        signer.setSignedAt(LocalDateTime.now());
        signer = signerRepository.save(signer);

        // Check if all signers signed → update document status = DONE, completedAt = now
        Document document = documentRepository.findById(signer.getDocumentId())
                .orElseThrow(() -> new EntityNotFoundException("Document not found"));

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

    @Transactional
    public DeclineResponse declineSigning(String token, DeclineRequest request) {
        // Validate signer exists and status = PENDING
        Signer signer = signerRepository.findByToken(token)
                .orElseThrow(() -> new EntityNotFoundException("Invalid signing token"));

        if (signer.getStatus() != SignerStatus.PENDING) {
            throw new BusinessException("Signing session is no longer available. Status: " + signer.getStatus());
        }

        // Validate reason length
        if (request.getReason() == null || request.getReason().trim().length() < 10) {
            throw new BusinessException("Decline reason must be at least 10 characters");
        }

        // Update signer status = DECLINED, declinedAt = now, declineReason
        signer.setStatus(SignerStatus.DECLINED);
        signer.setDeclinedAt(LocalDateTime.now());
        signer.setDeclineReason(request.getReason());
        signer = signerRepository.save(signer);

        // Update document status = DECLINED, declinedAt = now, declinedBy = signer.id
        Document document = documentRepository.findById(signer.getDocumentId())
                .orElseThrow(() -> new EntityNotFoundException("Document not found"));

        document.setStatus(DocumentStatus.DECLINED);
        document.setDeclinedAt(LocalDateTime.now());
        document.setDeclinedBy(signer.getId());
        document.setDeclineReason(request.getReason());
        document = documentRepository.save(document);

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

        return DeclineResponse.builder()
                .signer(signerResponse)
                .document(document)
                .build();
    }
}

