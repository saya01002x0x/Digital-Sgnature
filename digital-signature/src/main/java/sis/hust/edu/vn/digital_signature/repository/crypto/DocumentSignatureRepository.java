package sis.hust.edu.vn.digital_signature.repository.crypto;

import org.springframework.stereotype.Repository;
import sis.hust.edu.vn.digital_signature.entity.model.DocumentSignature;
import sis.hust.edu.vn.digital_signature.repository.BaseRepository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DocumentSignatureRepository extends BaseRepository<DocumentSignature, String> {
    List<DocumentSignature> findByDocumentId(String documentId);
    Optional<DocumentSignature> findByDocumentIdAndSignerId(String documentId, String signerId);
    boolean existsByDocumentIdAndSignerId(String documentId, String signerId);
}
