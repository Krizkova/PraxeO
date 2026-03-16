package cz.osu.praxeo.controller;

import cz.osu.praxeo.dao.UserRepository;
import cz.osu.praxeo.dao.VerificationTokenRepository;
import cz.osu.praxeo.dto.UserDto;
import cz.osu.praxeo.entity.Purpose;
import cz.osu.praxeo.entity.Role;
import cz.osu.praxeo.entity.User;
import cz.osu.praxeo.entity.VerificationToken;
import jakarta.transaction.Transactional;
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
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@ActiveProfiles("test")
@DisplayName("UserControllerTest")
class UserControllerTest {

    @MockBean
    private JavaMailSender javaMailSender;

    @Autowired
    private UserController userController;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VerificationTokenRepository tokenRepository;

    private User saveActiveUser(String email, Role role) {
        User user = new User();
        user.setFirstName("Jana");
        user.setLastName("Králová");
        user.setEmail(email);
        user.setRole(role);
        user.setActive(true);
        return userRepository.save(user);
    }

    private VerificationToken saveToken(User user, String token,
                                        Purpose purpose, boolean expired) {
        VerificationToken vt = new VerificationToken();
        vt.setToken(token);
        vt.setUser(user);
        vt.setPurpose(purpose);
        vt.setExpiryDate(expired
                ? LocalDateTime.now().minusHours(1)
                : LocalDateTime.now().plusHours(24)
        );
        return tokenRepository.save(vt);
    }

    // registerUser

    @DisplayName("registerUser – platný student")
    @Test
    @Order(1)
    void registerUser_validStudent_returnsOk() {
        UserDto dto = new UserDto();
        dto.setEmail("praxeo1@osu.cz");
        dto.setRole(Role.STUDENT);

        ResponseEntity<?> response = userController.registerUser(dto);

        assertEquals(HttpStatus.OK, response.getStatusCode());

        @SuppressWarnings("unchecked")
        Map<String, Object> body = (Map<String, Object>) response.getBody();
        assertEquals("praxeo1@osu.cz", body.get("email"));
        assertEquals("Registrace úspěšná.", body.get("message"));
    }

    @DisplayName("registerUser – duplicitní email")
    @Test
    @Order(2)
    void registerUser_duplicateEmail_throwsConflict() {
        UserDto first = new UserDto();
        first.setEmail("praxeo1@osu.cz");
        first.setRole(Role.STUDENT);
        userController.registerUser(first);

        UserDto duplicate = new UserDto();
        duplicate.setEmail("praxeo1@osu.cz");
        duplicate.setRole(Role.STUDENT);

        ResponseStatusException ex = assertThrows(
                ResponseStatusException.class,
                () -> userController.registerUser(duplicate)
        );

        assertEquals(HttpStatus.CONFLICT, ex.getStatusCode());
        assertTrue(ex.getReason().toLowerCase().contains("email"));
    }

    @DisplayName("registerUser – gmail student")
    @Test
    @Order(3)
    void registerUser_nonUniversityDomain_throwsConflict() {
        UserDto dto = new UserDto();
        dto.setEmail("student@gmail.com");
        dto.setRole(Role.STUDENT);

        ResponseStatusException ex = assertThrows(
                ResponseStatusException.class,
                () -> userController.registerUser(dto)
        );

        assertEquals(HttpStatus.CONFLICT, ex.getStatusCode());
        assertTrue(ex.getReason().toLowerCase().contains("osu.cz"));
    }

    @DisplayName("registerUser – externí firma.cz")
    @Test
    @Order(4)
    void registerUser_externalWorkerWithAnyEmail_succeeds() {
        UserDto dto = new UserDto();
        dto.setEmail("worker@firma.cz");
        dto.setRole(Role.EXTERNAL_WORKER);

        ResponseEntity<?> response = userController.registerUser(dto);

        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    // completeRegistration

    @DisplayName("completeRegistration – platný token")
    @Test
    @Order(5)
    void completeRegistration_validToken_activatesUser() {
        UserDto dto = new UserDto();
        dto.setEmail("pending@osu.cz");
        dto.setRole(Role.STUDENT);
        userController.registerUser(dto);

        User userEntity = userRepository.findByEmail("pending@osu.cz").orElseThrow();
        VerificationToken vt = tokenRepository.findByUser(userEntity)
                .orElseThrow(() -> new IllegalStateException("Token nebyl nalezen"));

        Map<String, String> data = new HashMap<>();
        data.put("token", vt.getToken());
        data.put("password", "NewStrongPass1");
        data.put("firstName", "Jana");
        data.put("lastName", "Králová");
        data.put("studentNumber", "P555270");

        ResponseEntity<?> response = userController.completeRegistration(data);

        assertEquals(HttpStatus.OK, response.getStatusCode());

        @SuppressWarnings("unchecked")
        Map<String, Object> body = (Map<String, Object>) response.getBody();
        assertEquals(true, body.get("success"));

        assertTrue(userRepository.findByEmail("pending@osu.cz")
                .orElseThrow().isActive());
    }

    @DisplayName("completeRegistration – neplatný token")
    @Test
    @Order(6)
    void completeRegistration_invalidToken_returnsFailure() {
        Map<String, String> data = new HashMap<>();
        data.put("token", "neplatny-token-123");
        data.put("password", "SomePass123");

        ResponseEntity<?> response = userController.completeRegistration(data);

        assertEquals(HttpStatus.OK, response.getStatusCode());

        @SuppressWarnings("unchecked")
        Map<String, Object> body = (Map<String, Object>) response.getBody();
        assertEquals(false, body.get("success"));
        assertEquals("Neplatný nebo expirovaný token", body.get("message"));
    }

    // forgotPassword

    @DisplayName("forgotPassword – aktivní uživatel")
    @Test
    @Order(7)
    void forgotPassword_activeUser_sendsEmail() {
        saveActiveUser("praxeo1@osu.cz", Role.STUDENT);

        Map<String, String> data = new HashMap<>();
        data.put("email", "praxeo1@osu.cz");

        ResponseEntity<?> response = userController.forgotPassword(data);

        assertEquals(HttpStatus.OK, response.getStatusCode());

        @SuppressWarnings("unchecked")
        Map<String, Object> body = (Map<String, Object>) response.getBody();
        assertEquals(true, body.get("success"));
    }

    @DisplayName("forgotPassword – neexistující email")
    @Test
    @Order(8)
    void forgotPassword_nonExistingEmail_throwsBadRequest() {
        Map<String, String> data = new HashMap<>();
        data.put("email", "nikdo@osu.cz");

        ResponseStatusException ex = assertThrows(
                ResponseStatusException.class,
                () -> userController.forgotPassword(data)
        );

        assertEquals(HttpStatus.BAD_REQUEST, ex.getStatusCode());
    }

    @DisplayName("forgotPassword – neaktivní uživatel")
    @Test
    @Order(9)
    void forgotPassword_inactiveUser_throwsBadRequest() {
        User inactive = new User();
        inactive.setEmail("inactive@osu.cz");
        inactive.setRole(Role.STUDENT);
        inactive.setActive(false);
        userRepository.save(inactive);

        Map<String, String> data = new HashMap<>();
        data.put("email", "inactive@osu.cz");

        ResponseStatusException ex = assertThrows(
                ResponseStatusException.class,
                () -> userController.forgotPassword(data)
        );

        assertEquals(HttpStatus.BAD_REQUEST, ex.getStatusCode());
    }

    // resetPassword

    @DisplayName("resetPassword – platný token")
    @Test
    @Order(10)
    void resetPassword_validToken_changesPassword() {
        User user = saveActiveUser("reset@osu.cz", Role.STUDENT);
        saveToken(user, "valid-reset-token", Purpose.RESET_PASSWORD, false);

        Map<String, String> data = new HashMap<>();
        data.put("token", "valid-reset-token");
        data.put("password", "NewStrongPass1");

        ResponseEntity<?> response = userController.resetPassword(data);

        assertEquals(HttpStatus.OK, response.getStatusCode());

        @SuppressWarnings("unchecked")
        Map<String, Object> body = (Map<String, Object>) response.getBody();
        assertEquals(true, body.get("success"));
    }

    @DisplayName("resetPassword – expirovaný token")
    @Test
    @Order(11)
    void resetPassword_expiredToken_returnsBadRequest() {
        User user = saveActiveUser("expired@osu.cz", Role.STUDENT);
        saveToken(user, "expired-reset-token", Purpose.RESET_PASSWORD, true);

        Map<String, String> data = new HashMap<>();
        data.put("token", "expired-reset-token");
        data.put("password", "NewStrongPass1");

        ResponseEntity<?> response = userController.resetPassword(data);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());

        @SuppressWarnings("unchecked")
        Map<String, Object> body = (Map<String, Object>) response.getBody();
        assertEquals(false, body.get("success"));
    }

    @DisplayName("resetPassword – token pro registraci")
    @Test
    @Order(12)
    void resetPassword_wrongPurposeToken_returnsBadRequest() {
        User user = saveActiveUser("wrongpurpose@osu.cz", Role.STUDENT);
        saveToken(user, "register-token", Purpose.REGISTER, false);

        Map<String, String> data = new HashMap<>();
        data.put("token", "register-token");
        data.put("password", "NewStrongPass1");

        ResponseEntity<?> response = userController.resetPassword(data);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());

        @SuppressWarnings("unchecked")
        Map<String, Object> body = (Map<String, Object>) response.getBody();
        assertEquals(false, body.get("success"));
    }

    // getRoleByToken

    @DisplayName("getRoleByToken – platný token")
    @Test
    @Order(13)
    void getRoleByToken_validToken_returnsRole() {
        User user = saveActiveUser("role@osu.cz", Role.STUDENT);
        saveToken(user, "valid-role-token", Purpose.REGISTER, false);

        ResponseEntity<?> response = userController.getRoleByToken("valid-role-token");

        assertEquals(HttpStatus.OK, response.getStatusCode());

        @SuppressWarnings("unchecked")
        Map<String, String> body = (Map<String, String>) response.getBody();
        assertEquals("STUDENT", body.get("role"));
    }

    @DisplayName("getRoleByToken – neplatný token")
    @Test
    @Order(14)
    void getRoleByToken_invalidToken_returnsBadRequest() {
        ResponseEntity<?> response = userController.getRoleByToken("neplatny-token");

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Invalid token", response.getBody());
    }

    @DisplayName("getAllUsers – vrátí seznam uživatelů")
    @Test
    @Order(15)
    void getAllUsers_returnsListOfUsers() {
        saveActiveUser("user1@osu.cz", Role.STUDENT);
        saveActiveUser("user2@osu.cz", Role.TEACHER);

        List<UserDto> result = userController.getAllUsers();

        assertTrue(result.size() >= 2);
        assertTrue(result.stream().anyMatch(u -> u.getEmail().equals("user1@osu.cz")));
        assertTrue(result.stream().anyMatch(u -> u.getEmail().equals("user2@osu.cz")));
        result.forEach(u -> assertNull(u.getPassword()));
    }


    @AfterEach
    void cleanup() {
        tokenRepository.deleteAll();
        userRepository.deleteAll();
    }
}
