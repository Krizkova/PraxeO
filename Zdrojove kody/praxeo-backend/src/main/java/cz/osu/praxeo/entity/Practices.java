package cz.osu.praxeo.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

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

    private LocalDateTime createdAt;

    private LocalDateTime selectedAt;

    private LocalDateTime completedAt;

    @Enumerated(EnumType.STRING)
    private PracticeState state;

    @ManyToOne
    @JoinColumn(name = "founder_id")
    private User founder;

    @OneToOne
    @JoinColumn(name = "student_id")
    private User student;

    @Column(columnDefinition = "TEXT")
    private String finalEvaluation;

    private boolean closed;

    private boolean markedForExport;

    @OneToMany(mappedBy = "practice", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Task> tasks = new ArrayList<>();
}
