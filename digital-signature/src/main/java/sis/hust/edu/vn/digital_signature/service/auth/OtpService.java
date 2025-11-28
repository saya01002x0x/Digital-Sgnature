package sis.hust.edu.vn.digital_signature.service.auth;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
@Slf4j
public class OtpService {

    private static final int OTP_LENGTH = 6;
    private static final long OTP_EXPIRY_TIME = 5 * 60 * 1000;

    private final Map<String, OtpData> otpStore = new ConcurrentHashMap<>();
    private final Random random = new Random();

    public String generateOtp(String email) {
        String otp = String.format("%06d", random.nextInt(1000000));
        long expiryTime = System.currentTimeMillis() + OTP_EXPIRY_TIME;

        otpStore.put(email, new OtpData(otp, expiryTime));

        log.info("OTP generated for email: {}", email);

        return otp;
    }

    public boolean verifyOtp(String email, String otp) {
        OtpData otpData = otpStore.get(email);

        if (otpData == null) {
            log.warn("No OTP found for email: {}", email);
            return false;
        }

        if (System.currentTimeMillis() > otpData.getExpiryTime()) {
            log.warn("OTP expired for email: {}", email);
            otpStore.remove(email);
            return false;
        }

        boolean isValid = otpData.getOtp().equals(otp);

        if (isValid) {
            otpStore.remove(email);
            log.info("OTP verified successfully for email: {}", email);
        } else {
            log.warn("Invalid OTP for email: {}", email);
        }

        return isValid;
    }

    public void removeOtp(String email) {
        otpStore.remove(email);
    }

    private static class OtpData {
        private final String otp;
        private final long expiryTime;

        public OtpData(String otp, long expiryTime) {
            this.otp = otp;
            this.expiryTime = expiryTime;
        }

        public String getOtp() {
            return otp;
        }

        public long getExpiryTime() {
            return expiryTime;
        }
    }
}

