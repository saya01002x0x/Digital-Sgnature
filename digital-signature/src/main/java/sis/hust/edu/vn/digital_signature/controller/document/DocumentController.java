package sis.hust.edu.vn.digital_signature.controller.document;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import sis.hust.edu.vn.digital_signature.controller.BaseController;
import sis.hust.edu.vn.digital_signature.dto.common.response.Response;
import sis.hust.edu.vn.digital_signature.dto.document.GetDocumentResponse;
import sis.hust.edu.vn.digital_signature.dto.document.ListDocumentsResponse;
import sis.hust.edu.vn.digital_signature.dto.signer.InviteSignersRequest;
import sis.hust.edu.vn.digital_signature.dto.signer.InviteSignersResponse;
import sis.hust.edu.vn.digital_signature.entity.enums.DocumentStatus;
import sis.hust.edu.vn.digital_signature.entity.model.Document;
import sis.hust.edu.vn.digital_signature.entity.model.User;
import sis.hust.edu.vn.digital_signature.security.annotation.CurrentUser;
import sis.hust.edu.vn.digital_signature.service.document.DocumentService;
import sis.hust.edu.vn.digital_signature.service.document.PdfExportService;
import sis.hust.edu.vn.digital_signature.service.signer.SignerService;
import sis.hust.edu.vn.digital_signature.util.pagination.PaginationUtils;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@RestController
@RequestMapping("/api/documents")
@RequiredArgsConstructor
public class DocumentController extends BaseController {

    private final DocumentService documentService;
    private final SignerService signerService;
    private final PdfExportService pdfExportService;

    @GetMapping
    public ResponseEntity<Response<ListDocumentsResponse>> listDocuments(
            @RequestParam(required = false) DocumentStatus status,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) String sortOrder,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer limit,
            @CurrentUser User user) {
        // Convert page from 1-based (frontend) to 0-based (Spring)
        int pageNumber = (page != null && page > 0) ? page - 1 : 0;
        Pageable pageable = PaginationUtils.createPageable(pageNumber, limit, sortBy, sortOrder);
        
        // Fetch documents owned by user OR where user is invited as signer
        var documents = documentService.listDocumentsWithOwnerInfo(
            user.getId(), 
            user.getEmail(), 
            status, 
            search, 
            pageable
        );
        
        // Convert to frontend format
        ListDocumentsResponse response = ListDocumentsResponse.builder()
                .documents(documents.getContent())
                .total((int) documents.getTotalElements())
                .page(pageNumber + 1) // Convert back to 1-based for frontend
                .limit(documents.getSize())
                .build();
        
        return success(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Response<GetDocumentResponse>> getDocument(
            @PathVariable String id,
            @CurrentUser User user) {
        if ("new".equalsIgnoreCase(id)) {
            // Frontend might mistakenly call this while navigating to create page.
            // Return 404 to indicate not found (or could be 400, but 404 is cleaner for "ID not found").
            throw new sis.hust.edu.vn.digital_signature.exception.entity.EntityNotFoundException("Document not found");
        }
        // Pass both user ID and email to allow owner OR signer access
        GetDocumentResponse response = documentService.getDocumentWithFieldsAndSigners(id, user.getId(), user.getEmail());
        return success(response);
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Response<Document>> uploadDocument(
            @RequestPart("file") MultipartFile file,
            @RequestPart(value = "title", required = false) String title,
            @CurrentUser User user) throws IOException {
        Document document = documentService.uploadDocument(file, title, user.getId());
        return created("Document uploaded successfully", document);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Response<Document>> updateDocument(
            @PathVariable String id,
            @RequestBody(required = false) java.util.Map<String, String> request,
            @CurrentUser User user) {
        String title = request != null ? request.get("title") : null;
        Document document = documentService.updateDocument(id, title, user.getId());
        return success("Document updated successfully", document);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDocument(
            @PathVariable String id,
            @CurrentUser User user) {
        documentService.deleteDocument(id, user.getId());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{documentId}/invite")
    public ResponseEntity<Response<InviteSignersResponse>> inviteSigners(
            @PathVariable String documentId,
            @RequestBody InviteSignersRequest request,
            @CurrentUser User user) {
        InviteSignersResponse response = signerService.inviteSigners(documentId, request, user.getId());
        return success("Signers invited successfully", response);
    }

    @PostMapping("/{documentId}/self-sign")
    public ResponseEntity<Response<sis.hust.edu.vn.digital_signature.dto.signer.SelfSignResponse>> selfSign(
            @PathVariable String documentId,
            @CurrentUser User user) {
        sis.hust.edu.vn.digital_signature.dto.signer.SelfSignResponse response = 
            signerService.selfSign(documentId, user.getId(), user.getEmail(), user.getFullName());
        return success("Self-sign initiated successfully", response);
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<byte[]> downloadDocument(
            @PathVariable String id,
            @CurrentUser User user) {
        // Verify user has access (owner or signer)
        GetDocumentResponse docResponse = documentService.getDocumentWithFieldsAndSigners(id, user.getId(), user.getEmail());
        Document document = docResponse.getDocument();
        
        // Generate PDF with embedded signatures
        byte[] pdfBytes = pdfExportService.generatePdfWithSignatures(id);
        
        // Set filename with proper encoding for Vietnamese characters
        String filename = document.getTitle() + "_signed.pdf";
        String encodedFilename = URLEncoder.encode(filename, StandardCharsets.UTF_8).replace("+", "%20");
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        // Use RFC 5987 format for proper Unicode filename support
        headers.add("Content-Disposition", "attachment; filename=\"" + filename + "\"; filename*=UTF-8''" + encodedFilename);
        
        return ResponseEntity.ok()
                .headers(headers)
                .body(pdfBytes);
    }
}

