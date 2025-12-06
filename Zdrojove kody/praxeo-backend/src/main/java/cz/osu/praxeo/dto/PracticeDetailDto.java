package cz.osu.praxeo.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PracticeDetailDto {
    private Long id;
    private PracticesDto practice;
    private String finalEvaluation;
    private boolean closed;
    private boolean markedForExport;
}