package sis.hust.edu.vn.digital_signature.service.storage;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

/**
 * Local filesystem storage implementation.
 * Used for development and when STORAGE_TYPE=local.
 */
@Slf4j
public class LocalStorageService implements StorageService {

    private final String uploadDir;
    private final String baseUrl;

    public LocalStorageService(
            @Value("${storage.local.upload-dir:uploads}") String uploadDir,
            @Value("${storage.local.base-url:http://localhost:5555}") String baseUrl) {
        this.uploadDir = uploadDir;
        this.baseUrl = baseUrl;
        
        // Ensure upload directory exists
        try {
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
                log.info("Created upload directory: {}", uploadPath.toAbsolutePath());
            }
        } catch (IOException e) {
            log.error("Failed to create upload directory: {}", uploadDir, e);
        }
    }

    @Override
    public String upload(InputStream data, String fileName, String contentType, long size) {
        try {
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            Path filePath = uploadPath.resolve(fileName);
            Files.copy(data, filePath, StandardCopyOption.REPLACE_EXISTING);
            
            log.info("File uploaded to local storage: {}", filePath);
            return fileName;
        } catch (IOException e) {
            log.error("Failed to upload file to local storage: {}", fileName, e);
            throw new RuntimeException("Failed to upload file", e);
        }
    }

    @Override
    public byte[] download(String fileName) {
        try {
            Path filePath = Paths.get(uploadDir, fileName);
            if (!Files.exists(filePath)) {
                log.error("File not found in local storage: {}", fileName);
                throw new RuntimeException("File not found: " + fileName);
            }
            return Files.readAllBytes(filePath);
        } catch (IOException e) {
            log.error("Failed to download file from local storage: {}", fileName, e);
            throw new RuntimeException("Failed to download file", e);
        }
    }

    @Override
    public void delete(String fileName) {
        try {
            Path filePath = Paths.get(uploadDir, fileName);
            if (Files.exists(filePath)) {
                Files.delete(filePath);
                log.info("File deleted from local storage: {}", fileName);
            } else {
                log.warn("File not found for deletion: {}", fileName);
            }
        } catch (IOException e) {
            log.error("Failed to delete file from local storage: {}", fileName, e);
        }
    }

    @Override
    public String getFileUrl(String fileName) {
        // For local storage, return the API endpoint
        return baseUrl + "/api/files/" + fileName;
    }
}
