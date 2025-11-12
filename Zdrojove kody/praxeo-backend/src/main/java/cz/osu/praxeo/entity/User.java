package cz.osu.praxeo.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.AssertTrue;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String jmeno;

    @Column(nullable = false)
    private String prijmeni;

    @Column(unique = true, nullable = false)
    private String email;

    private String heslo;

    @Column(unique = true)
    private String studijniCislo;

    @Enumerated(EnumType.STRING)
    private Role role;

    @AssertTrue(message = "Student musí mít vyplněné studijní číslo.")
    public boolean isStudentHasStudijniCislo() {
        if (role == Role.STUDENT) {
            return studijniCislo != null && !studijniCislo.isBlank();
        }
        return true;
    }
}
