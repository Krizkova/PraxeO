package cz.osu.praxeo.dto;

import cz.osu.praxeo.entity.TaskStatus;
import cz.osu.praxeo.entity.User;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class TaskDto {
    private Long id;
    private String title;

    private Long authorId;
    private User founder;
    private List<String> links;
    private List<String> files;
    private LocalDateTime creationDate;
    private LocalDateTime expectedEndDate;
    private LocalDateTime actualEndDate;
    private String evaluationAuthorName;
    private TaskStatus status;
    private String description;
    private boolean closed;
    private String finalEvaluation;
    private boolean reportFlag;
}
