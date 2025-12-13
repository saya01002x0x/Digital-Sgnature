package sis.hust.edu.vn.digital_signature.controller.field;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sis.hust.edu.vn.digital_signature.controller.BaseController;
import sis.hust.edu.vn.digital_signature.dto.common.response.Response;
import sis.hust.edu.vn.digital_signature.dto.field.CreateFieldRequest;
import sis.hust.edu.vn.digital_signature.dto.field.UpdateFieldRequest;
import sis.hust.edu.vn.digital_signature.entity.model.Field;
import sis.hust.edu.vn.digital_signature.service.field.FieldService;

@RestController
@RequestMapping("/api/documents")
@RequiredArgsConstructor
public class FieldController extends BaseController {

    private final FieldService fieldService;

    @PostMapping("/{documentId}/fields")
    public ResponseEntity<Response<Field>> createField(
            @PathVariable String documentId,
            @RequestBody CreateFieldRequest request) {
        Field field = fieldService.createField(documentId, request);
        return created("Field created successfully", field);
    }

    @PatchMapping("/fields/{id}")
    public ResponseEntity<Response<Field>> updateField(
            @PathVariable String id,
            @RequestBody UpdateFieldRequest request) {
        Field field = fieldService.updateField(id, request);
        return success("Field updated successfully", field);
    }

    @DeleteMapping("/fields/{id}")
    public ResponseEntity<Void> deleteField(@PathVariable String id) {
        fieldService.deleteField(id);
        return ResponseEntity.noContent().build();
    }
}

