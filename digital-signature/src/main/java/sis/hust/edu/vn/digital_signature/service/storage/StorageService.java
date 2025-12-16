package sis.hust.edu.vn.digital_signature.service.storage;

import java.io.InputStream;

/**
 * Storage service interface for file operations.
 * Implementations: LocalStorageService, R2StorageService
 */
public interface StorageService {

    /**
     * Upload a file to storage.
     *
     * @param data        Input stream of file data
     * @param fileName    Unique file name
     * @param contentType MIME type of the file
     * @param size        File size in bytes
     * @return The storage key/path of the uploaded file
     */
    String upload(InputStream data, String fileName, String contentType, long size);

    /**
     * Download file content from storage.
     * Used internally for operations like digital signature verification.
     *
     * @param fileName File name/key to download
     * @return File content as byte array
     */
    byte[] download(String fileName);

    /**
     * Delete a file from storage.
     *
     * @param fileName File name/key to delete
     */
    void delete(String fileName);

    /**
     * Get a URL for accessing the file.
     * - For local storage: returns the API endpoint URL
     * - For R2 storage: returns a pre-signed URL with expiry
     *
     * @param fileName File name/key
     * @return URL for accessing the file
     */
    String getFileUrl(String fileName);
}
