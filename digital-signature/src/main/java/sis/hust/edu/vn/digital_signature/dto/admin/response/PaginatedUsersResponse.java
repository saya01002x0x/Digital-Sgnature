package sis.hust.edu.vn.digital_signature.dto.admin.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import sis.hust.edu.vn.digital_signature.dto.common.response.PageResponse;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaginatedUsersResponse {
    private List<AdminUserResponse> data;
    private PaginationMeta meta;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PaginationMeta {
        private Integer currentPage;
        private Integer totalPages;
        private Long totalItems;
        private Integer itemsPerPage;
        private Boolean hasNextPage;
        private Boolean hasPreviousPage;
    }

    public static PaginatedUsersResponse fromPageResponse(PageResponse<AdminUserResponse> pageResponse) {
        PaginationMeta meta = PaginationMeta.builder()
                .currentPage(pageResponse.getPage() + 1) // Spring uses 0-based, frontend uses 1-based
                .totalPages(pageResponse.getTotalPages())
                .totalItems(pageResponse.getTotalElements())
                .itemsPerPage(pageResponse.getSize())
                .hasNextPage(pageResponse.getPage() + 1 < pageResponse.getTotalPages())
                .hasPreviousPage(pageResponse.getPage() > 0)
                .build();

        return PaginatedUsersResponse.builder()
                .data(pageResponse.getData())
                .meta(meta)
                .build();
    }
}
