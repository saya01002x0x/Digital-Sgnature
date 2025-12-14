package sis.hust.edu.vn.digital_signature.mapper.admin;

import org.springframework.stereotype.Component;
import sis.hust.edu.vn.digital_signature.dto.admin.response.AdminUserResponse;
import sis.hust.edu.vn.digital_signature.entity.model.User;
import sis.hust.edu.vn.digital_signature.mapper.Mapper;

@Component
public class AdminUserMapper implements Mapper<User, AdminUserResponse> {

    @Override
    public AdminUserResponse toDto(User entity) {
        if (entity == null) {
            return null;
        }
        return AdminUserResponse.builder()
                .id(entity.getId())
                .username(entity.getUsername())
                .email(entity.getEmail())
                .fullName(entity.getFullName())
                .phone(entity.getPhone())
                .address(entity.getAddress())
                .role(entity.getRole())
                .isActive(entity.getIsActive())
                .avatar(entity.getAvatar() != null ? entity.getAvatar().getFileUrl() : null)
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    @Override
    public User toEntity(AdminUserResponse dto) {
        // Not needed for admin operations
        throw new UnsupportedOperationException("Converting AdminUserResponse to User is not supported");
    }
}
