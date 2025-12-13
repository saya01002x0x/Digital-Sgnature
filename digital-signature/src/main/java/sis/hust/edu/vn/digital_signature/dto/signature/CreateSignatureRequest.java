package sis.hust.edu.vn.digital_signature.dto.signature;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import sis.hust.edu.vn.digital_signature.entity.enums.SignatureType;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateSignatureRequest {
    private SignatureType type;
    private String imageData; // Base64 PNG or SVG data URL
    private String name;
}

