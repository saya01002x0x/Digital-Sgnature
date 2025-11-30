package sis.hust.edu.vn.digital_signature.repository.file;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import sis.hust.edu.vn.digital_signature.entity.model.File;

@Repository
public interface FileRepository extends JpaRepository<File, String> {
}

