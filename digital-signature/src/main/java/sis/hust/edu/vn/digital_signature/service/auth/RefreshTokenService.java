package sis.hust.edu.vn.digital_signature.service.auth;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sis.hust.edu.vn.digital_signature.constants.error.ErrorMessages;
import sis.hust.edu.vn.digital_signature.entity.model.RefreshToken;
import sis.hust.edu.vn.digital_signature.entity.model.User;
import sis.hust.edu.vn.digital_signature.exception.business.BusinessException;
import sis.hust.edu.vn.digital_signature.repository.auth.RefreshTokenRepository;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;

    @Transactional
    public RefreshToken createRefreshToken(User user) {
        refreshTokenRepository.deleteByUser(user);

        return refreshTokenRepository.save(
                RefreshToken.builder()
                        .token(UUID.randomUUID().toString())
                        .expiryDate(Instant.now().plusMillis(1000 * 60 * 60 * 24))
                        .user(user)
                        .build()
        );
    }

    public boolean isExpired(RefreshToken token) {
        return token.getExpiryDate().isBefore(Instant.now());
    }

    public RefreshToken findByToken(String token) {
        return refreshTokenRepository.findByToken(token)
                .orElseThrow(() -> new BusinessException(ErrorMessages.INVALID_REFRESH_TOKEN));
    }

    @Transactional
    public void deleteToken(RefreshToken token) {
        refreshTokenRepository.delete(token);
    }
}

