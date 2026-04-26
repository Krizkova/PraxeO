package cz.osu.praxeo.service;

import cz.osu.praxeo.dao.PracticesRepository;
import cz.osu.praxeo.dao.TaskRepository;
import cz.osu.praxeo.dto.AttachmentDto;
import cz.osu.praxeo.dto.TaskDto;
import cz.osu.praxeo.entity.*;
import cz.osu.praxeo.mapper.AttachmentMapper;
import cz.osu.praxeo.mapper.TaskMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final PracticesRepository practicesRepository;
    private final TaskMapper taskMapper;
    private final AttachmentMapper attachmentMapper;
    private final UserService userService;

    @Transactional(readOnly = true)
    public List<TaskDto> getTasksForPractice(Long practiceId) {
        return taskRepository.findByPracticeId(practiceId)
                .stream()
                .map(taskMapper::toDto)
                .toList();
    }

    @Transactional
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

        taskRepository.save(task);
        return taskMapper.toDto(task);
    }

    @Transactional
    public void deleteTask(Long id) {
        taskRepository.delete(canOperateWithTask(id));
    }

    @Transactional
    public TaskDto updateTask(Long id, TaskDto request) {
        Task task = canOperateWithTask(id);

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setLinks(request.getLinks());
        task.setExpectedEndDate(request.getExpectedEndDate());
        task.setReportFlag(request.isReportFlag());

        if (request.getFinalEvaluation() != null && !request.getFinalEvaluation().equals(task.getFinalEvaluation())) {
            boolean wasEmpty = task.getFinalEvaluation() == null || task.getFinalEvaluation().isBlank();
            task.setFinalEvaluation(request.getFinalEvaluation());
            task.setEvaluationAuthor(userService.getCurrentUser());
            // If evaluation is added, we might want to close the task
            if (wasEmpty && !request.getFinalEvaluation().isBlank() && task.getActualEndDate() == null) {
                task.setActualEndDate(LocalDate.now());
                task.setStatus(TaskStatus.COMPLETED);
            }
        }

        taskRepository.save(task);
        return taskMapper.toDto(task);
    }

    private Task canOperateWithTask(Long id) {
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
        return task;
    }
}