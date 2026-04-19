package cz.osu.praxeo.mapper;

import cz.osu.praxeo.dto.TaskDto;
import cz.osu.praxeo.entity.Task;
import org.springframework.stereotype.Component;

@Component
public class TaskMapper {

    public TaskDto toDto(Task task) {
        if (task == null) return null;

        TaskDto dto = new TaskDto();
        dto.setId(task.getId());
        dto.setTitle(task.getTitle());
        dto.setDescription(task.getDescription());
        dto.setFounder(task.getFounder());
        dto.setAuthorId(task.getFounder() != null ? task.getFounder().getId() : null);
        dto.setLinks(task.getLinks());
        dto.setFiles(task.getFiles());
        dto.setCreationDate(task.getCreationDate());
        dto.setExpectedEndDate(task.getExpectedEndDate());
        dto.setActualEndDate(task.getActualEndDate());
        dto.setClosed(task.isClosed());
        dto.setFinalEvaluation(task.getFinalEvaluation());
        dto.setEvaluationAuthorName(task.getEvaluationAuthor() != null ?
                task.getEvaluationAuthor().getFirstName() + " " + task.getEvaluationAuthor().getLastName() : null);
        dto.setStatus(task.getStatus());
        dto.setReportFlag(task.isReportFlag());

        return dto;
    }
}
