package sis.hust.edu.vn.digital_signature.service.base;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import sis.hust.edu.vn.digital_signature.entity.BaseEntity;

import java.util.List;
import java.util.Optional;

public interface BaseService<T extends BaseEntity, ID> {

    T save(T entity);

    T update(ID id, T entity);

    Optional<T> findById(ID id);

    T getById(ID id);

    List<T> findAll();

    Page<T> findAll(Pageable pageable);

    void deleteById(ID id);

    boolean existsById(ID id);
}

