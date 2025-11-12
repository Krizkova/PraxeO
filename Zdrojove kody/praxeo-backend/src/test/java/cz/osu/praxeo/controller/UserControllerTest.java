package cz.osu.praxeo.controller;

import cz.osu.praxeo.dao.UserRepository;
import cz.osu.praxeo.dto.UserDto;
import cz.osu.praxeo.entity.Role;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

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
        dto.setJmeno("Jana");
        dto.setPrijmeni("Králová");
        dto.setEmail("jana.kralova@example.com");
        dto.setHeslo("tajneheslo");
        dto.setRole(Role.STUDENT);
        dto.setStudijniCislo("P555255");

        assertDoesNotThrow(() -> {
            var result = userController.registerStudent(dto);
            assertNotNull(result);
            assertEquals("jana.kralova@example.com", result.getEmail());
        });
    }

    @Test
    @Order(2)
    void userRegisterDuplicateEmail() {
        UserDto first = new UserDto();
        first.setJmeno("Jana");
        first.setPrijmeni("Králová");
        first.setEmail("jana.kralova@example.com");
        first.setHeslo("tajneheslo");
        first.setRole(Role.STUDENT);
        first.setStudijniCislo("P555255");
        userController.registerStudent(first);

        UserDto duplicate = new UserDto();
        duplicate.setJmeno("Jana");
        duplicate.setPrijmeni("Králová");
        duplicate.setEmail("jana.kralova@example.com"); // stejný email
        duplicate.setHeslo("tajneheslo");
        duplicate.setRole(Role.STUDENT);
        duplicate.setStudijniCislo("P555256");

        Exception ex = assertThrows(Exception.class, () -> userController.registerStudent(duplicate));
        assertTrue(ex.getMessage().toLowerCase().contains("unique") || ex.getMessage().toLowerCase().contains("email"));
    }

    @AfterEach
    void cleanup() {
        userRepository.deleteAll();
    }
}
