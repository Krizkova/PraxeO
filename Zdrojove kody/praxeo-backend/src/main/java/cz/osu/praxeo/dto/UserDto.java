package cz.osu.praxeo.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import cz.osu.praxeo.entity.Role;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
public class UserDto {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;
    private String studentNumber;
    private String companyName;
    private Role role;
    private LocalDateTime lastLogin;
    private boolean active;
}
