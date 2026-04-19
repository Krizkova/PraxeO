package cz.osu.praxeo.service;

import cz.osu.praxeo.dao.PracticesRepository;
import cz.osu.praxeo.dao.TaskRepository;
import cz.osu.praxeo.dto.TaskDto;
import cz.osu.praxeo.entity.Practices;
import cz.osu.praxeo.entity.Task;
import cz.osu.praxeo.entity.TaskStatus;
import cz.osu.praxeo.mapper.TaskMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final PracticesRepository practicesRepository;
    private final TaskMapper taskMapper;
    private final UserService userService;

    public List<TaskDto> getTasksForPractice(Long practiceId) {
        return taskRepository.findByPracticeId(practiceId)
                .stream()
                .map(taskMapper::toDto)
                .toList();
    }

    public TaskDto createTask(Long practiceId, TaskDto request) {

        Practices practice = practicesRepository.findById(practiceId)
                .orElseThrow(() -> new RuntimeException("Praxe neexistuje"));

        Task task = new Task();
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setPractice(practice);
        task.setFounder(userService.getCurrentUser()); // Automatically set founder
        task.setCreationDate(LocalDateTime.now());
        task.setStatus(TaskStatus.ACTIVE);
        task.setReportFlag(request.isReportFlag());
        task.setExpectedEndDate(request.getExpectedEndDate());
        task.setLinks(request.getLinks());
        task.setFiles(request.getFiles());

        taskRepository.save(task);
        return taskMapper.toDto(task);
    }

    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }


}