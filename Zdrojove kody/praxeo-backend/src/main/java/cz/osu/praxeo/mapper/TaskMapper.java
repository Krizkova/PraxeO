package cz.osu.praxeo.mapper;

import cz.osu.praxeo.dto.TaskDto;
import cz.osu.praxeo.entity.Attachment;
import cz.osu.praxeo.entity.Task;
import cz.osu.praxeo.dao.AttachmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class TaskMapper {

    private final AttachmentMapper attachmentMapper;
    private final AttachmentRepository attachmentRepository;

    public TaskDto toDto(Task task) {
        if (task == null) return null;

        TaskDto dto = new TaskDto();
        dto.setId(task.getId());
        dto.setTitle(task.getTitle());
        dto.setDescription(task.getDescription());
        dto.setFounder(task.getFounder());
        dto.setAuthorId(task.getFounder() != null ? task.getFounder().getId() : null);
        dto.setLinks(task.getLinks());
        dto.setCreationDate(task.getCreationDate());
        dto.setExpectedEndDate(task.getExpectedEndDate());
        dto.setActualEndDate(task.getActualEndDate());
        dto.setClosed(task.isClosed());
        dto.setFinalEvaluation(task.getFinalEvaluation());
        dto.setEvaluationAuthorName(task.getEvaluationAuthor() != null ?
                task.getEvaluationAuthor().getFirstName() + " " + task.getEvaluationAuthor().getLastName() : null);
        dto.setStatus(task.getStatus());
        dto.setReportFlag(task.isReportFlag());

        List<Attachment> attachments = attachmentRepository.findByTaskId(task.getId());
        if (attachments != null) {
            dto.setFiles(attachments.stream()
                    .map(attachmentMapper::toDto)
                    .toList());
        }

        return dto;
    }
}
