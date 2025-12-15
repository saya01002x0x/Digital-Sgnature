package sis.hust.edu.vn.digital_signature.service.qrcode;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.google.zxing.qrcode.decoder.ErrorCorrectionLevel;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

/**
 * Service for generating QR codes for document verification.
 */
@Service
@Slf4j
public class QrCodeService {

    @Value("${APP_BASE_URL:http://localhost:5555}")
    private String baseUrl;

    @Value("${FRONTEND_URL:http://localhost:5556}")
    private String frontendUrl;

    private static final int DEFAULT_QR_SIZE = 150;

    /**
     * Generate a QR code image as PNG bytes.
     * @param content The content to encode in the QR code
     * @param size The size of the QR code in pixels
     * @return PNG image as byte array
     */
    public byte[] generateQrCode(String content, int size) {
        try {
            QRCodeWriter qrCodeWriter = new QRCodeWriter();
            
            Map<EncodeHintType, Object> hints = new HashMap<>();
            hints.put(EncodeHintType.ERROR_CORRECTION, ErrorCorrectionLevel.H);
            hints.put(EncodeHintType.MARGIN, 1);
            hints.put(EncodeHintType.CHARACTER_SET, "UTF-8");
            
            BitMatrix bitMatrix = qrCodeWriter.encode(content, BarcodeFormat.QR_CODE, size, size, hints);
            
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(bitMatrix, "PNG", outputStream);
            
            log.debug("Generated QR code for content: {}...", content.substring(0, Math.min(50, content.length())));
            return outputStream.toByteArray();
        } catch (WriterException | IOException e) {
            log.error("Failed to generate QR code", e);
            throw new RuntimeException("Failed to generate QR code", e);
        }
    }

    /**
     * Generate a QR code with default size.
     */
    public byte[] generateQrCode(String content) {
        return generateQrCode(content, DEFAULT_QR_SIZE);
    }

    /**
     * Generate a verification URL for a document.
     * @param documentId The document ID
     * @return The verification URL
     */
    public String getVerificationUrl(String documentId) {
        return frontendUrl + "/verify/" + documentId;
    }

    /**
     * Generate a QR code for document verification.
     * @param documentId The document ID
     * @return PNG image as byte array
     */
    public byte[] generateVerificationQrCode(String documentId) {
        String verificationUrl = getVerificationUrl(documentId);
        log.info("Generating verification QR code for document: {}", documentId);
        return generateQrCode(verificationUrl, DEFAULT_QR_SIZE);
    }
}
