package cz.osu.praxeo.controller;

import cz.osu.praxeo.dto.PracticesDto;
import cz.osu.praxeo.service.PracticesService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("PracticesControllerTest")
class PracticesControllerTest {

    @Mock
    private PracticesService practicesService;

    @InjectMocks
    private PracticesController practicesController;

    private PracticesDto makeDto(Long id, String name) {
        PracticesDto dto = new PracticesDto();
        dto.setId(id);
        dto.setName(name);
        return dto;
    }

    // getPracticesByRole

    @DisplayName("getPracticesByRole – seznam praxí")
    @Test
    void getPracticesByRole_returnsList() {
        List<PracticesDto> list = List.of(makeDto(1L, "Praxe A"), makeDto(2L, "Praxe B"));
        when(practicesService.getPracticesByRole()).thenReturn(list);

        ResponseEntity<?> response = practicesController.getPracticesByRole();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(list, response.getBody());
        verify(practicesService).getPracticesByRole();
    }

    @DisplayName("getPracticesByRole – prázdný seznam")
    @Test
    void getPracticesByRole_emptyList_returnsOk() {
        when(practicesService.getPracticesByRole()).thenReturn(List.of());

        ResponseEntity<?> response = practicesController.getPracticesByRole();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(List.of(), response.getBody());
    }

    // getPractice

    @DisplayName("getPractice – existující praxe")
    @Test
    void getPractice_existingId_returnsDto() {
        PracticesDto dto = makeDto(1L, "Praxe A");
        when(practicesService.getPracticeById(1L)).thenReturn(dto);

        ResponseEntity<?> response = practicesController.getPractice(1L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(dto, response.getBody());
        verify(practicesService).getPracticeById(1L);
    }

    @DisplayName("getPractice – neexistující praxe")
    @Test
    void getPractice_serviceThrowsException_propagatesException() {
        when(practicesService.getPracticeById(999L))
                .thenThrow(new RuntimeException("Praxe neexistuje"));

        assertThrows(RuntimeException.class,
                () -> practicesController.getPractice(999L));
    }

    //updatePractice

    @DisplayName("updatePractice – platná aktualizace")
    @Test
    void updatePractice_validRequest_returnsUpdatedDto() {
        PracticesDto request = makeDto(1L, "Nový název");
        PracticesDto updated = makeDto(1L, "Nový název");
        when(practicesService.updatePractice(1L, request)).thenReturn(updated);

        ResponseEntity<?> response = practicesController.updatePractice(1L, request);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(updated, response.getBody());
        verify(practicesService).updatePractice(1L, request);
    }

    // createPractice

    @DisplayName("createPractice – platné údaje")
    @Test
    void createPractice_validRequest_returnsCreatedDto() {
        PracticesDto request = new PracticesDto();
        request.setName("Nová praxe");
        request.setDescription("Popis praxe");
        request.setCompletedAt(LocalDate.of(2025, 6, 30));

        PracticesDto created = makeDto(1L, "Nová praxe");
        when(practicesService.createPractice(
                "Nová praxe", "Popis praxe", LocalDate.of(2025, 6, 30)
        )).thenReturn(created);

        ResponseEntity<?> response = practicesController.createPractice(request);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(created, response.getBody());
        verify(practicesService).createPractice(
                "Nová praxe", "Popis praxe", LocalDate.of(2025, 6, 30)
        );
    }

    @DisplayName("createPractice – null datum dokončení")
    @Test
    void createPractice_withNullCompletedAt_callsServiceCorrectly() {
        PracticesDto request = new PracticesDto();
        request.setName("Praxe bez data");
        request.setDescription("Popis");
        request.setCompletedAt(null);

        PracticesDto created = makeDto(1L, "Praxe bez data");
        when(practicesService.createPractice("Praxe bez data", "Popis", null))
                .thenReturn(created);

        ResponseEntity<?> response = practicesController.createPractice(request);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(practicesService).createPractice("Praxe bez data", "Popis", null);
    }

    // changeState

    @DisplayName("changeState – COMPLETED")
    @Test
    void changeState_validState_returnsUpdatedDto() {
        PracticesDto dto = makeDto(1L, "Praxe A");
        when(practicesService.changePracticeState(1L, "COMPLETED")).thenReturn(dto);

        ResponseEntity<?> response = practicesController.changeState(1L, "COMPLETED");

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(dto, response.getBody());
        verify(practicesService).changePracticeState(1L, "COMPLETED");
    }

    @DisplayName("changeState – neplatný stav")
    @Test
    void changeState_invalidState_propagatesException() {
        when(practicesService.changePracticeState(1L, "NEPLATNY_STAV"))
                .thenThrow(new RuntimeException("Neplatný stav"));

        assertThrows(RuntimeException.class,
                () -> practicesController.changeState(1L, "NEPLATNY_STAV"));
    }

    // assignStudent

    @DisplayName("assignStudent – přiřadit studenta")
    @Test
    void assignStudent_assign_returnsUpdatedDto() {
        PracticesDto dto = makeDto(1L, "Praxe A");
        when(practicesService.assignStudent(1L, true)).thenReturn(dto);

        ResponseEntity<?> response = practicesController.assignStudent(1L, true);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(dto, response.getBody());
        verify(practicesService).assignStudent(1L, true);
    }

    @DisplayName("assignStudent – odstrařit studenta")
    @Test
    void assignStudent_unassign_returnsUpdatedDto() {
        PracticesDto dto = makeDto(1L, "Praxe A");
        when(practicesService.assignStudent(1L, false)).thenReturn(dto);

        ResponseEntity<?> response = practicesController.assignStudent(1L, false);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(practicesService).assignStudent(1L, false);
    }

    // changeStudentState

    @DisplayName("changeStudentState – SUBMITTED")
    @Test
    void changeStudentState_validState_returnsUpdatedDto() {
        PracticesDto dto = makeDto(1L, "Praxe A");
        when(practicesService.changeStudentState(1L, "SUBMITTED")).thenReturn(dto);

        ResponseEntity<?> response = practicesController.changeStudentState(1L, "SUBMITTED");

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(dto, response.getBody());
        verify(practicesService).changeStudentState(1L, "SUBMITTED");
    }

    @DisplayName("changeStudentState – vrátit na ACTIVE")
    @Test
    void changeStudentState_revertToActive_returnsUpdatedDto() {
        PracticesDto dto = makeDto(1L, "Praxe A");
        when(practicesService.changeStudentState(1L, "ACTIVE")).thenReturn(dto);

        ResponseEntity<?> response = practicesController.changeStudentState(1L, "ACTIVE");

        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(practicesService).changeStudentState(1L, "ACTIVE");
    }

    @DisplayName("changeStudentState – neplatná změna")
    @Test
    void changeStudentState_serviceThrowsException_propagatesException() {
        when(practicesService.changeStudentState(1L, "NEPLATNY"))
                .thenThrow(new RuntimeException("Neplatná změna stavu"));

        assertThrows(RuntimeException.class,
                () -> practicesController.changeStudentState(1L, "NEPLATNY"));
    }
}
