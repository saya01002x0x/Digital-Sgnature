package sis.hust.edu.vn.digital_signature.service.field;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sis.hust.edu.vn.digital_signature.dto.field.CreateFieldRequest;
import sis.hust.edu.vn.digital_signature.dto.field.UpdateFieldRequest;
import sis.hust.edu.vn.digital_signature.entity.enums.DocumentStatus;
import sis.hust.edu.vn.digital_signature.entity.model.Document;
import sis.hust.edu.vn.digital_signature.entity.model.Field;
import sis.hust.edu.vn.digital_signature.exception.business.BusinessException;
import sis.hust.edu.vn.digital_signature.exception.entity.EntityNotFoundException;
import sis.hust.edu.vn.digital_signature.repository.document.DocumentRepository;
import sis.hust.edu.vn.digital_signature.repository.field.FieldRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class FieldService {

    private final FieldRepository fieldRepository;
    private final DocumentRepository documentRepository;

    @Transactional
    public Field createField(String documentId, CreateFieldRequest request) {
        // Validate document exists and status = DRAFT
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new EntityNotFoundException("Document not found"));
        
        if (document.getStatus() != DocumentStatus.DRAFT) {
            throw new BusinessException("Cannot add fields to document with status: " + document.getStatus());
        }

        // Create Field entity
        Field field = Field.builder()
                .documentId(documentId)
                .type(request.getType())
                .pageNumber(request.getPageNumber())
                .positionX(request.getPositionX())
                .positionY(request.getPositionY())
                .width(request.getWidth())
                .height(request.getHeight())
                .signerId(request.getSignerId())
                .isRequired(request.getIsRequired() != null ? request.getIsRequired() : true)
                .placeholder(request.getPlaceholder())
                .build();

        return fieldRepository.save(field);
    }

    @Transactional
    public Field updateField(String fieldId, UpdateFieldRequest request) {
        Field field = fieldRepository.findById(fieldId)
                .orElseThrow(() -> new EntityNotFoundException("Field not found"));

        // Validate document status
        Document document = documentRepository.findById(field.getDocumentId())
                .orElseThrow(() -> new EntityNotFoundException("Document not found"));
        
        if (document.getStatus() != DocumentStatus.DRAFT) {
            throw new BusinessException("Cannot update fields in document with status: " + document.getStatus());
        }

        // Update fields
        if (request.getPositionX() != null) {
            field.setPositionX(request.getPositionX());
        }
        if (request.getPositionY() != null) {
            field.setPositionY(request.getPositionY());
        }
        if (request.getWidth() != null) {
            field.setWidth(request.getWidth());
        }
        if (request.getHeight() != null) {
            field.setHeight(request.getHeight());
        }
        if (request.getSignerId() != null) {
            field.setSignerId(request.getSignerId());
        }

        return fieldRepository.save(field);
    }

    @Transactional
    public void deleteField(String fieldId) {
        Field field = fieldRepository.findById(fieldId)
                .orElseThrow(() -> new EntityNotFoundException("Field not found"));

        // Validate document status
        Document document = documentRepository.findById(field.getDocumentId())
                .orElseThrow(() -> new EntityNotFoundException("Document not found"));
        
        if (document.getStatus() != DocumentStatus.DRAFT) {
            throw new BusinessException("Cannot delete fields from document with status: " + document.getStatus());
        }

        fieldRepository.delete(field);
    }

    public List<Field> getFieldsByDocumentId(String documentId) {
        return fieldRepository.findByDocumentId(documentId);
    }

    public List<Field> getFieldsBySignerId(String signerId) {
        return fieldRepository.findBySignerId(signerId);
    }
}

