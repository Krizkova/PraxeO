package cz.osu.praxeo.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.AssertTrue;
import lombok.Getter;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Entity
@Getter
@Setter
@Table(name = "users")
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column(unique = true, nullable = false)
    private String email;

    private String password;

    @Column(unique = true, nullable = true)
    private String studentNumber;

    private String companyName;

    @Enumerated(EnumType.STRING)
    private Role role;

    private LocalDateTime lastLogin;

    private boolean active;

    @AssertTrue(message = "Student musi mit vyplnene studijni cislo.")
    public boolean isStudentHasStudentNumber() {
        if (role == Role.STUDENT) {
            return studentNumber != null && !studentNumber.isBlank();
        }
        return true;
    }

    @AssertTrue(message = "Firma musi mit vyplnene nazev firmy.")
    public boolean isCompanyasCompanyName() {
        if (role == Role.EXTERNAL_WORKER) {
            return companyName != null && !companyName.isBlank();
        }
        return true;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(() -> "ROLE_" + role);
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() { return true; }

    @Override
    public boolean isAccountNonLocked() { return true; }

    @Override
    public boolean isCredentialsNonExpired() { return true; }

    @Override
    public boolean isEnabled() { return true; }

}
