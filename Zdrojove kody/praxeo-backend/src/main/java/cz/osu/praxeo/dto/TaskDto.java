package cz.osu.praxeo.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import cz.osu.praxeo.entity.TaskStatus;
import cz.osu.praxeo.entity.User;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
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
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private List<AttachmentDto> files;
    private LocalDateTime creationDate;
    private LocalDate expectedEndDate;
    private LocalDate actualEndDate;
    private String evaluationAuthorName;
    private TaskStatus status;
    private String description;
    private boolean closed;
    private String finalEvaluation;
    private boolean reportFlag;
}
