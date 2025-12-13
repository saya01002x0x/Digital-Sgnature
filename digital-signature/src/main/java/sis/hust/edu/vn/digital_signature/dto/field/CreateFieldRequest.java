package sis.hust.edu.vn.digital_signature.dto.field;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import sis.hust.edu.vn.digital_signature.entity.enums.FieldType;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateFieldRequest {
    private FieldType type;
    private Integer pageNumber;
    private Double positionX;
    private Double positionY;
    private Double width;
    private Double height;
    private String signerId;
    private Boolean isRequired;
    private String placeholder;
}

