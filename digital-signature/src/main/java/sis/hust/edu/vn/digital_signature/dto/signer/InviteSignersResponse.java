package sis.hust.edu.vn.digital_signature.dto.signer;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import sis.hust.edu.vn.digital_signature.entity.model.Document;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InviteSignersResponse {
    private Document document;
    private List<SignerResponse> signers;
}

