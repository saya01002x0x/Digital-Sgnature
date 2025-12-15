package sis.hust.edu.vn.digital_signature.service.pdf;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject;
import org.springframework.stereotype.Service;
import sis.hust.edu.vn.digital_signature.service.qrcode.QrCodeService;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

/**
 * Service for adding QR codes to PDF documents.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class PdfQrService {

    private final QrCodeService qrCodeService;

    private static final float QR_SIZE = 80f;
    private static final float MARGIN = 30f;
    private static final float TEXT_FONT_SIZE = 8f;

    /**
     * Add a verification QR code to the last page of a PDF.
     * @param pdfBytes Original PDF content
     * @param documentId Document ID for verification URL
     * @return Modified PDF with QR code
     */
    public byte[] addVerificationQrCode(byte[] pdfBytes, String documentId) {
        try (PDDocument document = Loader.loadPDF(pdfBytes)) {
            // Generate QR code
            byte[] qrCodeImage = qrCodeService.generateVerificationQrCode(documentId);
            
            // Get last page
            int lastPageIndex = document.getNumberOfPages() - 1;
            PDPage lastPage = document.getPage(lastPageIndex);
            PDRectangle pageSize = lastPage.getMediaBox();
            
            // Calculate position (bottom right corner)
            float xPosition = pageSize.getWidth() - QR_SIZE - MARGIN;
            float yPosition = MARGIN;
            
            // Create image from QR code bytes
            PDImageXObject qrImage = PDImageXObject.createFromByteArray(document, qrCodeImage, "qr-code");
            
            // Add QR code to page
            try (PDPageContentStream contentStream = new PDPageContentStream(
                    document, lastPage, PDPageContentStream.AppendMode.APPEND, true, true)) {
                
                // Draw semi-transparent white background
                contentStream.setNonStrokingColor(1f, 1f, 1f); // White
                contentStream.addRect(xPosition - 5, yPosition - 5, QR_SIZE + 10, QR_SIZE + 25);
                contentStream.fill();
                
                // Draw border
                contentStream.setStrokingColor(0.7f, 0.7f, 0.7f); // Light gray
                contentStream.setLineWidth(0.5f);
                contentStream.addRect(xPosition - 5, yPosition - 5, QR_SIZE + 10, QR_SIZE + 25);
                contentStream.stroke();
                
                // Draw QR code image
                contentStream.drawImage(qrImage, xPosition, yPosition + 15, QR_SIZE, QR_SIZE);
                
                // Add text below QR code
                contentStream.beginText();
                contentStream.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA), TEXT_FONT_SIZE);
                contentStream.setNonStrokingColor(0.3f, 0.3f, 0.3f); // Dark gray
                contentStream.newLineAtOffset(xPosition, yPosition + 5);
                contentStream.showText("Scan to verify");
                contentStream.endText();
            }
            
            // Save modified PDF
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            document.save(outputStream);
            
            log.info("Added QR code to document: {}", documentId);
            return outputStream.toByteArray();
            
        } catch (IOException e) {
            log.error("Failed to add QR code to PDF", e);
            throw new RuntimeException("Failed to add QR code to PDF", e);
        }
    }
}
