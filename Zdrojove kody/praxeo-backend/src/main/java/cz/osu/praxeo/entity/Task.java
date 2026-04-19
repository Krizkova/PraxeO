package cz.osu.praxeo.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@Table(name = "tasks")
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @ManyToOne
    @JoinColumn(name = "practice_id")
    private Practices practice;

    @ManyToOne
    @JoinColumn(name = "founder_id")
    private User founder;

    @ElementCollection
    @CollectionTable(name = "task_links", joinColumns = @JoinColumn(name = "task_id"))
    @Column(name = "link")
    private List<String> links = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "task_files", joinColumns = @JoinColumn(name = "task_id"))
    @Column(name = "file_path")
    private List<String> files = new ArrayList<>();

    private LocalDateTime creationDate;
    private LocalDate expectedEndDate; // Can be null
    private LocalDate actualEndDate;

    private boolean closed;

    @Column(columnDefinition = "TEXT")
    private String finalEvaluation;

    @ManyToOne
    @JoinColumn(name = "evaluation_author_id")
    private User evaluationAuthor; // Who inserted/last edited the evaluation

    @Enumerated(EnumType.STRING)
    private TaskStatus status;

    private boolean reportFlag;
}
