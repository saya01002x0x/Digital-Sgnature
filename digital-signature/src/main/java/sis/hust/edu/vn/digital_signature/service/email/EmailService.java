package sis.hust.edu.vn.digital_signature.service.email;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class EmailService {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String fromEmail;

    @Value("${app.name:Digital Signature}")
    private String appName;

    @Value("${app.email.enabled:true}")
    private boolean emailEnabled;

    @Value("${app.email.test-mode:false}")
    private boolean testMode;

    public void sendOtpEmail(String toEmail, String otp) {
        if (testMode || !emailEnabled || fromEmail == null || fromEmail.isEmpty()) {
            log.info("========================================");
            log.info("TEST MODE - OTP Email (NOT SENT)");
            log.info("To: {}", toEmail);
            log.info("OTP: {}", otp);
            log.info("========================================");
            return;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Mã OTP đăng ký - " + appName);
            message.setText(buildOtpEmailContent(otp));

            mailSender.send(message);
            log.info("OTP email sent successfully to: {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send OTP email to: {}", toEmail, e);
            log.warn("Falling back to test mode - OTP: {}", otp);
        }
    }

    private String buildOtpEmailContent(String otp) {
        return String.format(
            "Xin chào,\n\n" +
            "Bạn đã yêu cầu mã OTP để đăng ký tài khoản trên %s.\n\n" +
            "Mã OTP của bạn là: %s\n\n" +
            "Mã OTP này có hiệu lực trong 5 phút.\n\n" +
            "Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email này.\n\n" +
            "Trân trọng,\n" +
            "Đội ngũ %s",
            appName, otp, appName
        );
    }
}

