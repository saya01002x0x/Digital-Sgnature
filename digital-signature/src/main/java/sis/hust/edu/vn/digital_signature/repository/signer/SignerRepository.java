package sis.hust.edu.vn.digital_signature.repository.signer;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import sis.hust.edu.vn.digital_signature.entity.enums.SignerStatus;
import sis.hust.edu.vn.digital_signature.entity.model.Signer;
import sis.hust.edu.vn.digital_signature.repository.BaseRepository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SignerRepository extends BaseRepository<Signer, String> {
    List<Signer> findByDocumentId(String documentId);
    Optional<Signer> findByToken(String token);
    long countByDocumentIdAndStatus(String documentId, SignerStatus status);
    
    /**
     * Find all document IDs where user is a signer by email
     */
    @Query("SELECT DISTINCT s.documentId FROM Signer s WHERE s.email = :email")
    List<String> findDocumentIdsBySignerEmail(@Param("email") String email);
}

