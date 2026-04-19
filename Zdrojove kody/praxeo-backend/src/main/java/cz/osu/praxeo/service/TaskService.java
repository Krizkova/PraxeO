package cz.osu.praxeo.service;

import cz.osu.praxeo.dao.PracticesRepository;
import cz.osu.praxeo.dao.TaskRepository;
import cz.osu.praxeo.dto.TaskDto;
import cz.osu.praxeo.entity.Practices;
import cz.osu.praxeo.entity.Task;
import cz.osu.praxeo.entity.TaskStatus;
import cz.osu.praxeo.entity.User;
import cz.osu.praxeo.entity.Role;
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

        User currentUser = userService.getCurrentUser();
        boolean isFounder = practice.getFounder() != null && practice.getFounder().getId().equals(currentUser.getId());
        boolean isStudent = practice.getStudent() != null && practice.getStudent().getId().equals(currentUser.getId());
        boolean isAdmin = currentUser.getRole() == Role.ADMIN;

        if (!isFounder && !isStudent && !isAdmin) {
            throw new RuntimeException("Nemáte oprávnění k vytvoření úkolu pro tuto praxi");
        }

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
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task neexistuje"));

        User currentUser = userService.getCurrentUser();
        Practices practice = task.getPractice();
        boolean isFounder = practice.getFounder() != null && practice.getFounder().getId().equals(currentUser.getId());
        boolean isStudent = practice.getStudent() != null && practice.getStudent().getId().equals(currentUser.getId());
        boolean isAdmin = currentUser.getRole() == Role.ADMIN;

        if (!isFounder && !isStudent && !isAdmin) {
            throw new RuntimeException("Nemáte oprávnění ke smazání tohoto úkolu");
        }

        taskRepository.delete(task);
    }

    public TaskDto updateTask(Long id, TaskDto request) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task neexistuje"));

        User currentUser = userService.getCurrentUser();
        Practices practice = task.getPractice();
        boolean isFounder = practice.getFounder() != null && practice.getFounder().getId().equals(currentUser.getId());
        boolean isStudent = practice.getStudent() != null && practice.getStudent().getId().equals(currentUser.getId());
        boolean isAdmin = currentUser.getRole() == Role.ADMIN;

        if (!isFounder && !isStudent && !isAdmin) {
            throw new RuntimeException("Nemáte oprávnění k úpravě tohoto úkolu");
        }

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setLinks(request.getLinks());
        task.setFiles(request.getFiles());
        task.setExpectedEndDate(request.getExpectedEndDate());
        task.setReportFlag(request.isReportFlag());

        if (request.getFinalEvaluation() != null && !request.getFinalEvaluation().equals(task.getFinalEvaluation())) {
            task.setFinalEvaluation(request.getFinalEvaluation());
            task.setEvaluationAuthor(userService.getCurrentUser());
            // If evaluation is added, we might want to close the task
            if (task.getActualEndDate() == null) {
                task.setActualEndDate(LocalDateTime.now());
                task.setStatus(TaskStatus.COMPLETED);
            }
        }

        taskRepository.save(task);
        return taskMapper.toDto(task);
    }
}