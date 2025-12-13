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

    // REGISTRACE UŽIVATELE (/api/users/register-user)

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

    @Test
    @Order(4)
    void userRegisterInvalidDomain() {
        UserDto dto = new UserDto();
        dto.setFirstName("Jana");
        dto.setLastName("Králová");
        dto.setEmail("praxeo1@gmail.com"); //spatné domen
        dto.setStudentNumber("P555258");

        ResponseEntity<?> response = userController.registerUser(dto);

        assertEquals(HttpStatus.CONFLICT, response.getStatusCode());
        assertTrue(response.getBody().toString().toLowerCase().contains("osu.cz"));
    }

    @Test
    @Order(5)
    @DisplayName("POST /api/users/register-user - prázdné jméno")
    void userRegisterEmptyFirstName() {
        UserDto dto = new UserDto();
        dto.setFirstName("");
        dto.setLastName("Kralova");
        dto.setEmail("fname@osu.cz");
        dto.setStudentNumber("P555260");

        ResponseEntity<?> response = userController.registerUser(dto);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        String body = response.getBody().toString().toLowerCase();
        assertTrue(body.contains("first name") || body.contains("jméno"));
    }

    @Test
    @Order(6)
    @DisplayName("POST /api/users/register-user - prázdné příjmení")
    void userRegisterEmptyLastName() {
        UserDto dto = new UserDto();
        dto.setFirstName("Jana");
        dto.setLastName("");
        dto.setEmail("lname@osu.cz");
        dto.setStudentNumber("P555261");

        ResponseEntity<?> response = userController.registerUser(dto);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        String body = response.getBody().toString().toLowerCase();
        assertTrue(body.contains("last name") || body.contains("příjmení"));
    }

    @Test
    @Order(7)
    @DisplayName("POST /api/users/register-user - prázdné studijní číslo")
    void userRegisterEmptyStudentNumber() {
        UserDto dto = new UserDto();
        dto.setFirstName("Jana");
        dto.setLastName("Králová");
        dto.setEmail("praxeo2@osu.cz");
        dto.setStudentNumber(""); // prázdné

        ResponseEntity<?> response = userController.registerUser(dto);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        String body = response.getBody().toString().toLowerCase();
        assertTrue(body.contains("studijní") || body.contains("student number"));
    }

    @Test
    @Order(8)
    @DisplayName("POST /api/users/register-user - úspěšná registrace učitele")
    void teacherRegisterSuccess() {
        UserDto dto = new UserDto();
        dto.setFirstName("Petr");
        dto.setLastName("Ucitel");
        dto.setEmail("ucitel1@osu.cz");
        dto.setStudentNumber("T000001");
        dto.setRole(Role.TEACHER);

        ResponseEntity<?> response = userController.registerUser(dto);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody().toString().contains("ucitel1@osu.cz"));
    }

    @Test
    @Order(9)
    @DisplayName("POST /api/users/register-user - úspěšná registrace externisty")
    void externalWorkerRegisterSuccess() {
        UserDto dto = new UserDto();
        dto.setFirstName("Karel");
        dto.setLastName("Externista");
        dto.setEmail("externista@osu.cz");
        dto.setRole(Role.EXTERNAL_WORKER);
        dto.setCompanyName("Firma s.r.o.");
        dto.setStudentNumber(null);

        ResponseEntity<?> response = userController.registerUser(dto);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        String body = response.getBody().toString();
        assertTrue(body.contains("externista@osu.cz"));
    }

    @Test
    @Order(10)
    @DisplayName("POST /api/users/register-user - externista bez názvu firmy")
    void externalWorkerWithoutCompanyName() {
        UserDto dto = new UserDto();
        dto.setFirstName("Karel");
        dto.setLastName("Externista");
        dto.setEmail("externista2@osu.cz");
        dto.setRole(Role.EXTERNAL_WORKER);
        dto.setCompanyName("");
        dto.setStudentNumber(null);

        ResponseEntity<?> response = userController.registerUser(dto);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        String body = response.getBody().toString().toLowerCase();
        assertTrue(body.contains("firma") || body.contains("název firmy"));
    }

    // COMPLETE REGISTRATION (/api/users/complete-registration)

    @Test
    @Order(11)
    @DisplayName("POST /api/users/complete-registration - úspěšné dokončení s platným tokenem")
    void completeRegistrationSuccess() {
        UserDto pendingUser = new UserDto();
        pendingUser.setFirstName("Jana");
        pendingUser.setLastName("Králová");
        pendingUser.setEmail("pending@osu.cz");
        pendingUser.setStudentNumber("P555270");
        pendingUser.setActive(false);

        userController.registerUser(pendingUser);

        User userEntity = userRepository.findByEmail("pending@osu.cz").orElseThrow();

        VerificationToken vt = tokenRepository.findByUser(userEntity)
                .orElseThrow(() -> new IllegalStateException("Verification token pro uživatele nebyl nalezen"));

        Map<String, String> data = new HashMap<>();
        data.put("token", vt.getToken());
        data.put("password", "NewStrongPass1");
        data.put("firstName", "Jana");
        data.put("lastName", "Králová");
        data.put("studentNumber", "P555270");

        ResponseEntity<?> response = userController.completeRegistration(data);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        String body = response.getBody().toString().toLowerCase();
        assertTrue(body.contains("success") && body.contains("true"));

        Optional<User> activatedUser = userRepository.findByEmail("pending@osu.cz");
        assertTrue(activatedUser.isPresent());
        assertTrue(activatedUser.get().isActive());
    }

    @Test
    @Order(12)
    @DisplayName("POST /api/users/complete-registration - neplatný / expirovaný token")
    void completeRegistrationInvalidToken() {
        Map<String, String> data = new HashMap<>();
        data.put("token", "expired-invalid-token");
        data.put("password", "SomePass123");

        ResponseEntity<?> response = userController.completeRegistration(data);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        String body = response.getBody().toString().toLowerCase();
        assertTrue(body.contains("token") || body.contains("neplatný") || body.contains("success=false"));
    }

    @Test
    @Order(13)
    @DisplayName("POST /api/users/complete-registration - uživatel je již aktivní")
    void completeRegistrationAlreadyActive() {
        UserDto activeUser = new UserDto();
        activeUser.setFirstName("Active");
        activeUser.setLastName("User");
        activeUser.setEmail("active@osu.cz");
        activeUser.setStudentNumber("P555271");
        activeUser.setActive(true);

        userController.registerUser(activeUser);

        Map<String, String> data = new HashMap<>();
        data.put("token", "some-token");
        data.put("password", "NewStrongPass1");
        data.put("firstName", "Active");
        data.put("lastName", "User");
        data.put("studentNumber", "P555271");

        ResponseEntity<?> response = userController.completeRegistration(data);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        String body = response.getBody().toString().toLowerCase();
        assertTrue(body.contains("aktivní") || body.contains("success=false"));
    }

    @Test
    @Order(14)
    @DisplayName("POST /api/users/complete-registration - prázdný token")
    void completeRegistrationEmptyToken() {
        Map<String, String> data = new HashMap<>();
        data.put("token", "");
        data.put("password", "NewStrongPass1");

        ResponseEntity<?> response = userController.completeRegistration(data);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        String body = response.getBody().toString().toLowerCase();
        assertTrue(body.contains("token") || body.contains("success=false"));
    }

    @Test
    @Order(15)
    @DisplayName("POST /api/users/complete-registration - externista s firmou")
    void completeRegistrationExternalWorkerSuccess() {
        // registrace externisty (neaktivní)
        UserDto dto = new UserDto();
        dto.setFirstName("Karel");
        dto.setLastName("Externista");
        dto.setEmail("extern-pending@osu.cz");
        dto.setRole(Role.EXTERNAL_WORKER);
        dto.setCompanyName("Firma s.r.o.");
        dto.setActive(false);

        userController.registerUser(dto);

        User userEntity = userRepository.findByEmail("extern-pending@osu.cz").orElseThrow();

        VerificationToken vt = tokenRepository.findByUser(userEntity)
                .orElseThrow(() -> new IllegalStateException("Verification token pro externistu nebyl nalezen"));

        Map<String, String> data = new HashMap<>();
        data.put("token", vt.getToken());
        data.put("password", "NewStrongPass1");
        data.put("firstName", "Karel");
        data.put("lastName", "Externista");
        data.put("companyName", "Firma s.r.o.");

        ResponseEntity<?> response = userController.completeRegistration(data);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        String body = response.getBody().toString().toLowerCase();
        assertTrue(body.contains("success") && body.contains("true"));

        User updated = userRepository.findByEmail("extern-pending@osu.cz").orElseThrow();
        assertTrue(updated.isActive());
        assertEquals("Firma s.r.o.", updated.getCompanyName());
    }

    @Test
    @Order(16)
    @DisplayName("POST /api/users/complete-registration - token expiroval")
    void completeRegistrationExpiredToken() {
        // připravíme neaktivního uživatele
        User user = new User();
        user.setFirstName("Old");
        user.setLastName("Pending");
        user.setEmail("expired@osu.cz");
        user.setRole(Role.STUDENT);
        user.setActive(false);
        userRepository.save(user);

        // token, který už expiroval
        VerificationToken vt = new VerificationToken();
        vt.setToken("expired-token");
        vt.setUser(user);
        vt.setExpiryDate(LocalDateTime.now().minusHours(1));
        vt.setPurpose(Purpose.REGISTER);
        tokenRepository.save(vt);

        Map<String, String> data = new HashMap<>();
        data.put("token", "expired-token");
        data.put("password", "NewStrongPass1");
        data.put("firstName", "Old");
        data.put("lastName", "Pending");
        data.put("studentNumber", "P555299");

        ResponseEntity<?> response = userController.completeRegistration(data);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        String body = response.getBody().toString().toLowerCase();
        assertTrue(body.contains("token") || body.contains("expiroval") || body.contains("success=false"));

        // uživatel nesmí být aktivní
        Optional<User> stillPending = userRepository.findByEmail("expired@osu.cz");
        assertTrue(stillPending.isPresent());
        assertFalse(stillPending.get().isActive());
    }

    // FORGOT PASSWORD (/api/users/forgot-password)

    @Test
    @Order(17)
    @DisplayName("POST /api/users/forgot-password - existující e-mail")
    void forgotPasswordExistingEmail() {
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
        String body = response.getBody().toString().toLowerCase();
        assertTrue(body.contains("success") && body.contains("true"));
    }

    @Test
    @Order(18)
    @DisplayName("POST /api/users/forgot-password - neexistující e-mail")
    void forgotPasswordNonExistingEmail() {
        Map<String, String> data = new HashMap<>();
        data.put("email", "neexistuje@osu.cz");

        ResponseEntity<?> response = userController.forgotPassword(data);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        String body = response.getBody().toString().toLowerCase();
        assertTrue(body.contains("success") && body.contains("false"));
    }

    // RESET PASSWORD (/api/users/reset-password)

    @Test
    @Order(19)
    @DisplayName("POST /api/users/reset-password - úspěch s platným tokenem")
    void resetPasswordSuccess() {
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
        String body = response.getBody().toString().toLowerCase();
        assertTrue(body.contains("success") && body.contains("true"));
    }

    @Test
    @Order(20)
    @DisplayName("POST /api/users/reset-password - neplatný / expirovaný token")
    void resetPasswordInvalidToken() {
        Map<String, String> data = new HashMap<>();
        data.put("token", "invalid-token");
        data.put("password", "NewStrongPass1");

        ResponseEntity<?> response = userController.resetPassword(data);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        String body = response.getBody().toString().toLowerCase();
        assertTrue(body.contains("success") && body.contains("false"));
    }

    @Test
    @Order(21)
    @DisplayName("POST /api/users/reset-password - token není pro obnovu hesla")
    void resetPasswordTokenWithWrongPurpose() {
        User user = new User();
        user.setFirstName("Jana");
        user.setLastName("Kralova");
        user.setEmail("wrongpurpose@osu.cz");
        user.setRole(Role.STUDENT);
        user.setActive(true);
        userRepository.save(user);

        // token má správný string, ale jiný Purpose
        VerificationToken vt = new VerificationToken();
        vt.setToken("wrong-purpose-token");
        vt.setUser(user);
        vt.setExpiryDate(LocalDateTime.now().plusHours(1));
        vt.setPurpose(Purpose.REGISTER); // místo RESET_PASSWORD
        tokenRepository.save(vt);

        Map<String, String> data = new HashMap<>();
        data.put("token", "wrong-purpose-token");
        data.put("password", "NewStrongPass1");

        ResponseEntity<?> response = userController.resetPassword(data);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        String body = response.getBody().toString().toLowerCase();
        assertTrue(body.contains("token") || body.contains("není určen pro obnovu hesla"));
    }

    @Test
    @Order(22)
    @DisplayName("POST /api/users/reset-password - expirovaný token")
    void resetPasswordExpiredToken() {
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
        vt.setExpiryDate(LocalDateTime.now().minusHours(1)); // už expirovaný
        vt.setPurpose(Purpose.RESET_PASSWORD);
        tokenRepository.save(vt);

        Map<String, String> data = new HashMap<>();
        data.put("token", "expired-token");
        data.put("password", "NewStrongPass1");

        ResponseEntity<?> response = userController.resetPassword(data);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        String body = response.getBody().toString().toLowerCase();
        assertTrue(body.contains("expiroval") || body.contains("success=false"));
    }

    // GET /api/users (seznam uživatelů)

    @Test
    @Order(23)
    @DisplayName("GET /api/users - vrátí seznam uživatelů")
    void getAllUsersReturnsList() {
        User user = new User();
        user.setFirstName("Jana");
        user.setLastName("Kralova");
        user.setEmail("list@osu.cz");
        user.setRole(Role.STUDENT);
        user.setActive(true);
        userRepository.save(user);

        var result = userController.getAllUsers();

        assertNotNull(result);
        assertFalse(result.isEmpty());
        assertTrue(result.stream().anyMatch(u -> "list@osu.cz".equals(u.getEmail())));
    }

    // ROLE BY TOKEN (/api/users/role-by-token)

    @Test
    @Order(24)
    @DisplayName("GET /api/users/role-by-token - platný token")
    void roleByTokenValid() {
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
        String body = response.getBody().toString();
        assertTrue(body.contains("STUDENT"));
    }

    @Test
    @Order(25)
    @DisplayName("GET /api/users/role-by-token - neplatný token")
    void roleByTokenInvalid() {
        ResponseEntity<?> response = userController.getRoleByToken("invalid-token");

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertTrue(response.getBody().toString().toLowerCase().contains("invalid token"));
    }

    // ME (/api/users/me)

    @Test
    @Order(26)
    @DisplayName("GET /api/users/me - aktuální uživatel")
    void getCurrentUserSuccess() {
        User user = new User();
        user.setFirstName("Jana");
        user.setLastName("Kralova");
        user.setEmail("me@osu.cz");
        user.setRole(Role.STUDENT);
        user.setActive(true);
        userRepository.save(user);

        ResponseEntity<UserDto> response = userController.getCurrentUser(user);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("me@osu.cz", response.getBody().getEmail());
    }

    @Test
    @Order(27)
    @DisplayName("GET /api/users/me - bez přihlášeného uživatele")
    void getCurrentUserNoPrincipal() {
        ResponseEntity<UserDto> response = userController.getCurrentUser(null);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
    }

    @AfterEach
    void cleanup() {
        userRepository.deleteAll();
        tokenRepository.deleteAll();
    }
}

