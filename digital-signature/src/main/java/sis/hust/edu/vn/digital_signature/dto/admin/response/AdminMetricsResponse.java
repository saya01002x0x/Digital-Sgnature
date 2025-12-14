package sis.hust.edu.vn.digital_signature.dto.admin.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminMetricsResponse {
    private Integer totalUsers;
    private Integer activeUsers;
    private Integer inactiveUsers;
    private Integer totalDocuments;
    private Integer pendingDocuments;
    private Integer completedDocuments;
    private Integer totalSignatures;
    private Integer recentActivityCount;
}
