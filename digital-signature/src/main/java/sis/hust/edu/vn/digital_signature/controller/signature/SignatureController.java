package sis.hust.edu.vn.digital_signature.controller.signature;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sis.hust.edu.vn.digital_signature.controller.BaseController;
import sis.hust.edu.vn.digital_signature.dto.common.response.Response;
import sis.hust.edu.vn.digital_signature.dto.signature.CreateSignatureRequest;
import sis.hust.edu.vn.digital_signature.dto.signature.ListSignaturesResponse;
import sis.hust.edu.vn.digital_signature.dto.signature.UpdateSignatureRequest;
import sis.hust.edu.vn.digital_signature.entity.model.Signature;
import sis.hust.edu.vn.digital_signature.entity.model.User;
import sis.hust.edu.vn.digital_signature.security.annotation.CurrentUser;
import sis.hust.edu.vn.digital_signature.service.signature.SignatureService;

import java.util.List;

@RestController
@RequestMapping("/api/signatures")
@RequiredArgsConstructor
@Slf4j
public class SignatureController extends BaseController {

    private final SignatureService signatureService;

    @GetMapping
    public ResponseEntity<Response<ListSignaturesResponse>> listSignatures(@CurrentUser User user) {
        List<Signature> signatures = signatureService.listSignatures(user.getId());
        ListSignaturesResponse response = ListSignaturesResponse.builder()
                .signatures(signatures)
                .build();
        return success(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Response<Signature>> getSignature(
            @PathVariable String id,
            @CurrentUser User user) {
        Signature signature = signatureService.getSignatureById(id, user.getId());
        return success(signature);
    }

    @PostMapping
    public ResponseEntity<Response<Signature>> createSignature(
            @RequestBody CreateSignatureRequest request,
            @CurrentUser User user) {
        log.info("Received request to create signature for user: {}", user.getId());
        Signature signature = signatureService.createSignature(request, user.getId());
        log.info("Signature created successfully with ID: {}", signature.getId());
        return created("Signature created successfully", signature);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Response<Signature>> updateSignature(
            @PathVariable String id,
            @RequestBody UpdateSignatureRequest request,
            @CurrentUser User user) {
        Signature signature = signatureService.updateSignature(id, request, user.getId());
        return success("Signature updated successfully", signature);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSignature(
            @PathVariable String id,
            @CurrentUser User user) {
        signatureService.deleteSignature(id, user.getId());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/set-default")
    public ResponseEntity<Response<Signature>> setDefaultSignature(
            @PathVariable String id,
            @CurrentUser User user) {
        Signature signature = signatureService.setDefaultSignature(id, user.getId());
        return success("Default signature set successfully", signature);
    }
}

