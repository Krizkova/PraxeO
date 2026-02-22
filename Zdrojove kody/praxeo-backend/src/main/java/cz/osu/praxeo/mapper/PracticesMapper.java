package cz.osu.praxeo.mapper;

import cz.osu.praxeo.dto.PracticesDto;
import cz.osu.praxeo.dto.TaskDto;
import cz.osu.praxeo.entity.Practices;
import cz.osu.praxeo.entity.Task;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class PracticesMapper {

    private final TaskMapper taskMapper;

    public PracticesDto toDto(Practices practices) {
        PracticesDto dto = new PracticesDto();
        dto.setId(practices.getId());
        dto.setName(practices.getName());
        dto.setDescription(practices.getDescription());
        dto.setCreatedAt(practices.getCreatedAt());
        dto.setSelectedAt(practices.getSelectedAt());
        if (practices.getCompletedAt() != null) {
            dto.setCompletedAt(practices.getCompletedAt());
        }
        dto.setState(practices.getState() != null ? practices.getState().name() : null);
        dto.setFounderEmail(
                practices.getFounder() != null ? practices.getFounder().getEmail() : null
        );
        dto.setStudentEmail(
                practices.getStudent() != null ? practices.getStudent().getEmail() : null
        );
        dto.setFinalEvaluation(practices.getFinalEvaluation());
        dto.setStudentEvaluation(practices.getStudentEvaluation());
        dto.setClosed(practices.isClosed());
        dto.setMarkedForExport(practices.isMarkedForExport());
        if (practices.getTasks() != null) {
            dto.setTasks(
                    practices.getTasks()
                            .stream()
                            .map(taskMapper::toDto)
                            .collect(Collectors.toList())
            );
        }

        return dto;
    }

}
