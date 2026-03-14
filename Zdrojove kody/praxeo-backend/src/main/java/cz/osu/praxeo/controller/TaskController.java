package cz.osu.praxeo.controller;

import cz.osu.praxeo.dto.TaskDto;
import cz.osu.praxeo.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @GetMapping("/practice/{practiceId}")
    public List<TaskDto> getTasks(@PathVariable Long practiceId) {
        return taskService.getTasksForPractice(practiceId);
    }

    @PostMapping("/practice/{practiceId}")
    public TaskDto createTask(@PathVariable Long practiceId,
                              @RequestBody TaskDto request) {
        return taskService.createTask(practiceId, request);
    }

    @DeleteMapping("/{id}")
    public void deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
    }
}