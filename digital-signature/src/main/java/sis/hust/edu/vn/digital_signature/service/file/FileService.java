package sis.hust.edu.vn.digital_signature.service.file;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import sis.hust.edu.vn.digital_signature.entity.model.File;
import sis.hust.edu.vn.digital_signature.entity.enums.FileType;
import sis.hust.edu.vn.digital_signature.repository.file.FileRepository;
import sis.hust.edu.vn.digital_signature.service.storage.StorageService;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class FileService {

    private final FileRepository fileRepository;
    private final StorageService storageService;

    public File saveFile(MultipartFile multipartFile, FileType fileType, String uploadedBy) throws IOException {
        if (multipartFile == null || multipartFile.isEmpty()) {
            return null;
        }

        String originalFileName = multipartFile.getOriginalFilename();
        String fileExtension = getFileExtension(originalFileName);
        String fileName = UUID.randomUUID().toString() + fileExtension;

        // Upload to storage (local or R2)
        storageService.upload(
                multipartFile.getInputStream(),
                fileName,
                multipartFile.getContentType(),
                multipartFile.getSize()
        );

        // Get the file URL (for local: API endpoint, for R2: pre-signed URL will be generated on demand)
        String fileUrl = storageService.getFileUrl(fileName);

        File file = File.builder()
                .fileName(fileName)
                .originalName(originalFileName)
                .filePath(fileName) // Store just the key/fileName for both local and R2
                .fileUrl(fileUrl)
                .fileSize(multipartFile.getSize())
                .mimeType(multipartFile.getContentType())
                .fileType(fileType)
                .uploadedAt(LocalDateTime.now())
                .uploadedBy(uploadedBy)
                .build();

        return fileRepository.save(file);
    }

    /**
     * Get file content as bytes.
     * Used internally for operations like digital signature.
     */
    public byte[] getFileBytes(String fileName) {
        return storageService.download(fileName);
    }

    /**
     * Get URL for accessing the file.
     * For R2: returns a fresh pre-signed URL.
     * For local: returns the API endpoint.
     */
    public String getFileUrl(String fileName) {
        return storageService.getFileUrl(fileName);
    }

    private String getFileExtension(String fileName) {
        if (fileName == null || !fileName.contains(".")) {
            return "";
        }
        return fileName.substring(fileName.lastIndexOf("."));
    }

    public void deleteFile(String fileId) {
        fileRepository.findById(fileId).ifPresent(file -> {
            try {
                // Delete from storage
                storageService.delete(file.getFileName());
                fileRepository.delete(file);
                log.info("File deleted: {}", fileId);
            } catch (Exception e) {
                log.error("Error deleting file: {}", fileId, e);
            }
        });
    }
}
