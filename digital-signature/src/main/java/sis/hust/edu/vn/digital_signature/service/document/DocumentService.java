package sis.hust.edu.vn.digital_signature.service.document;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import sis.hust.edu.vn.digital_signature.entity.enums.DocumentStatus;
import sis.hust.edu.vn.digital_signature.entity.enums.FileType;
import sis.hust.edu.vn.digital_signature.entity.model.Document;
import sis.hust.edu.vn.digital_signature.entity.model.File;
import sis.hust.edu.vn.digital_signature.exception.business.BusinessException;
import sis.hust.edu.vn.digital_signature.exception.entity.EntityNotFoundException;
import sis.hust.edu.vn.digital_signature.repository.document.DocumentRepository;
import sis.hust.edu.vn.digital_signature.service.file.FileService;

import java.io.IOException;

@Service
@RequiredArgsConstructor
@Slf4j
public class DocumentService {

    private final FileService fileService;
    private final DocumentRepository documentRepository;

    public Document uploadDocument(MultipartFile multipartFile, String title, String ownerId) throws IOException {
        // Save file using FileService
        File savedFile = fileService.saveFile(multipartFile, FileType.DOCUMENT, ownerId);
        
        if (savedFile == null) {
            throw new BusinessException("Failed to save file");
        }

        // Use file name as title if title is not provided
        String documentTitle = title != null && !title.trim().isEmpty() 
            ? title 
            : savedFile.getOriginalName();

        // Create Document entity
        Document document = Document.builder()
                .title(documentTitle)
                .fileUrl(savedFile.getFileUrl())
                .fileSize(savedFile.getFileSize())
                .pageCount(1) // TODO: Extract actual page count from PDF using PDF library
                .status(sis.hust.edu.vn.digital_signature.entity.enums.DocumentStatus.DRAFT)
                .ownerId(ownerId)
                .build();

        // Save and return Document
        return documentRepository.save(document);
    }

    public Page<Document> listDocuments(String ownerId, DocumentStatus status, String search, Pageable pageable) {
        return documentRepository.findByOwnerIdAndFilters(ownerId, status, search, pageable);
    }

    public Document getDocumentById(String documentId, String ownerId) {
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new EntityNotFoundException("Document not found"));
        
        // Check ownership
        if (!document.getOwnerId().equals(ownerId)) {
            throw new BusinessException("Access denied");
        }
        
        return document;
    }

    public Document updateDocument(String documentId, String title, String ownerId) {
        Document document = getDocumentById(documentId, ownerId);
        
        // Only allow update if status is DRAFT
        if (document.getStatus() != DocumentStatus.DRAFT) {
            throw new BusinessException("Cannot update document with status: " + document.getStatus());
        }
        
        if (title != null && !title.trim().isEmpty()) {
            document.setTitle(title);
        }
        
        return documentRepository.save(document);
    }

    public void deleteDocument(String documentId, String ownerId) {
        Document document = getDocumentById(documentId, ownerId);
        
        // Only allow delete if status is DRAFT
        if (document.getStatus() != DocumentStatus.DRAFT) {
            throw new BusinessException("Cannot delete document with status: " + document.getStatus());
        }
        
        documentRepository.delete(document);
    }
}

