package sis.hust.edu.vn.digital_signature.config.storage;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import sis.hust.edu.vn.digital_signature.service.storage.LocalStorageService;
import sis.hust.edu.vn.digital_signature.service.storage.R2StorageService;
import sis.hust.edu.vn.digital_signature.service.storage.StorageService;

/**
 * Configuration class for storage service.
 * Creates appropriate StorageService bean based on STORAGE_TYPE environment variable.
 */
@Configuration
@Slf4j
public class StorageConfig {

    @Value("${storage.type:local}")
    private String storageType;

    // Local storage config
    @Value("${storage.local.upload-dir:uploads}")
    private String localUploadDir;

    @Value("${storage.local.base-url:http://localhost:5555}")
    private String localBaseUrl;

    // R2 storage config
    @Value("${storage.r2.endpoint:}")
    private String r2Endpoint;

    @Value("${storage.r2.access-key:}")
    private String r2AccessKey;

    @Value("${storage.r2.secret-key:}")
    private String r2SecretKey;

    @Value("${storage.r2.bucket:}")
    private String r2Bucket;

    @Value("${storage.r2.region:auto}")
    private String r2Region;

    @Value("${storage.r2.presigned-url-expiry-minutes:60}")
    private int r2PresignedUrlExpiryMinutes;

    @Bean
    public StorageService storageService() {
        if ("r2".equalsIgnoreCase(storageType)) {
            // Validate R2 configuration
            if (r2Endpoint == null || r2Endpoint.isEmpty() ||
                r2AccessKey == null || r2AccessKey.isEmpty() ||
                r2SecretKey == null || r2SecretKey.isEmpty() ||
                r2Bucket == null || r2Bucket.isEmpty()) {
                
                log.error("R2 storage configuration is incomplete! Falling back to local storage.");
                log.error("Required: R2_ENDPOINT, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME");
                return createLocalStorageService();
            }

            log.info("Initializing R2 Storage Service");
            log.info("R2 Endpoint: {}", r2Endpoint);
            log.info("R2 Bucket: {}", r2Bucket);
            log.info("Pre-signed URL expiry: {} minutes", r2PresignedUrlExpiryMinutes);
            
            return new R2StorageService(
                    r2Endpoint,
                    r2AccessKey,
                    r2SecretKey,
                    r2Bucket,
                    r2Region,
                    r2PresignedUrlExpiryMinutes
            );
        } else {
            return createLocalStorageService();
        }
    }

    private StorageService createLocalStorageService() {
        log.info("Initializing Local Storage Service");
        log.info("Upload directory: {}", localUploadDir);
        log.info("Base URL: {}", localBaseUrl);
        return new LocalStorageService(localUploadDir, localBaseUrl);
    }
}
