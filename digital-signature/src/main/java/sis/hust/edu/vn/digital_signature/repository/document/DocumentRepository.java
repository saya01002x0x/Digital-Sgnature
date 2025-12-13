package sis.hust.edu.vn.digital_signature.repository.document;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import sis.hust.edu.vn.digital_signature.entity.enums.DocumentStatus;
import sis.hust.edu.vn.digital_signature.entity.model.Document;
import sis.hust.edu.vn.digital_signature.repository.BaseRepository;

@Repository
public interface DocumentRepository extends BaseRepository<Document, String> {
    
    @Query("SELECT d FROM Document d WHERE d.ownerId = :ownerId " +
           "AND (:status IS NULL OR d.status = :status) " +
           "AND (:search IS NULL OR LOWER(d.title) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Document> findByOwnerIdAndFilters(
            @Param("ownerId") String ownerId,
            @Param("status") DocumentStatus status,
            @Param("search") String search,
            Pageable pageable);
}

