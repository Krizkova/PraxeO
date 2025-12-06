package cz.osu.praxeo.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name = "practices")
public class Practices {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String description;

    private LocalDateTime validFrom;

    private LocalDateTime validTo;

    @OneToOne
    @JoinColumn(name = "founder_id")
    private User founder;

    @OneToOne
    @JoinColumn(name = "student_id")
    private User student;
}
