package cz.osu.praxeo.entity;

import jakarta.persistence.*;
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

    private String jmeno;
    private String prijmeni;

    @Column(unique = true, nullable = false)
    private String email;

    private String heslo;

    @Enumerated(EnumType.STRING)
    private Role role;

}
