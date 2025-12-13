package sis.hust.edu.vn.digital_signature.dto.signer;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InviteSignersRequest {
    private List<SignerRequest> signers;
    private String signingOrder; // SEQUENTIAL or PARALLEL
    private java.util.Map<String, String> fieldAssignments; // fieldId -> signerEmail
}

