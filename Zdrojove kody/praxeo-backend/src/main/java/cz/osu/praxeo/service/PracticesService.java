package cz.osu.praxeo.service;

import cz.osu.praxeo.dao.AttachmentRepository;
import cz.osu.praxeo.dao.PracticesRepository;
import cz.osu.praxeo.dao.TaskRepository;
import cz.osu.praxeo.dto.PracticesDto;
import cz.osu.praxeo.entity.PracticeState;
import cz.osu.praxeo.entity.Practices;
import cz.osu.praxeo.entity.Role;
import cz.osu.praxeo.entity.User;
import cz.osu.praxeo.mapper.PracticesMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PracticesService {

    private final PracticesMapper practicesMapper;
    private final UserService userService;
    private final PracticesRepository practicesRepository;
    private final TaskRepository taskRepository;
    private final AttachmentRepository attachmentRepository;

    @Transactional(readOnly = true)
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

    @Transactional(readOnly = true)
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
                isFounder
                        && !practice.isClosed()
                        && (
                        isSubmitted ||
                                (isActive && practice.getFinalEvaluation() != null && !practice.getFinalEvaluation().trim().isEmpty())
                )
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
        boolean isAdmin = currentUser.getRole() == Role.ADMIN;

        if (!isFounder && !isAdmin) {
            throw new RuntimeException("Nemáte oprávnění měnit stav praxe");
        }

        if (practice.isClosed() && !isAdmin) {
            throw new RuntimeException("Praxe je již uzavřena");
        }

        // Admin může měnit na jakýkoliv stav, ostatní jen na CANCELED nebo COMPLETED
        PracticeState state;
        try {
            state = PracticeState.valueOf(newState);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Neplatný stav");
        }

        if (!isAdmin && state != PracticeState.CANCELED && state != PracticeState.COMPLETED) {
            throw new RuntimeException("Neplatný stav");
        }

        practice.setState(state);

        // closed odráží pouze finalitu praxe
        // Admin může znovu otevřít praxi změnou stavu na nekoncový stav
        if (state == PracticeState.CANCELED || state == PracticeState.COMPLETED) {
            practice.setClosed(true);
        } else {
            practice.setClosed(false);
        }

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

    @Transactional
    public PracticesDto updatePractice(Long id, PracticesDto request) {
        Practices practice = practicesRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Praxe neexistuje"));

        User currentUser = userService.getCurrentUser();

        boolean isFounder = practice.getFounder().getId().equals(currentUser.getId());
        boolean isStudent = practice.getStudent() != null && practice.getStudent().getId().equals(currentUser.getId());
        boolean isAdmin = currentUser.getRole() == Role.ADMIN;
        // 1. Aktualizace polí pro běžné role
        if (isFounder && (practice.getState() == PracticeState.NEW || practice.getState() == PracticeState.ACTIVE || practice.getState() == PracticeState.SUBMITTED)) {
            if (request.getName() != null) practice.setName(request.getName());
            if (request.getDescription() != null) practice.setDescription(request.getDescription());
            if (request.getCompletedAt() != null) practice.setCompletedAt(request.getCompletedAt());
        }

        if (isFounder && practice.getState() == PracticeState.SUBMITTED) {
            if (request.getFinalEvaluation() != null) practice.setFinalEvaluation(request.getFinalEvaluation());
        }

        if (isStudent && practice.getState() == PracticeState.ACTIVE) {
            practice.setStudentEvaluation(request.getStudentEvaluation());
        }

        // 2. Administrátorské změny
        if (isAdmin) {
            practice.setName(request.getName());
            practice.setDescription(request.getDescription());
            practice.setCompletedAt(request.getCompletedAt());

            // Přepisovat hodnocení pouze pokud jsou explicitně zadána
            if (request.getStudentEvaluation() != null)
                practice.setStudentEvaluation(request.getStudentEvaluation().isBlank() ? null : request.getStudentEvaluation());

            if (request.getFinalEvaluation() != null)
                practice.setFinalEvaluation(request.getFinalEvaluation().isBlank() ? null : request.getFinalEvaluation());

            User currentStudent = practice.getStudent();
            User newFounder = resolveFounder(request.getFounderEmail());
            User newStudent = resolveStudent(request.getStudentEmail());

            if (newFounder == null)
                throw new RuntimeException("Zakladatel je povinný.");
            if (newFounder != null && newStudent != null && newFounder.getId().equals(newStudent.getId()))
                throw new RuntimeException("Zakladatel a student nemohou být stejná osoba");

            practice.setFounder(newFounder);

            // Před přiřazením nového studenta zkontrolujeme, zda nemá aktivní praxi
            if (newStudent != null && (currentStudent == null || !currentStudent.getId().equals(newStudent.getId()))) {
                boolean hasActivePractice = practicesRepository.findByStudent(newStudent).stream()
                        .anyMatch(p -> p.getState() == PracticeState.ACTIVE || p.getState() == PracticeState.SUBMITTED);
                if (hasActivePractice) {
                    throw new RuntimeException("Tento student již má aktivní praxi.");
                }
            }

            // 3. Logika změny nebo odebrání studenta — tasky se zachovávají
            boolean removingStudent = request.getStudentEmail() == null || request.getStudentEmail().isBlank();

            if (removingStudent && currentStudent != null) {
                // Odebíráme studenta — tasky zůstávají, resetujeme stav
                practice.setStudent(null);
                practice.setSelectedAt(null);
                practice.setState(PracticeState.NEW);
                practice.setClosed(false);
            } else if ((currentStudent == null && newStudent != null) ||
                    (currentStudent != null && newStudent != null && !currentStudent.getId().equals(newStudent.getId()))) {
                // Měníme studenta nebo přiřazujeme nového — tasky zůstávají
                practice.setStudent(newStudent);
                practice.setSelectedAt(LocalDateTime.now());
                practice.setState(PracticeState.ACTIVE);
                practice.setClosed(false);
            }

            // 4. Validace stavu praxe (po aktualizaci vazeb na studenta)
            if (request.getState() != null && !request.getState().isBlank()) {
                PracticeState newState = parsePracticeState(request.getState());
                User effectiveStudent = practice.getStudent();

                if (effectiveStudent == null) {
                    // Bez studenta povolujeme pouze tyto dva stavy
                    if (newState != PracticeState.NEW && newState != PracticeState.CANCELED)
                        throw new RuntimeException("Bez přiřazeného studenta lze nastavit pouze stavy Nový a Zrušený.");
                } else {
                    // Se studentem už nesmí být stav Nový
                    if (newState == PracticeState.NEW)
                        throw new RuntimeException("Se přiřazeným studentem nelze nastavit stav Nový.");
                }
                practice.setState(newState);
                applyClosedFlag(practice, newState);
            }
        }

        // Student nemůže editovat v SUBMITTED
        if (isStudent && practice.getState() == PracticeState.SUBMITTED) {
            throw new RuntimeException("Nemáte oprávnění upravovat tuto praxi");
        }

        // 5. Kontrola oprávnění pro uložení
        if (!isAdmin && !isFounder && !isStudent)
            throw new RuntimeException("Nemáte oprávnění");

        practice.setLastModifiedAt(LocalDateTime.now());
        practicesRepository.save(practice);

        return getPracticeById(practice.getId());
    }

    private PracticeState parsePracticeState(String state) {
        try {
            return PracticeState.valueOf(state);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Neplatný stav");
        }
    }

    private void applyClosedFlag(Practices practice, PracticeState state) {
        practice.setClosed(state == PracticeState.CANCELED || state == PracticeState.COMPLETED);
    }

    private User resolveFounder(String founderEmail) {
        if (founderEmail == null || founderEmail.isBlank()) {
            return null;
        }

        User founder = userService.findByEmail(founderEmail);

        if (founder == null || !founder.isActive()) {
            throw new RuntimeException("Zadaný zakladatel neexistuje nebo není aktivní.");
        }

        if (founder.getRole() != Role.TEACHER && founder.getRole() != Role.EXTERNAL_WORKER) {
            throw new RuntimeException("Zakladatel musí být učitel nebo externista.");
        }

        return founder;
    }

    private User resolveStudent(String studentEmail) {
        if (studentEmail == null || studentEmail.isBlank()) {
            return null;
        }

        User student = userService.findByEmail(studentEmail);

        if (student == null) {
            throw new RuntimeException("Student s tímto emailem neexistuje");
        }

        if (student.getRole() != Role.STUDENT) {
            throw new RuntimeException("Neplatná role studenta");
        }

        return student;
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
                throw new org.springframework.web.server.ResponseStatusException(
                        org.springframework.http.HttpStatus.CONFLICT,
                        "Již máte jednu aktivní praxi. Před přihlášením na další musí být ta stávající dokončena."
                );
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
            // Student se může odhlásit pouze ze své vlastní aktivní praxe
            if (practice.getStudent() == null ||
                    !practice.getStudent().getId().equals(currentUser.getId())) {
                throw new RuntimeException("Nemáte přiřazenou tuto praxi");
            }

            if (practice.getState() != PracticeState.ACTIVE) {
                throw new RuntimeException("Nelze se odhlásit");
            }

            // Tasky zůstávají — pouze resetujeme studenta a stav
            practice.setStudent(null);
            practice.setSelectedAt(null);
            practice.setState(PracticeState.NEW);
            practice.setClosed(false);
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
