package cz.osu.praxeo.mapper;

import cz.osu.praxeo.dto.TaskDto;
import cz.osu.praxeo.entity.Task;
import org.springframework.stereotype.Component;

@Component
public class TaskMapper {

    public TaskDto toDto(Task task) {
        TaskDto dto = new TaskDto();
        dto.setId(task.getId());
        dto.setTitle(task.getTitle());
        dto.setDescription(task.getDescription());
        dto.setClosed(task.isClosed());
        dto.setFinalEvaluation(task.getFinalEvaluation());
        dto.setReportFlag(task.isReportFlag());
        return dto;
    }
}
