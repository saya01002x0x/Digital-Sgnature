package sis.hust.edu.vn.digital_signature.controller.signing;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sis.hust.edu.vn.digital_signature.controller.BaseController;
import sis.hust.edu.vn.digital_signature.dto.common.response.Response;
import sis.hust.edu.vn.digital_signature.dto.signer.*;
import sis.hust.edu.vn.digital_signature.service.signer.SignerService;

@RestController
@RequestMapping("/api/signing")
@RequiredArgsConstructor
public class SigningController extends BaseController {

    private final SignerService signerService;

    @GetMapping("/{token}")
    public ResponseEntity<Response<SigningSessionResponse>> getSigningSession(@PathVariable String token) {
        SigningSessionResponse session = signerService.getSigningSession(token);
        return success(session);
    }

    @PostMapping("/{token}/complete")
    public ResponseEntity<Response<SigningCompleteResponse>> completeSigning(
            @PathVariable String token,
            @RequestBody SigningCompleteRequest request) {
        SigningCompleteResponse response = signerService.completeSigning(token, request);
        return success("Signing completed successfully", response);
    }

    @PostMapping("/{token}/decline")
    public ResponseEntity<Response<DeclineResponse>> declineSigning(
            @PathVariable String token,
            @RequestBody DeclineRequest request) {
        DeclineResponse response = signerService.declineSigning(token, request);
        return success("Signing declined", response);
    }
}

