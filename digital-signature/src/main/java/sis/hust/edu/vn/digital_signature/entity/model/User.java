package sis.hust.edu.vn.digital_signature.entity.model;

import jakarta.persistence.*;
import lombok.*;
import sis.hust.edu.vn.digital_signature.entity.BaseEntity;
import sis.hust.edu.vn.digital_signature.entity.enums.Gender;
import sis.hust.edu.vn.digital_signature.entity.enums.Role;

import java.time.LocalDate;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "username", unique = true, nullable = false)
    private String username;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "email", unique = true, nullable = false)
    private String email;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(name = "phone")
    private String phone;

    @Column(name = "address")
    private String address;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(name = "gender")
    @Enumerated(EnumType.STRING)
    private Gender gender;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "avatar_id", referencedColumnName = "id", nullable = true)
    private File avatar;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    @Column(name = "role")
    @Enumerated(EnumType.STRING)
    private Role role;
}


