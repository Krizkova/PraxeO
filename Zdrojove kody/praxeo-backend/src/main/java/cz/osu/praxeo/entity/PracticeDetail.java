package cz.osu.praxeo.entity;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "practice_detail")
public class PracticeDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "practice_id")
    private Practices practice;

    @Column(columnDefinition = "TEXT")
    private String finalEvaluation;

    private boolean closed;

    private boolean markedForExport;


}
