package cz.osu.praxeo.controller;

import cz.osu.praxeo.dto.PracticesDto;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.http.HttpStatus;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class PracticesControllerTest {

    private final PracticesServiceFake service = new PracticesServiceFake();
    private final PracticesController controller = new PracticesController(service);

    @Test
    @Order(1)
    @DisplayName("POST /practices-by-role")
    void getPracticesByRole_ok() {
        assertEquals(HttpStatus.OK, controller.getPracticesByRole().getStatusCode());
        assertEquals(2, ((List<?>) controller.getPracticesByRole().getBody()).size());
    }

    @Test
    @Order(2)
    @DisplayName("GET /practices/5")
    void getPractice_ok() {
        assertEquals(5L, ((PracticesDto) controller.getPractice(5L).getBody()).getId());
    }

    @Test
    @Order(3)
    @DisplayName("PUT /practices/7")
    void updatePractice_ok() {
        assertEquals(7L, ((PracticesDto) controller.updatePractice(7L, new PracticesDto()).getBody()).getId());
    }

    @Test
    @Order(4)
    @DisplayName("POST /practices/create")
    void createPractice_ok() {
        assertEquals(10L, ((PracticesDto) controller.createPractice(new PracticesDto()).getBody()).getId());
    }

    @Test
    @Order(5)
    @DisplayName("PUT /practices/9/state")
    void changeState_ok() {
        assertEquals("COMPLETED", ((PracticesDto) controller.changeState(9L, "COMPLETED").getBody()).getState());
    }

    @Test
    @Order(6)
    @DisplayName("GET /practices/999 – praxe neexistuje")
    void getPractice_notFound() {
        service.setThrowExceptionForId(999L);
        assertThrows(RuntimeException.class, () -> controller.getPractice(999L));
    }

    @Test
    @Order(7)
    @DisplayName("PUT /practices/999 – praxe neexistuje")
    void updatePractice_notFound() {
        service.setThrowExceptionForId(999L);
        assertThrows(RuntimeException.class, () -> controller.updatePractice(999L, new PracticesDto()));
    }

    @Test
    @Order(8)
    @DisplayName("POST /practices/create – parametry")
    void createPractice_params() {
        PracticesDto request = new PracticesDto();
        request.setName("TestName");
        request.setDescription("TestDesc");

        PracticesDto result = (PracticesDto) controller.createPractice(request).getBody();
        assertEquals("TestName", result.getName());
        assertEquals("TestDesc", result.getDescription());
    }

    @Test
    @Order(9)
    @DisplayName("PUT /practices/1/state – CANCELED")
    void changeState_canceled() {
        PracticesDto result = (PracticesDto) controller.changeState(1L, "CANCELED").getBody();
        assertEquals("CANCELED", result.getState());
    }

    @Test
    @Order(10)
    @DisplayName("PUT /practices/1/state – neplatný stav")
    void changeState_invalid() {
        service.setThrowInvalidState();
        assertThrows(RuntimeException.class, () -> controller.changeState(1L, "INVALID"));
    }

    @Test
    @Order(11)
    @DisplayName("Všechny metody vrací HTTP 200 OK")
    void allMethodsReturnOk() {
        assertEquals(HttpStatus.OK, controller.getPracticesByRole().getStatusCode());
        assertEquals(HttpStatus.OK, controller.getPractice(1L).getStatusCode());
        assertEquals(HttpStatus.OK, controller.updatePractice(1L, new PracticesDto()).getStatusCode());
        assertEquals(HttpStatus.OK, controller.createPractice(new PracticesDto()).getStatusCode());
        assertEquals(HttpStatus.OK, controller.changeState(1L, "COMPLETED").getStatusCode());
    }
}
