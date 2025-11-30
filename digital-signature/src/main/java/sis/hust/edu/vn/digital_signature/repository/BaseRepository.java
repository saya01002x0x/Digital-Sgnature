package sis.hust.edu.vn.digital_signature.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.NoRepositoryBean;
import sis.hust.edu.vn.digital_signature.entity.BaseEntity;

@NoRepositoryBean
public interface BaseRepository<T extends BaseEntity, ID> extends JpaRepository<T, ID> {
}
