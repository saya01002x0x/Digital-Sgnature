package sis.hust.edu.vn.digital_signature.dto.signer;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import sis.hust.edu.vn.digital_signature.entity.model.Document;
import sis.hust.edu.vn.digital_signature.entity.model.Field;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SigningSessionResponse {
    private Document document;
    private SignerResponse signer;
    private List<Field> fields; // Only fields assigned to this signer
    private List<SignerResponse> allSigners; // All signers for display
}

