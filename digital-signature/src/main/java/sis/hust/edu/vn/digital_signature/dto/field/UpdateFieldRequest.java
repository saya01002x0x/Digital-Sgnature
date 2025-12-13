package sis.hust.edu.vn.digital_signature.dto.field;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateFieldRequest {
    private Double positionX;
    private Double positionY;
    private Double width;
    private Double height;
    private String signerId;
}

