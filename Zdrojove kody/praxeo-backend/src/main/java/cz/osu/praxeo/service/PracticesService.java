package cz.osu.praxeo.service;

import cz.osu.praxeo.dao.PracticesRepository;
import cz.osu.praxeo.dao.UserRepository;
import cz.osu.praxeo.dto.PracticesDto;
import cz.osu.praxeo.dto.UserDto;
import cz.osu.praxeo.entity.PracticeState;
import cz.osu.praxeo.entity.Practices;
import cz.osu.praxeo.entity.User;
import cz.osu.praxeo.mapper.PracticesMapper;
import cz.osu.praxeo.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PracticesService {

    private final PracticesMapper practicesMapper;
    private final UserService userService;
    private final PracticesRepository practicesRepository;

    public List<PracticesDto> getPracticesByRole() {

        User user = userService.getCurrentUser();
        if (user == null || user.getRole() == null) {
            // Ochrana pro testovací prostředí – bez přihlášeného uživatele vracíme prázdný seznam.
            return List.of();
        }

        String role = user.getRole().name();

        List<Practices> list;

        switch (role) {
            case "ADMIN":
            case "TEACHER":
                list = practicesRepository.findAll();
                break;
            case "STUDENT":
                List<Practices> assigned = practicesRepository.findByStudent(user);
                if (!assigned.isEmpty()) {
                    list = assigned;
                } else {
                    list = practicesRepository.findByStudentIsNull();
                }
                break;
            case "EXTERNAL_WORKER":
                list = practicesRepository.findByFounder(user);
                break;
            default:
                list = List.of();
        }

        return list.stream()
                .map(practicesMapper::toDto)
                .toList();
    }

    public PracticesDto getPracticeById(Long id) {
        Practices practice = practicesRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Praxe neexistuje"));

        User currentUser = userService.getCurrentUser();
        PracticesDto dto = practicesMapper.toDto(practice);

        boolean isFounder = practice.getFounder().getId().equals(currentUser.getId());
        boolean isStudent = practice.getStudent() != null &&
                practice.getStudent().getId().equals(currentUser.getId());

        boolean isNew = practice.getState() == PracticeState.NEW;
        boolean isActive = practice.getState() == PracticeState.ACTIVE;
        boolean isSubmitted = practice.getState() == PracticeState.SUBMITTED;

        dto.setCanEditFounderFields(
                isFounder && !practice.isClosed() && (isNew || isActive)
        );

        dto.setCanEditStudentFields(
                isStudent && isActive && !practice.isClosed()
        );

        dto.setCanUploadAttachments(
                (isFounder || isStudent) && !practice.isClosed()
        );

        dto.setCanEditTasks(
                (isFounder && (isNew || isActive)) ||
                        (isStudent && isActive)
        );

        dto.setCanEditFinalEvaluation(
                isFounder && isSubmitted && !practice.isClosed()
        );
        dto.setCanChangeState(
                isFounder && !practice.isClosed() &&
                        (isNew || isActive || isSubmitted)
        );

        return dto;
    }

    public PracticesDto changePracticeState(Long id, String newState) {

        Practices practice = practicesRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Praxe neexistuje"));

        User currentUser = userService.getCurrentUser();

        boolean isFounder = practice.getFounder().getId().equals(currentUser.getId());

        if (!isFounder) {
            throw new RuntimeException("Nemáte oprávnění měnit stav praxe");
        }

        if (practice.isClosed()) {
            throw new RuntimeException("Praxe je již uzavřena");
        }

        if ("CANCELED".equals(newState)) {
            practice.setState(PracticeState.CANCELED);
        } else if ("COMPLETED".equals(newState)) {
            practice.setState(PracticeState.COMPLETED);
        } else {
            throw new RuntimeException("Neplatný stav");
        }

        practice.setClosed(true);
        practice.setLastModifiedAt(LocalDateTime.now());

        practicesRepository.save(practice);

        return getPracticeById(practice.getId());
    }

    public PracticesDto createPractice(String name, String description, LocalDate completedAt) {
        User founder = userService.getCurrentUser();
        Practices practice = new Practices();
        practice.setName(name);
        practice.setDescription(description);
        practice.setCreatedAt(LocalDateTime.now());
        practice.setSelectedAt(null);
        if (completedAt != null) {
            practice.setCompletedAt(completedAt);
        }
        practice.setState(PracticeState.NEW);
        practice.setFounder(founder);
        practice.setStudent(null);
        practice.setClosed(false);
        practice.setMarkedForExport(false);
        Practices saved = practicesRepository.save(practice);

        return practicesMapper.toDto(saved);
    }

    public PracticesDto updatePractice(Long id, PracticesDto request) {
        Practices practice = practicesRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Praxe neexistuje"));
        User currentUser = userService.getCurrentUser();

        boolean isFounder = practice.getFounder().getId().equals(currentUser.getId());
        boolean isStudent = practice.getStudent() != null &&
                practice.getStudent().getId().equals(currentUser.getId());
        if (isFounder && (practice.getState() == PracticeState.NEW || practice.getState() == PracticeState.ACTIVE)) {
            practice.setName(request.getName());
            practice.setDescription(request.getDescription());
            practice.setCompletedAt(request.getCompletedAt());
        } else if (isFounder && practice.getState() == PracticeState.SUBMITTED) {
            practice.setFinalEvaluation(request.getFinalEvaluation());
        } else if (isStudent && practice.getState() == PracticeState.ACTIVE) {
            practice.setStudentEvaluation(request.getStudentEvaluation());
        } else {
            throw new RuntimeException("Nemáte oprávnění upravovat tuto praxi");
        }
        practice.setLastModifiedAt(LocalDateTime.now());
        practicesRepository.save(practice);

        return getPracticeById(practice.getId());
    }
}
