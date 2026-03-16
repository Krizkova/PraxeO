package cz.osu.praxeo.service;

import cz.osu.praxeo.dao.PracticesRepository;
import cz.osu.praxeo.dto.PracticesDto;
import cz.osu.praxeo.entity.*;
import cz.osu.praxeo.mapper.PracticesMapper;
import cz.osu.praxeo.mapper.TaskMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("PracticesServiceTest")
class PracticesServiceTest {

    @Mock
    UserService userService;

    @Mock
    PracticesRepository practicesRepository;

    private PracticesMapper practicesMapper;

    private PracticesService practicesService;

    @BeforeEach
    void setUp() {
        TaskMapper taskMapper = new TaskMapper();
        practicesMapper = new PracticesMapper(taskMapper);
        practicesService = new PracticesService(practicesMapper, userService, practicesRepository);
    }

    private User makeUser(Long id, Role role) {
        User u = new User();
        u.setId(id);
        u.setRole(role);
        u.setEmail(role.name().toLowerCase() + id + "@osu.cz");
        return u;
    }

    private Practices makePractice(Long id, User founder, PracticeState state) {
        Practices p = new Practices();
        p.setId(id);
        p.setName("Praxe " + id);
        p.setDescription("Popis praxe " + id);
        p.setFounder(founder);
        p.setState(state);
        p.setClosed(false);
        return p;
    }

    //  getPracticesByRole

    @Test
    @DisplayName("getPracticesByRole – admin vidí všechny praxe")
    void getPracticesByRole_adminGetsAll() {
        User admin = makeUser(1L, Role.ADMIN);
        when(userService.getCurrentUser()).thenReturn(admin);

        Practices p = makePractice(1L, admin, PracticeState.NEW);
        when(practicesRepository.findAll()).thenReturn(List.of(p));

        List<PracticesDto> result = practicesService.getPracticesByRole();

        assertEquals(1, result.size());
        assertEquals("Praxe 1", result.get(0).getName());
        assertEquals("NEW", result.get(0).getState());
        verify(practicesRepository).findAll();
    }

    @Test
    @DisplayName("getPracticesByRole – učitel vidí všechny praxe")
    void getPracticesByRole_teacherGetsAll() {
        User teacher = makeUser(2L, Role.TEACHER);
        when(userService.getCurrentUser()).thenReturn(teacher);

        Practices p = makePractice(1L, teacher, PracticeState.ACTIVE);
        when(practicesRepository.findAll()).thenReturn(List.of(p));

        List<PracticesDto> result = practicesService.getPracticesByRole();

        assertEquals(1, result.size());
        assertEquals("ACTIVE", result.get(0).getState());
        verify(practicesRepository).findAll();
    }

    @Test
    @DisplayName("getPracticesByRole – student s přiřazenou praxí vidí tu svou")
    void getPracticesByRole_studentWithAssignedPracticeGetsThat() {
        User founder = makeUser(99L, Role.TEACHER);
        User student = makeUser(3L, Role.STUDENT);
        when(userService.getCurrentUser()).thenReturn(student);

        Practices assigned = makePractice(1L, founder, PracticeState.ACTIVE);
        assigned.setStudent(student);
        when(practicesRepository.findByStudent(student)).thenReturn(List.of(assigned));

        List<PracticesDto> result = practicesService.getPracticesByRole();

        assertEquals(1, result.size());
        assertEquals(student.getEmail(), result.get(0).getStudentEmail());
        verify(practicesRepository, never()).findByStudentIsNull();
    }

    @Test
    @DisplayName("getPracticesByRole – student bez praxe vidí volné")
    void getPracticesByRole_studentWithoutPracticeGetsAvailable() {
        User founder = makeUser(99L, Role.TEACHER);
        User student = makeUser(3L, Role.STUDENT);
        when(userService.getCurrentUser()).thenReturn(student);

        when(practicesRepository.findByStudent(student)).thenReturn(List.of());

        Practices available = makePractice(2L, founder, PracticeState.NEW);
        when(practicesRepository.findByStudentIsNull()).thenReturn(List.of(available));

        List<PracticesDto> result = practicesService.getPracticesByRole();

        assertEquals(1, result.size());
        assertNull(result.get(0).getStudentEmail());
        assertEquals("NEW", result.get(0).getState());
        verify(practicesRepository).findByStudentIsNull();
    }

    @Test
    @DisplayName("getPracticesByRole – externí pracovník vidí své praxe")
    void getPracticesByRole_externalWorkerGetsOwnPractices() {
        User ext = makeUser(4L, Role.EXTERNAL_WORKER);
        when(userService.getCurrentUser()).thenReturn(ext);

        Practices p = makePractice(1L, ext, PracticeState.NEW);
        when(practicesRepository.findByFounder(ext)).thenReturn(List.of(p));

        List<PracticesDto> result = practicesService.getPracticesByRole();

        assertEquals(1, result.size());
        assertEquals(ext.getEmail(), result.get(0).getFounderEmail());
        verify(practicesRepository).findByFounder(ext);
    }

    //  getPracticeById

    @Test
    @DisplayName("getPracticeById – neexistující praxe vyhodí výjimku")
    void getPracticeById_notFound_throwsException() {
        when(practicesRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> practicesService.getPracticeById(999L));
    }

    @Test
    @DisplayName("getPracticeById – zakladatel může editovat NEW praxe – správné flagy")
    void getPracticeById_founderCanEditNewPractice() {
        User founder = makeUser(1L, Role.EXTERNAL_WORKER);
        when(userService.getCurrentUser()).thenReturn(founder);

        Practices p = makePractice(1L, founder, PracticeState.NEW);
        when(practicesRepository.findById(1L)).thenReturn(Optional.of(p));

        PracticesDto dto = practicesService.getPracticeById(1L);

        assertTrue(dto.isCanEditFounderFields());
        assertTrue(dto.isCanChangeState());
        assertFalse(dto.isCanEditStudentFields());
        assertFalse(dto.isCanEditFinalEvaluation());
        assertEquals("NEW", dto.getState());
        assertEquals(founder.getEmail(), dto.getFounderEmail());
    }

    @Test
    @DisplayName("getPracticeById – zakladatel může editovat ACTIVE praxe")
    void getPracticeById_founderCanEditActivePractice() {
        User founder = makeUser(1L, Role.EXTERNAL_WORKER);
        when(userService.getCurrentUser()).thenReturn(founder);

        Practices p = makePractice(1L, founder, PracticeState.ACTIVE);
        when(practicesRepository.findById(1L)).thenReturn(Optional.of(p));

        PracticesDto dto = practicesService.getPracticeById(1L);

        assertTrue(dto.isCanEditFounderFields());
        assertTrue(dto.isCanChangeState());
    }

    @Test
    @DisplayName("getPracticeById – zakladatel může nastavit hodnocení v SUBMITTED")
    void getPracticeById_founderCanEditFinalEvaluationInSubmitted() {
        User founder = makeUser(1L, Role.EXTERNAL_WORKER);
        when(userService.getCurrentUser()).thenReturn(founder);

        Practices p = makePractice(1L, founder, PracticeState.SUBMITTED);
        when(practicesRepository.findById(1L)).thenReturn(Optional.of(p));

        PracticesDto dto = practicesService.getPracticeById(1L);

        assertTrue(dto.isCanEditFinalEvaluation());
        assertTrue(dto.isCanChangeState());
        assertFalse(dto.isCanEditFounderFields());
    }

    @Test
    @DisplayName("getPracticeById – cizí uživatel nemá žádná editační oprávnění")
    void getPracticeById_nonFounderCannotEdit() {
        User founder = makeUser(1L, Role.EXTERNAL_WORKER);
        User other = makeUser(2L, Role.STUDENT);
        when(userService.getCurrentUser()).thenReturn(other);

        Practices p = makePractice(1L, founder, PracticeState.NEW);
        when(practicesRepository.findById(1L)).thenReturn(Optional.of(p));

        PracticesDto dto = practicesService.getPracticeById(1L);

        assertFalse(dto.isCanEditFounderFields());
        assertFalse(dto.isCanChangeState());
        assertFalse(dto.isCanEditStudentFields());
        assertFalse(dto.isCanUploadAttachments());
    }

    @Test
    @DisplayName("getPracticeById – student může editovat svá pole v ACTIVE")
    void getPracticeById_studentCanEditInActive() {
        User founder = makeUser(1L, Role.EXTERNAL_WORKER);
        User student = makeUser(2L, Role.STUDENT);
        when(userService.getCurrentUser()).thenReturn(student);

        Practices p = makePractice(1L, founder, PracticeState.ACTIVE);
        p.setStudent(student);
        when(practicesRepository.findById(1L)).thenReturn(Optional.of(p));

        PracticesDto dto = practicesService.getPracticeById(1L);

        assertTrue(dto.isCanEditStudentFields());
        assertTrue(dto.isCanUploadAttachments());
        assertFalse(dto.isCanEditFounderFields());
        assertEquals(student.getEmail(), dto.getStudentEmail());
    }

    @Test
    @DisplayName("getPracticeById – uzavřená praxe nemá žádná editační oprávnění")
    void getPracticeById_closedPracticeNoEditFlags() {
        User founder = makeUser(1L, Role.EXTERNAL_WORKER);
        when(userService.getCurrentUser()).thenReturn(founder);

        Practices p = makePractice(1L, founder, PracticeState.COMPLETED);
        p.setClosed(true);
        when(practicesRepository.findById(1L)).thenReturn(Optional.of(p));

        PracticesDto dto = practicesService.getPracticeById(1L);

        assertFalse(dto.isCanEditFounderFields());
        assertFalse(dto.isCanChangeState());
        assertFalse(dto.isCanUploadAttachments());
    }

    // createPractice

    @Test
    @DisplayName("createPractice – nová praxe má stav NEW a správná data")
    void createPractice_createsWithCorrectData() {
        User founder = makeUser(1L, Role.EXTERNAL_WORKER);
        when(userService.getCurrentUser()).thenReturn(founder);
        when(practicesRepository.save(any(Practices.class))).thenAnswer(inv -> inv.getArgument(0));

        PracticesDto result = practicesService.createPractice("Testovací praxe", "Popis", LocalDate.of(2025, 6, 30));

        assertEquals("Testovací praxe", result.getName());
        assertEquals("Popis", result.getDescription());
        assertEquals("NEW", result.getState());
        assertFalse(result.isClosed());
        assertFalse(result.isMarkedForExport());
        assertEquals(founder.getEmail(), result.getFounderEmail());
        assertNull(result.getStudentEmail());
        verify(practicesRepository).save(any(Practices.class));
    }

    @Test
    @DisplayName("createPractice – bez data dokončení")
    void createPractice_withNullCompletedAt() {
        User founder = makeUser(1L, Role.EXTERNAL_WORKER);
        when(userService.getCurrentUser()).thenReturn(founder);
        when(practicesRepository.save(any(Practices.class))).thenAnswer(inv -> inv.getArgument(0));

        PracticesDto result = practicesService.createPractice("Praxe bez data", "Popis", null);

        assertEquals("Praxe bez data", result.getName());
        assertNull(result.getCompletedAt());
    }

    // changePracticeState

    @Test
    @DisplayName("changePracticeState – zakladatel může dokončit praxe")
    void changePracticeState_founderCanComplete() {
        User founder = makeUser(1L, Role.EXTERNAL_WORKER);
        when(userService.getCurrentUser()).thenReturn(founder);

        Practices p = makePractice(1L, founder, PracticeState.SUBMITTED);
        when(practicesRepository.findById(1L)).thenReturn(Optional.of(p));

        PracticesDto result = practicesService.changePracticeState(1L, "COMPLETED");

        assertEquals(PracticeState.COMPLETED, p.getState());
        assertTrue(p.isClosed());
        assertEquals("COMPLETED", result.getState());
        verify(practicesRepository).save(p);
    }

    @Test
    @DisplayName("changePracticeState – zakladatel může zrušit praxe")
    void changePracticeState_founderCanCancel() {
        User founder = makeUser(1L, Role.EXTERNAL_WORKER);
        when(userService.getCurrentUser()).thenReturn(founder);

        Practices p = makePractice(1L, founder, PracticeState.ACTIVE);
        when(practicesRepository.findById(1L)).thenReturn(Optional.of(p));

        PracticesDto result = practicesService.changePracticeState(1L, "CANCELED");

        assertEquals(PracticeState.CANCELED, p.getState());
        assertTrue(p.isClosed());
        assertEquals("CANCELED", result.getState());
    }

    @Test
    @DisplayName("changePracticeState – cizí uživatel vyhodí výjimku")
    void changePracticeState_nonFounderThrowsException() {
        User founder = makeUser(1L, Role.EXTERNAL_WORKER);
        User other = makeUser(2L, Role.STUDENT);
        when(userService.getCurrentUser()).thenReturn(other);

        Practices p = makePractice(1L, founder, PracticeState.ACTIVE);
        when(practicesRepository.findById(1L)).thenReturn(Optional.of(p));

        assertThrows(RuntimeException.class, () -> practicesService.changePracticeState(1L, "COMPLETED"));
        verify(practicesRepository, never()).save(any());
    }

    @Test
    @DisplayName("changePracticeState – uzavřená praxe vyhodí výjimku")
    void changePracticeState_closedPracticeThrowsException() {
        User founder = makeUser(1L, Role.EXTERNAL_WORKER);
        when(userService.getCurrentUser()).thenReturn(founder);

        Practices p = makePractice(1L, founder, PracticeState.COMPLETED);
        p.setClosed(true);
        when(practicesRepository.findById(1L)).thenReturn(Optional.of(p));

        assertThrows(RuntimeException.class, () -> practicesService.changePracticeState(1L, "CANCELED"));
        verify(practicesRepository, never()).save(any());
    }

    @Test
    @DisplayName("changePracticeState – neplatný stav vyhodí výjimku")
    void changePracticeState_invalidStateThrowsException() {
        User founder = makeUser(1L, Role.EXTERNAL_WORKER);
        when(userService.getCurrentUser()).thenReturn(founder);

        Practices p = makePractice(1L, founder, PracticeState.ACTIVE);
        when(practicesRepository.findById(1L)).thenReturn(Optional.of(p));

        assertThrows(RuntimeException.class, () -> practicesService.changePracticeState(1L, "INVALID_STATE"));
    }

    // assignStudent
    @Test
    @DisplayName("assignStudent – student se úspěšně přiřadí do NEW praxe")
    void assignStudent_studentCanAssignToNewPractice() {
        User founder = makeUser(1L, Role.EXTERNAL_WORKER);
        User student = makeUser(2L, Role.STUDENT);
        when(userService.getCurrentUser()).thenReturn(student);

        Practices p = makePractice(1L, founder, PracticeState.NEW);
        when(practicesRepository.findById(1L)).thenReturn(Optional.of(p));

        PracticesDto result = practicesService.assignStudent(1L, true);

        assertEquals(student, p.getStudent());
        assertEquals(PracticeState.ACTIVE, p.getState());
        assertEquals("ACTIVE", result.getState());
        assertEquals(student.getEmail(), result.getStudentEmail());
        verify(practicesRepository).save(p);
    }

    @Test
    @DisplayName("assignStudent – nelze přiřadit do obsazené praxe")
    void assignStudent_cannotAssignToAlreadyTakenPractice() {
        User founder = makeUser(1L, Role.EXTERNAL_WORKER);
        User existingStudent = makeUser(2L, Role.STUDENT);
        User newStudent = makeUser(3L, Role.STUDENT);
        when(userService.getCurrentUser()).thenReturn(newStudent);

        Practices p = makePractice(1L, founder, PracticeState.ACTIVE);
        p.setStudent(existingStudent);
        when(practicesRepository.findById(1L)).thenReturn(Optional.of(p));

        assertThrows(RuntimeException.class, () -> practicesService.assignStudent(1L, true));
        verify(practicesRepository, never()).save(any());
    }

    @Test
    @DisplayName("assignStudent – student se odhlásí z ACTIVE praxe")
    void assignStudent_studentCanUnassign() {
        User founder = makeUser(1L, Role.EXTERNAL_WORKER);
        User student = makeUser(2L, Role.STUDENT);
        when(userService.getCurrentUser()).thenReturn(student);

        Practices p = makePractice(1L, founder, PracticeState.ACTIVE);
        p.setStudent(student);
        when(practicesRepository.findById(1L)).thenReturn(Optional.of(p));

        PracticesDto result = practicesService.assignStudent(1L, false);

        assertNull(p.getStudent());
        assertEquals(PracticeState.NEW, p.getState());
        assertEquals("NEW", result.getState());
        assertNull(result.getStudentEmail());
    }

    // changeStudentState

    @Test
    @DisplayName("changeStudentState – student odešle praxe s hodnocením")
    void changeStudentState_studentCanSubmitWithEvaluation() {
        User founder = makeUser(1L, Role.EXTERNAL_WORKER);
        User student = makeUser(2L, Role.STUDENT);
        when(userService.getCurrentUser()).thenReturn(student);

        Practices p = makePractice(1L, founder, PracticeState.ACTIVE);
        p.setStudent(student);
        p.setStudentEvaluation("Hodnocení studenta");
        when(practicesRepository.findById(1L)).thenReturn(Optional.of(p));

        PracticesDto result = practicesService.changeStudentState(1L, "SUBMITTED");

        assertEquals(PracticeState.SUBMITTED, p.getState());
        assertEquals("SUBMITTED", result.getState());
    }

    @Test
    @DisplayName("changeStudentState – odeslání bez hodnocení vyhodí výjimku")
    void changeStudentState_submitWithoutEvaluationThrowsException() {
        User founder = makeUser(1L, Role.EXTERNAL_WORKER);
        User student = makeUser(2L, Role.STUDENT);
        when(userService.getCurrentUser()).thenReturn(student);

        Practices p = makePractice(1L, founder, PracticeState.ACTIVE);
        p.setStudent(student);
        p.setStudentEvaluation("");
        when(practicesRepository.findById(1L)).thenReturn(Optional.of(p));

        assertThrows(RuntimeException.class, () -> practicesService.changeStudentState(1L, "SUBMITTED"));
        verify(practicesRepository, never()).save(any());
    }

    @Test
    @DisplayName("changeStudentState – student vrátí praxe z SUBMITTED do ACTIVE")
    void changeStudentState_studentCanRevertToActive() {
        User founder = makeUser(1L, Role.EXTERNAL_WORKER);
        User student = makeUser(2L, Role.STUDENT);
        when(userService.getCurrentUser()).thenReturn(student);

        Practices p = makePractice(1L, founder, PracticeState.SUBMITTED);
        p.setStudent(student);
        when(practicesRepository.findById(1L)).thenReturn(Optional.of(p));

        PracticesDto result = practicesService.changeStudentState(1L, "ACTIVE");

        assertEquals(PracticeState.ACTIVE, p.getState());
        assertEquals("ACTIVE", result.getState());
    }

    @Test
    @DisplayName("changeStudentState – cizí uživatel vyhodí výjimku")
    void changeStudentState_nonStudentThrowsException() {
        User founder = makeUser(1L, Role.EXTERNAL_WORKER);
        User student = makeUser(2L, Role.STUDENT);
        User other = makeUser(3L, Role.TEACHER);
        when(userService.getCurrentUser()).thenReturn(other);

        Practices p = makePractice(1L, founder, PracticeState.ACTIVE);
        p.setStudent(student);
        when(practicesRepository.findById(1L)).thenReturn(Optional.of(p));

        assertThrows(RuntimeException.class, () -> practicesService.changeStudentState(1L, "SUBMITTED"));
    }

    // updatePractice

    @Test
    @DisplayName("updatePractice – zakladatel může editovat název a popis v NEW")
    void updatePractice_founderCanEditNameInNewState() {
        User founder = makeUser(1L, Role.EXTERNAL_WORKER);
        when(userService.getCurrentUser()).thenReturn(founder);

        Practices p = makePractice(1L, founder, PracticeState.NEW);
        when(practicesRepository.findById(1L)).thenReturn(Optional.of(p));

        PracticesDto request = new PracticesDto();
        request.setName("Nový název");
        request.setDescription("Nový popis");

        PracticesDto result = practicesService.updatePractice(1L, request);

        assertEquals("Nový název", p.getName());
        assertEquals("Nový popis", p.getDescription());
        assertEquals("Nový název", result.getName());
        verify(practicesRepository).save(p);
    }

    @Test
    @DisplayName("updatePractice – zakladatel nastaví finální hodnocení v SUBMITTED")
    void updatePractice_founderCanSetFinalEvaluationInSubmitted() {
        User founder = makeUser(1L, Role.EXTERNAL_WORKER);
        when(userService.getCurrentUser()).thenReturn(founder);

        Practices p = makePractice(1L, founder, PracticeState.SUBMITTED);
        when(practicesRepository.findById(1L)).thenReturn(Optional.of(p));

        PracticesDto request = new PracticesDto();
        request.setFinalEvaluation("Výborný výkon studenta");

        PracticesDto result = practicesService.updatePractice(1L, request);

        assertEquals("Výborný výkon studenta", p.getFinalEvaluation());
        assertEquals("Výborný výkon studenta", result.getFinalEvaluation());
    }

    @Test
    @DisplayName("updatePractice – student edituje hodnocení v ACTIVE")
    void updatePractice_studentCanEditEvaluationInActive() {
        User founder = makeUser(1L, Role.EXTERNAL_WORKER);
        User student = makeUser(2L, Role.STUDENT);
        when(userService.getCurrentUser()).thenReturn(student);

        Practices p = makePractice(1L, founder, PracticeState.ACTIVE);
        p.setStudent(student);
        when(practicesRepository.findById(1L)).thenReturn(Optional.of(p));

        PracticesDto request = new PracticesDto();
        request.setStudentEvaluation("Naučil jsem se hodně");

        PracticesDto result = practicesService.updatePractice(1L, request);

        assertEquals("Naučil jsem se hodně", p.getStudentEvaluation());
        assertEquals("Naučil jsem se hodně", result.getStudentEvaluation());
    }

    @Test
    @DisplayName("updatePractice – student nemůže editovat v SUBMITTED")
    void updatePractice_studentCannotEditInSubmitted() {
        User founder = makeUser(1L, Role.EXTERNAL_WORKER);
        User student = makeUser(2L, Role.STUDENT);
        when(userService.getCurrentUser()).thenReturn(student);

        Practices p = makePractice(1L, founder, PracticeState.SUBMITTED);
        p.setStudent(student);
        when(practicesRepository.findById(1L)).thenReturn(Optional.of(p));

        PracticesDto request = new PracticesDto();
        request.setStudentEvaluation("Pokus o změnu");

        assertThrows(RuntimeException.class, () -> practicesService.updatePractice(1L, request));
        verify(practicesRepository, never()).save(any());
    }

    @Test
    @DisplayName("updatePractice – cizí uživatel nemůže editovat")
    void updatePractice_nonFounderNonStudentThrowsException() {
        User founder = makeUser(1L, Role.EXTERNAL_WORKER);
        User other = makeUser(3L, Role.TEACHER);
        when(userService.getCurrentUser()).thenReturn(other);

        Practices p = makePractice(1L, founder, PracticeState.ACTIVE);
        when(practicesRepository.findById(1L)).thenReturn(Optional.of(p));

        assertThrows(RuntimeException.class, () -> practicesService.updatePractice(1L, new PracticesDto()));
        verify(practicesRepository, never()).save(any());
    }

    @Test
    @DisplayName("updatePractice – admin může editovat vše včetně stavu")
    void updatePractice_adminCanEditEverything() {
        User founder = makeUser(1L, Role.EXTERNAL_WORKER);
        User admin = makeUser(99L, Role.ADMIN);
        when(userService.getCurrentUser()).thenReturn(admin);

        Practices p = makePractice(1L, founder, PracticeState.ACTIVE);
        when(practicesRepository.findById(1L)).thenReturn(Optional.of(p));

        PracticesDto request = new PracticesDto();
        request.setName("Admin název");
        request.setDescription("Admin popis");
        request.setFinalEvaluation("Admin hodnocení");
        request.setStudentEvaluation("Admin studentské hodnocení");
        request.setState("ACTIVE");

        PracticesDto result = practicesService.updatePractice(1L, request);

        assertEquals("Admin název", p.getName());
        assertEquals("Admin hodnocení", p.getFinalEvaluation());
        assertEquals("Admin název", result.getName());
        verify(practicesRepository).save(p);
    }

    @Test
    @DisplayName("updatePractice – neexistující praxe vyhodí výjimku")
    void updatePractice_practiceNotFound_throwsException() {
        when(practicesRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> practicesService.updatePractice(999L, new PracticesDto()));
        verify(practicesRepository, never()).save(any());
    }
}