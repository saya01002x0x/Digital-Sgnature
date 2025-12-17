package sis.hust.edu.vn.digital_signature.controller.file;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sis.hust.edu.vn.digital_signature.controller.BaseController;
import sis.hust.edu.vn.digital_signature.dto.common.response.Response;
import sis.hust.edu.vn.digital_signature.service.storage.StorageService;

import java.util.Map;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
public class FileController extends BaseController {

    private final StorageService storageService;

    @Value("${storage.type:local}")
    private String storageType;

    /**
     * Get file content directly.
     * Works for both local and R2 storage.
     * CORS is handled globally by SecurityConfig - don't add headers here to avoid duplicates.
     */
    @GetMapping("/{fileName}")
    public ResponseEntity<Resource> getFile(@PathVariable String fileName) {
        try {
            byte[] data = storageService.download(fileName);
            ByteArrayResource resource = new ByteArrayResource(data);

            // Determine content type from file extension
            String contentType = determineContentType(fileName);

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .contentLength(data.length)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + fileName + "\"")
                    .header(HttpHeaders.ACCEPT_RANGES, "bytes")
                    .header(HttpHeaders.CACHE_CONTROL, "public, max-age=3600")
                    .body(resource);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Get URL for accessing the file.
     * For R2: returns a pre-signed URL (valid for 60 minutes).
     * For local: returns the direct API endpoint.
     */
    @GetMapping("/{fileName}/url")
    public ResponseEntity<Response<Map<String, Object>>> getFileUrl(@PathVariable String fileName) {
        try {
            String url = storageService.getFileUrl(fileName);
            Map<String, Object> data = Map.of(
                    "url", url,
                    "storageType", storageType,
                    "expiresIn", storageType.equals("r2") ? "60 minutes" : "never"
            );
            return success("File URL generated", data);
        } catch (Exception e) {
            return badRequest("Failed to get file URL: " + e.getMessage());
        }
    }

    private String determineContentType(String fileName) {
        if (fileName == null) return "application/octet-stream";
        
        String lower = fileName.toLowerCase();
        if (lower.endsWith(".pdf")) return "application/pdf";
        if (lower.endsWith(".png")) return "image/png";
        if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
        if (lower.endsWith(".gif")) return "image/gif";
        if (lower.endsWith(".doc")) return "application/msword";
        if (lower.endsWith(".docx")) return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        
        return "application/octet-stream";
    }
}
