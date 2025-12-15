package sis.hust.edu.vn.digital_signature.service.crypto;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Cipher;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.security.*;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;

/**
 * Core cryptographic service for PKI digital signature operations.
 * Uses RSA-2048 for key generation and SHA256withRSA for signing.
 */
@Service
@Slf4j
public class CryptoService {

    private static final String KEY_ALGORITHM = "RSA";
    private static final String SIGNATURE_ALGORITHM = "SHA256withRSA";
    private static final String HASH_ALGORITHM = "SHA-256";
    private static final String AES_ALGORITHM = "AES/GCM/NoPadding";
    private static final int KEY_SIZE = 2048;
    private static final int GCM_IV_LENGTH = 12;
    private static final int GCM_TAG_LENGTH = 128;

    @Value("${crypto.aes-key:default32ByteKeyForDevelopment!!}")
    private String aesKeyBase64;

    /**
     * Generate a new RSA-2048 key pair.
     */
    public KeyPair generateKeyPair() {
        try {
            KeyPairGenerator keyGen = KeyPairGenerator.getInstance(KEY_ALGORITHM);
            keyGen.initialize(KEY_SIZE, new SecureRandom());
            KeyPair keyPair = keyGen.generateKeyPair();
            log.info("Generated new RSA-2048 key pair");
            return keyPair;
        } catch (NoSuchAlgorithmException e) {
            log.error("Failed to generate key pair", e);
            throw new RuntimeException("Failed to generate RSA key pair", e);
        }
    }

    /**
     * Convert public key to Base64 string for storage.
     */
    public String publicKeyToBase64(PublicKey publicKey) {
        return Base64.getEncoder().encodeToString(publicKey.getEncoded());
    }

    /**
     * Convert Base64 string back to PublicKey.
     */
    public PublicKey base64ToPublicKey(String base64) {
        try {
            byte[] keyBytes = Base64.getDecoder().decode(base64);
            X509EncodedKeySpec spec = new X509EncodedKeySpec(keyBytes);
            KeyFactory keyFactory = KeyFactory.getInstance(KEY_ALGORITHM);
            return keyFactory.generatePublic(spec);
        } catch (Exception e) {
            log.error("Failed to decode public key from Base64", e);
            throw new RuntimeException("Failed to decode public key", e);
        }
    }

    /**
     * Encrypt private key with AES-GCM for secure storage.
     */
    public String encryptPrivateKey(PrivateKey privateKey) {
        try {
            byte[] privateKeyBytes = privateKey.getEncoded();
            
            // Generate random IV
            byte[] iv = new byte[GCM_IV_LENGTH];
            new SecureRandom().nextBytes(iv);
            
            // Create cipher
            SecretKeySpec keySpec = getAesKeySpec();
            Cipher cipher = Cipher.getInstance(AES_ALGORITHM);
            GCMParameterSpec gcmSpec = new GCMParameterSpec(GCM_TAG_LENGTH, iv);
            cipher.init(Cipher.ENCRYPT_MODE, keySpec, gcmSpec);
            
            // Encrypt
            byte[] encryptedBytes = cipher.doFinal(privateKeyBytes);
            
            // Combine IV + encrypted data
            ByteBuffer byteBuffer = ByteBuffer.allocate(iv.length + encryptedBytes.length);
            byteBuffer.put(iv);
            byteBuffer.put(encryptedBytes);
            
            return Base64.getEncoder().encodeToString(byteBuffer.array());
        } catch (Exception e) {
            log.error("Failed to encrypt private key", e);
            throw new RuntimeException("Failed to encrypt private key", e);
        }
    }

    /**
     * Decrypt private key from storage.
     */
    public PrivateKey decryptPrivateKey(String encryptedBase64) {
        try {
            byte[] encryptedData = Base64.getDecoder().decode(encryptedBase64);
            
            // Extract IV and encrypted bytes
            ByteBuffer byteBuffer = ByteBuffer.wrap(encryptedData);
            byte[] iv = new byte[GCM_IV_LENGTH];
            byteBuffer.get(iv);
            byte[] encryptedBytes = new byte[byteBuffer.remaining()];
            byteBuffer.get(encryptedBytes);
            
            // Decrypt
            SecretKeySpec keySpec = getAesKeySpec();
            Cipher cipher = Cipher.getInstance(AES_ALGORITHM);
            GCMParameterSpec gcmSpec = new GCMParameterSpec(GCM_TAG_LENGTH, iv);
            cipher.init(Cipher.DECRYPT_MODE, keySpec, gcmSpec);
            
            byte[] privateKeyBytes = cipher.doFinal(encryptedBytes);
            
            // Convert to PrivateKey
            PKCS8EncodedKeySpec spec = new PKCS8EncodedKeySpec(privateKeyBytes);
            KeyFactory keyFactory = KeyFactory.getInstance(KEY_ALGORITHM);
            return keyFactory.generatePrivate(spec);
        } catch (Exception e) {
            log.error("Failed to decrypt private key", e);
            throw new RuntimeException("Failed to decrypt private key", e);
        }
    }

    /**
     * Calculate SHA-256 hash of document bytes.
     */
    public String hashDocument(byte[] documentBytes) {
        try {
            MessageDigest digest = MessageDigest.getInstance(HASH_ALGORITHM);
            byte[] hashBytes = digest.digest(documentBytes);
            return Base64.getEncoder().encodeToString(hashBytes);
        } catch (NoSuchAlgorithmException e) {
            log.error("Failed to hash document", e);
            throw new RuntimeException("Failed to hash document", e);
        }
    }

    /**
     * Sign data hash with private key using SHA256withRSA.
     * @param dataHash The Base64-encoded SHA-256 hash of the document
     * @param privateKey The signer's private key
     * @return Base64-encoded digital signature
     */
    public String signData(String dataHash, PrivateKey privateKey) {
        try {
            Signature signature = Signature.getInstance(SIGNATURE_ALGORITHM);
            signature.initSign(privateKey);
            signature.update(dataHash.getBytes(StandardCharsets.UTF_8));
            byte[] signatureBytes = signature.sign();
            String signatureBase64 = Base64.getEncoder().encodeToString(signatureBytes);
            log.debug("Created digital signature for hash: {}...", dataHash.substring(0, Math.min(20, dataHash.length())));
            return signatureBase64;
        } catch (Exception e) {
            log.error("Failed to sign data", e);
            throw new RuntimeException("Failed to sign data", e);
        }
    }

    /**
     * Verify digital signature using public key.
     * @param dataHash The Base64-encoded SHA-256 hash of the document
     * @param signatureBase64 The Base64-encoded digital signature
     * @param publicKey The signer's public key
     * @return true if signature is valid, false otherwise
     */
    public boolean verifySignature(String dataHash, String signatureBase64, PublicKey publicKey) {
        try {
            Signature signature = Signature.getInstance(SIGNATURE_ALGORITHM);
            signature.initVerify(publicKey);
            signature.update(dataHash.getBytes(StandardCharsets.UTF_8));
            byte[] signatureBytes = Base64.getDecoder().decode(signatureBase64);
            boolean isValid = signature.verify(signatureBytes);
            log.debug("Signature verification result: {}", isValid);
            return isValid;
        } catch (Exception e) {
            log.error("Failed to verify signature", e);
            return false;
        }
    }

    /**
     * Get the algorithm name for display/storage.
     */
    public String getSignatureAlgorithm() {
        return SIGNATURE_ALGORITHM;
    }

    /**
     * Get the key algorithm name for display/storage.
     */
    public String getKeyAlgorithm() {
        return KEY_ALGORITHM + "-" + KEY_SIZE;
    }

    private SecretKeySpec getAesKeySpec() {
        // Ensure key is exactly 32 bytes for AES-256
        byte[] keyBytes = aesKeyBase64.getBytes(StandardCharsets.UTF_8);
        byte[] key32 = new byte[32];
        System.arraycopy(keyBytes, 0, key32, 0, Math.min(keyBytes.length, 32));
        return new SecretKeySpec(key32, "AES");
    }
}
