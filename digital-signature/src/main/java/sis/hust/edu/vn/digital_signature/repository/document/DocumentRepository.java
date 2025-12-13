package sis.hust.edu.vn.digital_signature.repository.document;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import sis.hust.edu.vn.digital_signature.entity.enums.DocumentStatus;
import sis.hust.edu.vn.digital_signature.entity.model.Document;
import sis.hust.edu.vn.digital_signature.repository.BaseRepository;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

@Repository
public interface DocumentRepository extends BaseRepository<Document, String>, JpaSpecificationExecutor<Document> {

    
    // Custom query removed in favor of Specifications

}

