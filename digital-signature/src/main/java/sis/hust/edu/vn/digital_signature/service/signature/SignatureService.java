package sis.hust.edu.vn.digital_signature.service.signature;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sis.hust.edu.vn.digital_signature.dto.signature.CreateSignatureRequest;
import sis.hust.edu.vn.digital_signature.dto.signature.UpdateSignatureRequest;
import sis.hust.edu.vn.digital_signature.entity.model.Signature;
import sis.hust.edu.vn.digital_signature.exception.entity.EntityNotFoundException;
import sis.hust.edu.vn.digital_signature.repository.signature.SignatureRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class SignatureService {

    private final SignatureRepository signatureRepository;

    public List<Signature> listSignatures(String userId) {
        return signatureRepository.findByUserId(userId);
    }

    public Signature getSignatureById(String id, String userId) {
        return signatureRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new EntityNotFoundException("Signature not found"));
    }

    @Transactional
    public Signature createSignature(CreateSignatureRequest request, String userId) {
        log.info("Creating signature for userId: {}, type: {}", userId, request.getType());
        
        // If this is the first signature for user, set it as default
        List<Signature> existingSignatures = signatureRepository.findByUserId(userId);
        boolean isDefault = existingSignatures.isEmpty();
        log.info("Found {} existing signatures. Setting new signature as default: {}", existingSignatures.size(), isDefault);

        Signature signature = Signature.builder()
                .userId(userId)
                .type(request.getType())
                .imageData(request.getImageData())
                .name(request.getName())
                .isDefault(isDefault)
                .build();

        Signature savedSignature = signatureRepository.save(signature);
        log.info("Saved signature to DB: ID={}, Default={}", savedSignature.getId(), savedSignature.getIsDefault());
        return savedSignature;
    }

    @Transactional
    public Signature updateSignature(String id, UpdateSignatureRequest request, String userId) {
        Signature signature = getSignatureById(id, userId);

        if (request.getName() != null) {
            signature.setName(request.getName());
        }

        return signatureRepository.save(signature);
    }

    @Transactional
    public void deleteSignature(String id, String userId) {
        Signature signature = getSignatureById(id, userId);
        signatureRepository.delete(signature);
    }

    @Transactional
    public Signature setDefaultSignature(String id, String userId) {
        Signature signature = getSignatureById(id, userId);

        // Clear all defaults for this user
        signatureRepository.clearDefaultForUser(userId);

        // Set this signature as default
        signature.setIsDefault(true);
        return signatureRepository.save(signature);
    }
}

