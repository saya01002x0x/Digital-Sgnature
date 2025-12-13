package sis.hust.edu.vn.digital_signature.dto.document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import sis.hust.edu.vn.digital_signature.entity.model.Document;
import sis.hust.edu.vn.digital_signature.entity.model.Field;
import sis.hust.edu.vn.digital_signature.dto.signer.SignerResponse;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GetDocumentResponse {
    private Document document;
    private List<Field> fields;
    private List<SignerResponse> signers;
}

