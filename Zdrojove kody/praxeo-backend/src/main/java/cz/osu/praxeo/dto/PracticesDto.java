package cz.osu.praxeo.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class PracticesDto {
    private Long id;
    private String name;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime selectedAt;
    private LocalDate completedAt;
    private String state;
    private String founderEmail;
    private String studentEmail;
    private String finalEvaluation;
    private boolean closed;
    private boolean markedForExport;
    private List<TaskDto> tasks;
}
