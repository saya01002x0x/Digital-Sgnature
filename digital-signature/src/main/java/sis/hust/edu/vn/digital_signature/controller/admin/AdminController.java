package sis.hust.edu.vn.digital_signature.controller.admin;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import sis.hust.edu.vn.digital_signature.controller.BaseController;
import sis.hust.edu.vn.digital_signature.dto.admin.request.UpdateUserRequest;
import sis.hust.edu.vn.digital_signature.dto.admin.request.UpdateUserStatusRequest;
import sis.hust.edu.vn.digital_signature.dto.admin.response.AdminMetricsResponse;
import sis.hust.edu.vn.digital_signature.dto.admin.response.AdminUserResponse;
import sis.hust.edu.vn.digital_signature.dto.admin.response.PaginatedUsersResponse;
import sis.hust.edu.vn.digital_signature.dto.common.response.PageResponse;
import sis.hust.edu.vn.digital_signature.dto.common.response.Response;
import sis.hust.edu.vn.digital_signature.service.admin.AdminService;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController extends BaseController {

    private final AdminService adminService;

    @GetMapping("/metrics")
    public ResponseEntity<Response<AdminMetricsResponse>> getMetrics() {
        AdminMetricsResponse metrics = adminService.getMetrics();
        return success(metrics);
    }

    @GetMapping("/users")
    public ResponseEntity<Response<PaginatedUsersResponse>> listUsers(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String role,
            @RequestParam(required = false) Boolean isActive) {
        
        Pageable pageable = PageRequest.of(page - 1, size);
        Page<AdminUserResponse> usersPage = adminService.listUsers(pageable, search, role, isActive);
        PageResponse<AdminUserResponse> pageResponse = PageResponse.success(usersPage);
        PaginatedUsersResponse response = PaginatedUsersResponse.fromPageResponse(pageResponse);
        return success(response);
    }

    @GetMapping("/users/{userId}")
    public ResponseEntity<Response<AdminUserResponse>> getUser(@PathVariable String userId) {
        AdminUserResponse user = adminService.getUser(userId);
        return success(user);
    }

    @PatchMapping("/users/{userId}/status")
    public ResponseEntity<Response<Void>> updateUserStatus(
            @PathVariable String userId,
            @Valid @RequestBody UpdateUserStatusRequest request) {
        adminService.updateUserStatus(userId, request.getIsActive());
        return success("User status updated successfully", null);
    }

    @PatchMapping("/users/{userId}")
    public ResponseEntity<Response<AdminUserResponse>> updateUser(
            @PathVariable String userId,
            @Valid @RequestBody UpdateUserRequest request) {
        AdminUserResponse updatedUser = adminService.updateUser(userId, request);
        return success("User updated successfully", updatedUser);
    }

    @GetMapping("/logs")
    public ResponseEntity<Response<PaginatedUsersResponse>> listAuditLogs(
            // Note: Using PaginatedUsersResponse as placeholder for now
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String action,
            @RequestParam(required = false) String targetType,
            @RequestParam(required = false) String performedBy,
            @RequestParam(required = false) Boolean success,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        
        // TODO: Implement audit logs functionality
        // For now, return empty page to avoid 500 error
        Page<AdminUserResponse> emptyPage = Page.empty(PageRequest.of(page - 1, size));
        PageResponse<AdminUserResponse> pageResponse = PageResponse.success(emptyPage);
        PaginatedUsersResponse response = PaginatedUsersResponse.fromPageResponse(pageResponse);
        return success(response);
    }
}
