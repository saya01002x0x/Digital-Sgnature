package sis.hust.edu.vn.digital_signature.service.file;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import sis.hust.edu.vn.digital_signature.entity.model.File;
import sis.hust.edu.vn.digital_signature.entity.enums.FileType;
import sis.hust.edu.vn.digital_signature.repository.file.FileRepository;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class FileService {

    private final FileRepository fileRepository;

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    @Value("${app.base-url:http://localhost:5555}")
    private String baseUrl;

    public File saveFile(MultipartFile multipartFile, FileType fileType, String uploadedBy) throws IOException {
        if (multipartFile == null || multipartFile.isEmpty()) {
            return null;
        }

        String originalFileName = multipartFile.getOriginalFilename();
        String fileExtension = getFileExtension(originalFileName);
        String fileName = UUID.randomUUID().toString() + fileExtension;
        
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        Path filePath = uploadPath.resolve(fileName);
        Files.copy(multipartFile.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        String fileUrl = baseUrl + "/api/files/" + fileName;

        File file = File.builder()
                .fileName(fileName)
                .originalName(originalFileName)
                .filePath(filePath.toString())
                .fileUrl(fileUrl)
                .fileSize(multipartFile.getSize())
                .mimeType(multipartFile.getContentType())
                .fileType(fileType)
                .uploadedAt(LocalDateTime.now())
                .uploadedBy(uploadedBy)
                .build();

        return fileRepository.save(file);
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
                Path filePath = Paths.get(file.getFilePath());
                Files.deleteIfExists(filePath);
                fileRepository.delete(file);
                log.info("File deleted: {}", fileId);
            } catch (IOException e) {
                log.error("Error deleting file: {}", fileId, e);
            }
        });
    }
}

