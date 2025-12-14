package sis.hust.edu.vn.digital_signature.dto.document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ListDocumentsResponse {
    private List<DocumentListItem> documents;
    private Integer total;
    private Integer page;
    private Integer limit;
}

