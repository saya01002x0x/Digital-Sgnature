package sis.hust.edu.vn.digital_signature.service.storage;

import lombok.extern.slf4j.Slf4j;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;
import software.amazon.awssdk.services.s3.presigner.model.PresignedGetObjectRequest;

import java.io.InputStream;
import java.net.URI;
import java.time.Duration;

/**
 * Cloudflare R2 storage implementation using AWS S3 SDK.
 * Used when STORAGE_TYPE=r2.
 */
@Slf4j
public class R2StorageService implements StorageService {

    private final S3Client s3Client;
    private final S3Presigner s3Presigner;
    private final String bucketName;
    private final int presignedUrlExpiryMinutes;
    private final String baseUrl; // Backend base URL for proxy endpoint

    public R2StorageService(
            String endpoint,
            String accessKey,
            String secretKey,
            String bucketName,
            String region,
            int presignedUrlExpiryMinutes,
            String baseUrl) {
        
        this.bucketName = bucketName;
        this.presignedUrlExpiryMinutes = presignedUrlExpiryMinutes;
        this.baseUrl = baseUrl;

        // Create AWS credentials
        AwsBasicCredentials credentials = AwsBasicCredentials.create(accessKey, secretKey);
        StaticCredentialsProvider credentialsProvider = StaticCredentialsProvider.create(credentials);

        // R2 uses "auto" region, but SDK requires a valid region
        Region awsRegion = Region.of(region.equals("auto") ? "us-east-1" : region);

        // Create S3 client for R2
        this.s3Client = S3Client.builder()
                .endpointOverride(URI.create(endpoint))
                .credentialsProvider(credentialsProvider)
                .region(awsRegion)
                .forcePathStyle(true) // Required for R2
                .build();

        // Create S3 Presigner for generating pre-signed URLs
        this.s3Presigner = S3Presigner.builder()
                .endpointOverride(URI.create(endpoint))
                .credentialsProvider(credentialsProvider)
                .region(awsRegion)
                .build();

        log.info("R2StorageService initialized with endpoint: {}, bucket: {}, baseUrl: {}", endpoint, bucketName, baseUrl);
    }

    @Override
    public String upload(InputStream data, String fileName, String contentType, long size) {
        try {
            PutObjectRequest request = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(fileName)
                    .contentType(contentType)
                    .contentLength(size)
                    .build();

            s3Client.putObject(request, RequestBody.fromInputStream(data, size));
            
            log.info("File uploaded to R2: {}/{}", bucketName, fileName);
            return fileName;
        } catch (Exception e) {
            log.error("Failed to upload file to R2: {}", fileName, e);
            throw new RuntimeException("Failed to upload file to R2", e);
        }
    }

    @Override
    public byte[] download(String fileName) {
        try {
            GetObjectRequest request = GetObjectRequest.builder()
                    .bucket(bucketName)
                    .key(fileName)
                    .build();

            return s3Client.getObjectAsBytes(request).asByteArray();
        } catch (NoSuchKeyException e) {
            log.error("File not found in R2: {}", fileName);
            throw new RuntimeException("File not found: " + fileName, e);
        } catch (Exception e) {
            log.error("Failed to download file from R2: {}", fileName, e);
            throw new RuntimeException("Failed to download file from R2", e);
        }
    }

    @Override
    public void delete(String fileName) {
        try {
            DeleteObjectRequest request = DeleteObjectRequest.builder()
                    .bucket(bucketName)
                    .key(fileName)
                    .build();

            s3Client.deleteObject(request);
            log.info("File deleted from R2: {}/{}", bucketName, fileName);
        } catch (Exception e) {
            log.error("Failed to delete file from R2: {}", fileName, e);
        }
    }

    @Override
    public String getFileUrl(String fileName) {
        // Return backend proxy URL instead of presigned URL
        // This solves two problems:
        // 1. CORS issues - backend has CORS headers configured
        // 2. URL expiration - backend always downloads fresh from R2
        String proxyUrl = baseUrl + "/api/files/" + fileName;
        log.debug("Generated proxy URL for {}: {}", fileName, proxyUrl);
        return proxyUrl;
    }
    
    /**
     * Generate a presigned URL for direct R2 access (if needed for other purposes).
     * Not used for frontend file display anymore.
     */
    @Deprecated
    public String getPresignedUrl(String fileName) {
        try {
            GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                    .bucket(bucketName)
                    .key(fileName)
                    .build();

            GetObjectPresignRequest presignRequest = GetObjectPresignRequest.builder()
                    .signatureDuration(Duration.ofMinutes(presignedUrlExpiryMinutes))
                    .getObjectRequest(getObjectRequest)
                    .build();

            PresignedGetObjectRequest presignedRequest = s3Presigner.presignGetObject(presignRequest);
            String url = presignedRequest.url().toString();
            
            log.debug("Generated pre-signed URL for {}, expires in {} minutes", fileName, presignedUrlExpiryMinutes);
            return url;
        } catch (Exception e) {
            log.error("Failed to generate pre-signed URL for: {}", fileName, e);
            throw new RuntimeException("Failed to generate pre-signed URL", e);
        }
    }
}
