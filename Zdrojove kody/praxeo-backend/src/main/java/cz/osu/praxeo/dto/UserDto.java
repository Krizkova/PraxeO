package cz.osu.praxeo.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import cz.osu.praxeo.entity.Role;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserDto {
    private Long id;
    private String jmeno;
    private String prijmeni;
    private String email;
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String heslo;
    private String studijniCislo;
    private Role role;
}
