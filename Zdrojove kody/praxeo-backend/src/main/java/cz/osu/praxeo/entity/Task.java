package cz.osu.praxeo.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

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
    @JoinColumn(name = "practice_detail_id")
    private PracticeDetail practiceDetail;

    @ManyToOne
    @JoinColumn(name = "founder_id")
    private User founder;

    private boolean closed;

    @Column(columnDefinition = "TEXT")
    private String finalEvaluation;

    private boolean reportFlag;
}
