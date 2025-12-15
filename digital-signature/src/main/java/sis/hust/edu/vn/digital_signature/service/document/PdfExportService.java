package sis.hust.edu.vn.digital_signature.service.document;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject;
import org.springframework.stereotype.Service;
import sis.hust.edu.vn.digital_signature.entity.model.Document;
import sis.hust.edu.vn.digital_signature.entity.model.Field;
import sis.hust.edu.vn.digital_signature.repository.document.DocumentRepository;
import sis.hust.edu.vn.digital_signature.repository.field.FieldRepository;
import sis.hust.edu.vn.digital_signature.service.pdf.PdfQrService;

import jakarta.persistence.EntityNotFoundException;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.net.URL;
import java.util.Base64;
import java.util.List;

/**
 * Service for generating PDF with embedded signatures
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class PdfExportService {

    private final DocumentRepository documentRepository;
    private final FieldRepository fieldRepository;
    private final PdfQrService pdfQrService;

    /**
     * Generate PDF with signatures embedded at their positions
     */
    public byte[] generatePdfWithSignatures(String documentId) {
        // Get document
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new EntityNotFoundException("Document not found"));

        // Get all fields with values (signatures)
        List<Field> fields = fieldRepository.findByDocumentId(documentId);
        List<Field> signedFields = fields.stream()
                .filter(f -> f.getValue() != null && !f.getValue().isEmpty())
                .toList();

        try {
            // Load original PDF from URL
            byte[] originalPdf = loadPdfFromUrl(document.getFileUrl());
            
            try (PDDocument pdfDocument = Loader.loadPDF(originalPdf)) {
                
                // Embed each signature
                for (Field field : signedFields) {
                    embedSignature(pdfDocument, field);
                }

                // Save to byte array
                ByteArrayOutputStream baos = new ByteArrayOutputStream();
                pdfDocument.save(baos);
                return baos.toByteArray();
            }
        } catch (Exception e) {
            log.error("Error generating PDF with signatures: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to generate PDF with signatures", e);
        }
    }

    /**
     * Generate PDF with signatures AND verification QR code on last page
     */
    public byte[] generatePdfWithSignaturesAndQr(String documentId) {
        // First generate PDF with signatures
        byte[] pdfWithSignatures = generatePdfWithSignatures(documentId);
        
        // Then add QR code to the last page
        return pdfQrService.addVerificationQrCode(pdfWithSignatures, documentId);
    }

    private byte[] loadPdfFromUrl(String fileUrl) throws Exception {
        URL url = new URL(fileUrl);
        try (InputStream is = url.openStream()) {
            return is.readAllBytes();
        }
    }

    private void embedSignature(PDDocument pdfDocument, Field field) throws Exception {
        // Page number is 1-indexed
        int pageIndex = field.getPageNumber() - 1;
        if (pageIndex < 0 || pageIndex >= pdfDocument.getNumberOfPages()) {
            log.warn("Invalid page number {} for field {}", field.getPageNumber(), field.getId());
            return;
        }

        PDPage page = pdfDocument.getPage(pageIndex);
        float pageWidth = page.getMediaBox().getWidth();
        float pageHeight = page.getMediaBox().getHeight();

        // Convert percentage to PDF coordinates
        // Note: PDF origin is bottom-left, but our positions are from top-left
        float x = (float) (field.getPositionX() / 100.0 * pageWidth);
        float y = pageHeight - (float) (field.getPositionY() / 100.0 * pageHeight); // Flip Y
        float width = (float) (field.getWidth() / 100.0 * pageWidth);
        float height = (float) (field.getHeight() / 100.0 * pageHeight);
        
        // Adjust Y for height (since we draw from bottom-left of image)
        y = y - height;

        // Extract base64 image data from data URL
        String value = field.getValue();
        if (!value.startsWith("data:image")) {
            log.warn("Field {} value is not a valid data URL", field.getId());
            return;
        }

        // Parse data URL: "data:image/png;base64,xxxxx"
        String base64Data = value.substring(value.indexOf(",") + 1);
        byte[] imageBytes = Base64.getDecoder().decode(base64Data);

        // Create image object
        PDImageXObject image = PDImageXObject.createFromByteArray(pdfDocument, imageBytes, "signature");

        // Draw image on page
        try (PDPageContentStream contentStream = new PDPageContentStream(
                pdfDocument, page, PDPageContentStream.AppendMode.APPEND, true, true)) {
            contentStream.drawImage(image, x, y, width, height);
        }
    }
}
