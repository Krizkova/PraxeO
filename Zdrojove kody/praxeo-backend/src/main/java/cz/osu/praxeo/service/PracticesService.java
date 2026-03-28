package cz.osu.praxeo.service;

import cz.osu.praxeo.dao.PracticesRepository;
import cz.osu.praxeo.dao.UserRepository;
import cz.osu.praxeo.dto.PracticesDto;
import cz.osu.praxeo.dto.UserDto;
import cz.osu.praxeo.entity.PracticeState;
import cz.osu.praxeo.entity.Practices;
import cz.osu.praxeo.entity.Role;
import cz.osu.praxeo.entity.User;
import cz.osu.praxeo.mapper.PracticesMapper;
import cz.osu.praxeo.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class PracticesService {

    private final PracticesMapper practicesMapper;
    private final UserService userService;
    private final PracticesRepository practicesRepository;

    public List<PracticesDto> getPracticesByRole() {

        User user = userService.getCurrentUser();

        String role = user.getRole().name();

        List<Practices> list;

        switch (role) {
            case "ADMIN":
            case "TEACHER":
                list = practicesRepository.findAll();
                break;
            case "STUDENT":
                // 1. Najít všechny praxe, kde je tento uživatel studentem
                List<Practices> studentPractices = practicesRepository.findByStudent(user);

                // 2. Zjistit, zda má student nějakou aktivní (nedokončenou) praxi
                boolean hasActive = studentPractices.stream()
                        .anyMatch(p -> p.getState() != PracticeState.COMPLETED && p.getState() != PracticeState.CANCELED);

                if (hasActive) {
                    // Pokud má aktivní praxi, vidí jen své praxe (včetně historie)
                    list = studentPractices;
                } else {
                    // Pokud nemá aktivní praxi, vidí své praxe + pouze ty volné, které jsou ve stavu NEW
                    list = new ArrayList<>();
                    list.addAll(studentPractices);

                    // Přidáme pouze praxe bez studenta, které jsou ve stavu NEW
                    List<Practices> availablePractices = practicesRepository.findByStudentIsNull().stream()
                            .filter(p -> p.getState() == PracticeState.NEW)
                            .toList();

                    list.addAll(availablePractices);
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
        boolean isAdmin = currentUser.getRole() == Role.ADMIN;
        if (isFounder && (practice.getState() == PracticeState.NEW || practice.getState() == PracticeState.ACTIVE)) {
            practice.setName(request.getName());
            practice.setDescription(request.getDescription());
            practice.setCompletedAt(request.getCompletedAt());
        } else if (isFounder && practice.getState() == PracticeState.SUBMITTED) {
            practice.setFinalEvaluation(request.getFinalEvaluation());
        } else if (isStudent && practice.getState() == PracticeState.ACTIVE) {
            practice.setStudentEvaluation(request.getStudentEvaluation());
        } else if (isAdmin) {
            practice.setName(request.getName());
            practice.setDescription(request.getDescription());
            practice.setCompletedAt(request.getCompletedAt());
            practice.setStudentEvaluation(request.getStudentEvaluation());
            practice.setFinalEvaluation(request.getFinalEvaluation());
            practice.setState(PracticeState.valueOf(request.getState()));

            User newFounder = null;
            User newStudent = null;

            if (request.getFounderEmail() != null && !request.getFounderEmail().isBlank()) {
                newFounder = userService.findByEmail(request.getFounderEmail());

                if (newFounder == null) {
                    throw new RuntimeException("Zakladatel s tímto emailem neexistuje");
                }

                if (newFounder.getRole() != Role.TEACHER && newFounder.getRole() != Role.EXTERNAL_WORKER) {
                    throw new RuntimeException("Neplatná role zakladatele");
                }
            }

            if (request.getStudentEmail() != null && !request.getStudentEmail().isBlank()) {
                newStudent = userService.findByEmail(request.getStudentEmail());

                if (newStudent == null) {
                    throw new RuntimeException("Student s tímto emailem neexistuje");
                }

                if (newStudent.getRole() != Role.STUDENT) {
                    throw new RuntimeException("Neplatná role studenta");
                }
            }

            if (newFounder != null && newStudent != null &&
                    newFounder.getId().equals(newStudent.getId())) {
                throw new RuntimeException("Zakladatel a student nemohou být stejná osoba");
            }

            if (newFounder != null) {
                practice.setFounder(newFounder);
            }

            if (request.getStudentEmail() == null || request.getStudentEmail().isBlank()) {
                practice.setStudent(null);
                practice.setState(PracticeState.NEW);
            } else {
                if (practice.getStudent() == null ||
                        !practice.getStudent().getId().equals(Objects.requireNonNull(newStudent).getId())) {

                    practice.setStudent(newStudent);
                    practice.setState(PracticeState.NEW);
                }
            }
        } else {
            throw new RuntimeException("Nemáte oprávnění upravovat tuto praxi");
        }
        practice.setLastModifiedAt(LocalDateTime.now());
        practicesRepository.save(practice);

        return getPracticeById(practice.getId());
    }

    public PracticesDto assignStudent(Long id, boolean assign) {

        Practices practice = practicesRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Praxe neexistuje"));

        User currentUser = userService.getCurrentUser();

        if (assign) {
            // --- ZAČÁTEK NOVÉ KONTROLY ---
            // Ověříme, zda student již nemá jinou praxi, která probíhá (ACTIVE) nebo čeká na schválení (SUBMITTED)
            boolean hasActivePractice = practicesRepository.findByStudent(currentUser).stream()
                    .anyMatch(p -> p.getState() == PracticeState.ACTIVE || p.getState() == PracticeState.SUBMITTED);

            if (hasActivePractice) {
                throw new RuntimeException("Již máte jednu aktivní praxi. Před přihlášením na další musí být ta stávající dokončena.");
            }
            // --- KONEC NOVÉ KONTROLY ---

            if (practice.getStudent() != null) {
                throw new RuntimeException("Praxe je již obsazena");
            }

            if (practice.getState() != PracticeState.NEW) {
                throw new RuntimeException("Nelze se přihlásit k této praxi");
            }

            practice.setStudent(currentUser);
            practice.setSelectedAt(LocalDateTime.now());
            practice.setState(PracticeState.ACTIVE);

        } else {
            // ... zbytek metody pro odhlášení (unassign) zůstává stejný
            if (practice.getStudent() == null ||
                    !practice.getStudent().getId().equals(currentUser.getId())) {
                throw new RuntimeException("Nemáte přiřazenou tuto praxi");
            }

            if (practice.getState() != PracticeState.ACTIVE) {
                throw new RuntimeException("Nelze se odhlásit");
            }

            practice.setStudent(null);
            practice.setSelectedAt(null);
            practice.setState(PracticeState.NEW);
        }

        practicesRepository.save(practice);

        return getPracticeById(practice.getId());
    }

    public PracticesDto changeStudentState(Long id, String state) {

        Practices practice = practicesRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Praxe neexistuje"));

        User currentUser = userService.getCurrentUser();

        boolean isStudent = practice.getStudent() != null &&
                practice.getStudent().getId().equals(currentUser.getId());

        if (!isStudent) {
            throw new RuntimeException("Nemáte oprávnění");
        }

        if ("SUBMITTED".equals(state) && practice.getState() == PracticeState.ACTIVE) {

            if (practice.getStudentEvaluation() == null || practice.getStudentEvaluation().trim().isEmpty()) {
                throw new RuntimeException("Nejprve musíte vyplnit hodnocení studenta.");
            }

            practice.setState(PracticeState.SUBMITTED);

        } else if ("ACTIVE".equals(state) && practice.getState() == PracticeState.SUBMITTED) {

            if (practice.getFinalEvaluation() != null && !practice.getFinalEvaluation().trim().isEmpty()) {
                throw new RuntimeException("Nelze vrátit praxi – vedoucí již přidal hodnocení.");
            }

            practice.setState(PracticeState.ACTIVE);

        } else {
            throw new RuntimeException("Neplatná změna stavu");
        }

        practice.setLastModifiedAt(LocalDateTime.now());

        practicesRepository.save(practice);

        return getPracticeById(practice.getId());
    }
}
