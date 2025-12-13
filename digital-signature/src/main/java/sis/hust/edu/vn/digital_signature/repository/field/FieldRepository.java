package sis.hust.edu.vn.digital_signature.repository.field;

import org.springframework.stereotype.Repository;
import sis.hust.edu.vn.digital_signature.entity.model.Field;
import sis.hust.edu.vn.digital_signature.repository.BaseRepository;

import java.util.List;

@Repository
public interface FieldRepository extends BaseRepository<Field, String> {
    List<Field> findByDocumentId(String documentId);
    List<Field> findBySignerId(String signerId);
}

