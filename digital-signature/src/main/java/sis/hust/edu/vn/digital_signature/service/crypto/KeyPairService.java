package sis.hust.edu.vn.digital_signature.service.crypto;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sis.hust.edu.vn.digital_signature.entity.model.UserKeyPair;
import sis.hust.edu.vn.digital_signature.repository.crypto.UserKeyPairRepository;

import java.security.KeyPair;

/**
 * Service for managing user key pairs.
 * Handles key pair generation and storage.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class KeyPairService {

    private final UserKeyPairRepository userKeyPairRepository;
    private final CryptoService cryptoService;

    /**
     * Generate and save a new RSA key pair for a user.
     * @param userId The user ID to generate key pair for
     * @return The created UserKeyPair entity
     */
    @Transactional
    public UserKeyPair generateAndSaveKeyPair(String userId) {
        // Check if user already has a key pair
        if (userKeyPairRepository.existsByUserId(userId)) {
            log.warn("User {} already has a key pair, skipping generation", userId);
            return userKeyPairRepository.findByUserId(userId).orElse(null);
        }

        // Generate new RSA key pair
        KeyPair keyPair = cryptoService.generateKeyPair();

        // Encode keys for storage
        String publicKeyBase64 = cryptoService.publicKeyToBase64(keyPair.getPublic());
        String privateKeyEncrypted = cryptoService.encryptPrivateKey(keyPair.getPrivate());

        // Save to database
        UserKeyPair userKeyPair = UserKeyPair.builder()
                .userId(userId)
                .publicKey(publicKeyBase64)
                .privateKeyEncrypted(privateKeyEncrypted)
                .algorithm(cryptoService.getKeyAlgorithm())
                .build();

        UserKeyPair saved = userKeyPairRepository.save(userKeyPair);
        log.info("Generated and saved RSA key pair for user: {}", userId);

        return saved;
    }

    /**
     * Get user's key pair, generating one if it doesn't exist.
     * @param userId The user ID
     * @return The user's key pair
     */
    @Transactional
    public UserKeyPair getOrCreateKeyPair(String userId) {
        return userKeyPairRepository.findByUserId(userId)
                .orElseGet(() -> generateAndSaveKeyPair(userId));
    }

    /**
     * Check if a user has a key pair.
     * @param userId The user ID
     * @return true if user has a key pair
     */
    public boolean hasKeyPair(String userId) {
        return userKeyPairRepository.existsByUserId(userId);
    }

    /**
     * Get user's key pair.
     * @param userId The user ID
     * @return The user's key pair or null if not found
     */
    public UserKeyPair getKeyPair(String userId) {
        return userKeyPairRepository.findByUserId(userId).orElse(null);
    }
}
