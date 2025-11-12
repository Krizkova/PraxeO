package cz.osu.praxeo.controller;

import cz.osu.praxeo.dao.UserRepository;
import cz.osu.praxeo.dto.UserDto;
import cz.osu.praxeo.entity.Role;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class UserControllerTest {

    @Autowired
    private UserController userController;

    @Autowired
    private UserRepository userRepository;

    @Test
    @Order(1)
    void userRegisterTest() {
        UserDto dto = new UserDto();
        dto.setFirstName("Jana");
        dto.setLastName("Králová");
        dto.setEmail("jana.kralova@example.com");
        dto.setPassword("tajneheslo");
        dto.setRole(Role.STUDENT);
        dto.setStudentNumber("P555255");

        ResponseEntity<?> response = userController.registerStudent(dto);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody().toString().contains("jana.kralova@example.com")
                || response.getBody().toString().contains("Registrace úspěšná"));
    }

    @Test
    @Order(2)
    void userRegisterDuplicateEmail() {
        // první registrace
        UserDto first = new UserDto();
        first.setFirstName("Jana");
        first.setLastName("Králová");
        first.setEmail("jana.kralova@example.com");
        first.setPassword("tajneheslo");
        first.setRole(Role.STUDENT);
        first.setStudentNumber("P555255");
        first.setActive(true);

        ResponseEntity<?> firstResponse = userController.registerStudent(first);
        assertEquals(HttpStatus.OK, firstResponse.getStatusCode());

        // druhá registrace se stejným e-mailem
        UserDto duplicate = new UserDto();
        duplicate.setFirstName("Jana");
        duplicate.setLastName("Králová");
        duplicate.setEmail("jana.kralova@example.com"); // stejný email
        duplicate.setPassword("tajneheslo");
        duplicate.setRole(Role.STUDENT);
        duplicate.setActive(true);
        duplicate.setStudentNumber("P555256");

        ResponseEntity<?> duplicateResponse = userController.registerStudent(duplicate);

        // ✅ očekáváme 400 + text "Email už existuje"
        assertEquals(HttpStatus.BAD_REQUEST, duplicateResponse.getStatusCode());
        assertTrue(duplicateResponse.getBody().toString().toLowerCase().contains("email"));
    }

    @AfterEach
    void cleanup() {
        userRepository.deleteAll();
    }
}
