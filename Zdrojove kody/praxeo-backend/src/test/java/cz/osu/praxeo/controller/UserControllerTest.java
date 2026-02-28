package cz.osu.praxeo.controller;

import cz.osu.praxeo.dao.UserRepository;
import cz.osu.praxeo.dao.VerificationTokenRepository;
import cz.osu.praxeo.dto.UserDto;
import cz.osu.praxeo.entity.Purpose;
import cz.osu.praxeo.entity.Role;
import cz.osu.praxeo.entity.User;
import cz.osu.praxeo.entity.VerificationToken;
import jakarta.transaction.Transactional;
import org.hibernate.exception.ConstraintViolationException;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

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

    @Autowired
    private VerificationTokenRepository tokenRepository;


    @Test
    @Order(1)
    void userRegister_success() {
        UserDto dto = new UserDto();
        dto.setFirstName("Jana");
        dto.setLastName("Králová");
        dto.setEmail("praxeo1@osu.cz");
        dto.setStudentNumber("P555255");

        ResponseEntity<?> response = userController.registerUser(dto);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody() instanceof Map);

        @SuppressWarnings("unchecked")
        Map<String, Object> body = (Map<String, Object>) response.getBody();
        assertEquals("praxeo1@osu.cz", body.get("email"));
        assertEquals("Registrace úspěšná.", body.get("message"));
    }

    @Test
    @Order(2)
    void userRegister_duplicateEmail() {
        UserDto first = new UserDto();
        first.setFirstName("Jana");
        first.setLastName("Králová");
        first.setEmail("praxeo1@osu.cz");
        first.setStudentNumber("P555255");

        ResponseEntity<?> firstResponse = userController.registerUser(first);
        assertEquals(HttpStatus.OK, firstResponse.getStatusCode());

        UserDto duplicate = new UserDto();
        duplicate.setFirstName("Jana");
        duplicate.setLastName("Králová");
        duplicate.setEmail("praxeo1@osu.cz");
        duplicate.setStudentNumber("P555256");

        ResponseStatusException ex = assertThrows(
                ResponseStatusException.class,
                () -> userController.registerUser(duplicate)
        );

        assertEquals(HttpStatus.CONFLICT, ex.getStatusCode());
        assertTrue(ex.getReason().toLowerCase().contains("email"));
    }

    @Test
    @Order(3)
    void userRegister_emptyEmail() {
        UserDto dto = new UserDto();
        dto.setFirstName("Jana");
        dto.setLastName("Králová");
        dto.setEmail("");
        dto.setStudentNumber("P555257");

        ResponseStatusException ex = assertThrows(
                ResponseStatusException.class,
                () -> userController.registerUser(dto)
        );

        assertEquals(HttpStatus.CONFLICT, ex.getStatusCode());
        assertTrue(ex.getReason().toLowerCase().contains("osu"));
    }

    @Test
    @Order(4)
    void userRegister_invalidDomain() {
        UserDto dto = new UserDto();
        dto.setFirstName("Jana");
        dto.setLastName("Králová");
        dto.setEmail("praxeo1@gmail.com");
        dto.setStudentNumber("P555258");

        ResponseStatusException ex = assertThrows(
                ResponseStatusException.class,
                () -> userController.registerUser(dto)
        );

        assertEquals(HttpStatus.CONFLICT, ex.getStatusCode());
        assertTrue(ex.getReason().toLowerCase().contains("osu.cz"));
    }


    @Test
    @Order(5)
    @DisplayName("complete-registration - valid token")
    void completeRegistration_success() {
        // 1) registrace čekajícího uživatele
        UserDto pendingUser = new UserDto();
        pendingUser.setFirstName("Jana");
        pendingUser.setLastName("Králová");
        pendingUser.setEmail("pending@osu.cz");
        pendingUser.setStudentNumber("P555270");

        userController.registerUser(pendingUser);

        User userEntity = userRepository.findByEmail("pending@osu.cz").orElseThrow();
        VerificationToken vt = tokenRepository.findByUser(userEntity)
                .orElseThrow(() -> new IllegalStateException("Verification token pro uživatele nebyl nalezen"));

        // 2) dokončení registrace
        Map<String, String> data = new HashMap<>();
        data.put("token", vt.getToken());
        data.put("password", "NewStrongPass1");
        data.put("firstName", "Jana");
        data.put("lastName", "Králová");
        data.put("studentNumber", "P555270");

        ResponseEntity<?> response = userController.completeRegistration(data);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody() instanceof Map);

        @SuppressWarnings("unchecked")
        Map<String, Object> body = (Map<String, Object>) response.getBody();
        assertEquals(true, body.get("success"));

        Optional<User> activatedUser = userRepository.findByEmail("pending@osu.cz");
        assertTrue(activatedUser.isPresent());
        assertTrue(activatedUser.get().isActive());
    }

    @Test
    @Order(6)
    @DisplayName("complete-registration - invalid/expired token")
    void completeRegistration_invalidToken() {
        Map<String, String> data = new HashMap<>();
        data.put("token", "expired-invalid-token");
        data.put("password", "SomePass123");

        ResponseEntity<?> response = userController.completeRegistration(data);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody() instanceof Map);

        @SuppressWarnings("unchecked")
        Map<String, Object> body = (Map<String, Object>) response.getBody();
        assertEquals(false, body.get("success"));
        assertEquals("Neplatný nebo expirovaný token", body.get("message"));
    }


    @Test
    @Order(7)
    @DisplayName("forgot-password - existing email")
    void forgotPassword_existingEmail() {
        User user = new User();
        user.setFirstName("Jana");
        user.setLastName("Kralova");
        user.setEmail("praxeo1@osu.cz");
        user.setRole(Role.STUDENT);
        user.setActive(true);
        userRepository.save(user);

        Map<String, String> data = new HashMap<>();
        data.put("email", "praxeo1@osu.cz");

        ResponseEntity<?> response = userController.forgotPassword(data);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        String body = response.getBody().toString().toLowerCase();
        assertTrue(body.contains("success") && body.contains("true"));
    }

    @Test
    @Order(8)
    @DisplayName("forgot-password - non-existing email")
    void forgotPassword_nonExistingEmail() {
        Map<String, String> data = new HashMap<>();
        data.put("email", "neexistuje@osu.cz");

        ResponseStatusException ex = assertThrows(
                ResponseStatusException.class,
                () -> userController.forgotPassword(data)
        );

        assertEquals(HttpStatus.BAD_REQUEST, ex.getStatusCode());
        assertTrue(ex.getReason().toLowerCase().contains("neexistuje"));
    }

    @Test
    @Order(9)
    @DisplayName("reset-password - success")
    void resetPassword_success() {
        User user = new User();
        user.setFirstName("Jana");
        user.setLastName("Kralova");
        user.setEmail("reset@osu.cz");
        user.setRole(Role.STUDENT);
        user.setActive(true);
        userRepository.save(user);

        VerificationToken vt = new VerificationToken();
        vt.setToken("valid-reset-token");
        vt.setUser(user);
        vt.setExpiryDate(LocalDateTime.now().plusHours(1));
        vt.setPurpose(Purpose.RESET_PASSWORD);
        tokenRepository.save(vt);

        Map<String, String> data = new HashMap<>();
        data.put("token", "valid-reset-token");
        data.put("password", "NewStrongPass1");

        ResponseEntity<?> response = userController.resetPassword(data);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        String body = response.getBody().toString().toLowerCase();
        assertTrue(body.contains("success") && body.contains("true"));
    }

    @Test
    @Order(10)
    @DisplayName("reset-password - wrong purpose")
    void resetPassword_wrongPurpose() {
        User user = new User();
        user.setFirstName("Jana");
        user.setLastName("Kralova");
        user.setEmail("wrongpurpose@osu.cz");
        user.setRole(Role.STUDENT);
        user.setActive(true);
        userRepository.save(user);

        VerificationToken vt = new VerificationToken();
        vt.setToken("wrong-purpose-token");
        vt.setUser(user);
        vt.setExpiryDate(LocalDateTime.now().plusHours(1));
        vt.setPurpose(Purpose.REGISTER);
        tokenRepository.save(vt);

        Map<String, String> data = new HashMap<>();
        data.put("token", "wrong-purpose-token");
        data.put("password", "NewStrongPass1");

        ResponseEntity<?> response = userController.resetPassword(data);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertNotNull(response.getBody());
        String body = response.getBody().toString().toLowerCase();
        assertTrue(body.contains("token") || body.contains("není určen pro obnovu hesla"));
    }

    @Test
    @Order(11)
    @DisplayName("reset-password - expired token")
    void resetPassword_expiredToken() {
        User user = new User();
        user.setFirstName("Jana");
        user.setLastName("Kralova");
        user.setEmail("expired@osu.cz");
        user.setRole(Role.STUDENT);
        user.setActive(true);
        userRepository.save(user);

        VerificationToken vt = new VerificationToken();
        vt.setToken("expired-token");
        vt.setUser(user);
        vt.setExpiryDate(LocalDateTime.now().minusHours(1));
        vt.setPurpose(Purpose.RESET_PASSWORD);
        tokenRepository.save(vt);

        Map<String, String> data = new HashMap<>();
        data.put("token", "expired-token");
        data.put("password", "NewStrongPass1");

        ResponseEntity<?> response = userController.resetPassword(data);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertNotNull(response.getBody());
        String body = response.getBody().toString().toLowerCase();
        assertTrue(body.contains("expiroval") || body.contains("success=false"));
    }


    @Test
    @Order(12)
    @DisplayName("role-by-token - valid")
    void roleByToken_valid() {
        User user = new User();
        user.setFirstName("Jana");
        user.setLastName("Kralova");
        user.setEmail("role@osu.cz");
        user.setRole(Role.STUDENT);
        user.setActive(true);
        userRepository.save(user);

        VerificationToken vt = new VerificationToken();
        vt.setToken("valid-token");
        vt.setUser(user);
        vt.setExpiryDate(LocalDateTime.now().plusHours(1));
        vt.setPurpose(Purpose.REGISTER);
        tokenRepository.save(vt);

        ResponseEntity<?> response = userController.getRoleByToken("valid-token");

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody() instanceof Map);

        @SuppressWarnings("unchecked")
        Map<String, String> body = (Map<String, String>) response.getBody();
        assertEquals("STUDENT", body.get("role"));
    }

    @Test
    @Order(13)
    @DisplayName("role-by-token - invalid")
    void roleByToken_invalid() {
        ResponseEntity<?> response = userController.getRoleByToken("invalid-token");

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Invalid token", response.getBody());
    }

    @AfterEach
    void cleanup() {
        tokenRepository.deleteAll();
        userRepository.deleteAll();
    }
}
