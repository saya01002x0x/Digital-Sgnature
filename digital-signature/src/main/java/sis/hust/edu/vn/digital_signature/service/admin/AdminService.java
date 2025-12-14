package sis.hust.edu.vn.digital_signature.service.admin;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sis.hust.edu.vn.digital_signature.dto.admin.request.UpdateUserRequest;
import sis.hust.edu.vn.digital_signature.dto.admin.response.AdminMetricsResponse;
import sis.hust.edu.vn.digital_signature.dto.admin.response.AdminUserResponse;
import sis.hust.edu.vn.digital_signature.entity.enums.DocumentStatus;
import sis.hust.edu.vn.digital_signature.entity.model.User;
import sis.hust.edu.vn.digital_signature.exception.entity.EntityNotFoundException;
import sis.hust.edu.vn.digital_signature.mapper.admin.AdminUserMapper;
import sis.hust.edu.vn.digital_signature.repository.document.DocumentRepository;
import sis.hust.edu.vn.digital_signature.repository.signature.SignatureRepository;
import sis.hust.edu.vn.digital_signature.repository.user.UserRepository;


@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final DocumentRepository documentRepository;
    private final SignatureRepository signatureRepository;
    private final AdminUserMapper adminUserMapper;

    public AdminMetricsResponse getMetrics() {
        long totalUsers = userRepository.count();
        
        // Count active/inactive users - simplified version
        // In production, use count queries for better performance
        long activeUsers = userRepository.findAll().stream()
                .filter(User::getIsActive)
                .count();
        long inactiveUsers = totalUsers - activeUsers;
        
        long totalDocuments = documentRepository.count();
        
        // Count documents by status - simplified version
        long pendingDocuments = documentRepository.findAll().stream()
                .filter(doc -> doc.getStatus() == DocumentStatus.SIGNING)
                .count();
        long completedDocuments = documentRepository.findAll().stream()
                .filter(doc -> doc.getStatus() == DocumentStatus.DONE)
                .count();
        
        long totalSignatures = signatureRepository.count();

        return AdminMetricsResponse.builder()
                .totalUsers((int) totalUsers)
                .activeUsers((int) activeUsers)
                .inactiveUsers((int) inactiveUsers)
                .totalDocuments((int) totalDocuments)
                .pendingDocuments((int) pendingDocuments)
                .completedDocuments((int) completedDocuments)
                .totalSignatures((int) totalSignatures)
                .recentActivityCount(0) // TODO: Implement activity tracking
                .build();
    }

    public Page<AdminUserResponse> listUsers(Pageable pageable, String search, String role, Boolean isActive) {
        // TODO: Implement proper filtering using Specifications
        // For now, return all users with pagination
        Page<User> usersPage = userRepository.findAll(pageable);
        return usersPage.map(adminUserMapper::toDto);
    }

    public AdminUserResponse getUser(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + userId));
        return adminUserMapper.toDto(user);
    }

    @Transactional
    public void updateUserStatus(String userId, Boolean isActive) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + userId));
        user.setIsActive(isActive);
        userRepository.save(user);
    }

    @Transactional
    public AdminUserResponse updateUser(String userId, UpdateUserRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + userId));
        
        if (request.getFullName() != null) {
            user.setFullName(request.getFullName());
        }
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone());
        }
        if (request.getAddress() != null) {
            user.setAddress(request.getAddress());
        }
        
        User savedUser = userRepository.save(user);
        return adminUserMapper.toDto(savedUser);
    }
}
