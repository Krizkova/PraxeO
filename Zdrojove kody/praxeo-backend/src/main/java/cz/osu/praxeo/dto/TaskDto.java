package cz.osu.praxeo.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TaskDto {
    private Long id;
    private String title;
    private String description;
    private boolean closed;
    private String finalEvaluation;
    private boolean reportFlag;
}
