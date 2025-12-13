package sis.hust.edu.vn.digital_signature.dto.signature;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import sis.hust.edu.vn.digital_signature.entity.model.Signature;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ListSignaturesResponse {
    private List<Signature> signatures;
}

