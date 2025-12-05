package sis.hust.edu.vn.digital_signature.dto.common.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.domain.Page;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PageResponse<T> {

    private Integer status;

    private String message;

    private List<T> data;

    private Integer page;

    private Integer size;

    private Long totalElements;

    private Integer totalPages;

    public static <T> PageResponse<T> success(Page<T> page) {
        return PageResponse.<T>builder()
                .status(200)
                .message("Success")
                .data(page.getContent())
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .build();
    }

    public static <T> PageResponse<T> success(String message, Page<T> page) {
        return PageResponse.<T>builder()
                .status(200)
                .message(message)
                .data(page.getContent())
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .build();
    }

    public static <T> PageResponse<T> error(Integer status, String message) {
        return PageResponse.<T>builder()
                .status(status)
                .message(message)
                .data(null)
                .page(null)
                .size(null)
                .totalElements(null)
                .totalPages(null)
                .build();
    }

    public static <T> PageResponse<T> error(String message) {
        return PageResponse.<T>builder()
                .status(500)
                .message(message)
                .data(null)
                .page(null)
                .size(null)
                .totalElements(null)
                .totalPages(null)
                .build();
    }
}

