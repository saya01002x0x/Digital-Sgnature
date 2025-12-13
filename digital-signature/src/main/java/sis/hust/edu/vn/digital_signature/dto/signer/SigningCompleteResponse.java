package sis.hust.edu.vn.digital_signature.dto.signer;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import sis.hust.edu.vn.digital_signature.entity.model.Document;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SigningCompleteResponse {
    private SignerResponse signer;
    private Document document;
}

