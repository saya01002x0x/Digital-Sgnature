package sis.hust.edu.vn.digital_signature.mapper.user;

import org.springframework.stereotype.Component;
import sis.hust.edu.vn.digital_signature.dto.user.response.UserResponse;
import sis.hust.edu.vn.digital_signature.entity.User;
import sis.hust.edu.vn.digital_signature.mapper.Mapper;

@Component
public class UserMapper implements Mapper<User, UserResponse> {

    @Override
    public UserResponse toDto(User entity) {
        if (entity == null) {
            return null;
        }
        return UserResponse.builder()
                .id(entity.getId())
                .username(entity.getUsername())
                .email(entity.getEmail())
                .fullName(entity.getFullName())
                .phone(entity.getPhone())
                .address(entity.getAddress())
                .dateOfBirth(entity.getDateOfBirth())
                .gender(entity.getGender())
                .avatar(entity.getAvatar() != null ? entity.getAvatar().getFileUrl() : null)
                .isActive(entity.getIsActive())
                .role(entity.getRole())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    @Override
    public User toEntity(UserResponse dto) {
        if (dto == null) {
            return null;
        }
        return User.builder()
                .id(dto.getId())
                .username(dto.getUsername())
                .email(dto.getEmail())
                .fullName(dto.getFullName())
                .phone(dto.getPhone())
                .address(dto.getAddress())
                .dateOfBirth(dto.getDateOfBirth())
                .gender(dto.getGender())
                .avatar(null)
                .isActive(dto.getIsActive())
                .role(dto.getRole())
                .build();
    }
}

