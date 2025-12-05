package sis.hust.edu.vn.digital_signature.dto.user.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import sis.hust.edu.vn.digital_signature.entity.enums.Gender;
import sis.hust.edu.vn.digital_signature.entity.enums.Role;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {

    private String id;

    private String username;

    private String email;

    private String fullName;

    private String phone;

    private String address;

    private LocalDate dateOfBirth;

    private Gender gender;

    private String avatar;

    private Boolean isActive;

    private Role role;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}

