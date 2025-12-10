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
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.mail.javamail.JavaMailSender;
import static org.junit.jupiter.api.Assertions.*;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@Transactional
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@ActiveProfiles("test")
class UserControllerTest {

    @MockBean
    private JavaMailSender javaMailSender;

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
        dto.setEmail("praxeo1@osu.cz");
        dto.setStudentNumber("P555255");

        ResponseEntity<?> response = userController.registerUser(dto);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody().toString().contains("praxeo1@osu.cz")
                || response.getBody().toString().contains("Registrace úspěšná"));
    }

    @Test
    @Order(2)
    void userRegisterDuplicateEmail() {
        // první registrace
        UserDto first = new UserDto();
        first.setFirstName("Jana");
        first.setLastName("Králová");
        first.setEmail("praxeo1@osu.cz");
        first.setStudentNumber("P555255");
        first.setActive(true);

        ResponseEntity<?> firstResponse = userController.registerUser(first);
        assertEquals(HttpStatus.OK, firstResponse.getStatusCode());

        // druhá registrace se stejným e-mailem
        UserDto duplicate = new UserDto();
        duplicate.setFirstName("Jana");
        duplicate.setLastName("Králová");
        duplicate.setEmail("praxeo1@osu.cz"); // stejný email
        duplicate.setActive(true);
        duplicate.setStudentNumber("P555256");

        ResponseEntity<?> duplicateResponse = userController.registerUser(duplicate);

        // ✅ očekáváme 400 + text "Email už existuje"
        assertEquals(HttpStatus.CONFLICT, duplicateResponse.getStatusCode());
        assertTrue(duplicateResponse.getBody().toString().toLowerCase().contains("email"));
    }

    @Test
    @Order(3)
    void userRegisterEmptyEmail() {
        UserDto dto = new UserDto();
        dto.setFirstName("Jana");
        dto.setLastName("Králová");
        dto.setEmail("");
        dto.setStudentNumber("P555257");

        ResponseEntity<?> response = userController.registerUser(dto);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertTrue(response.getBody().toString().toLowerCase().contains("email"));
    }

    @AfterEach
    void cleanup() {
        userRepository.deleteAll();
    }
}
