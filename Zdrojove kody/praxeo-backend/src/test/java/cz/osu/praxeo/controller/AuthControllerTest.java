package cz.osu.praxeo.controller;

import cz.osu.praxeo.entity.RefreshToken;
import cz.osu.praxeo.entity.Role;
import cz.osu.praxeo.entity.User;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import cz.osu.praxeo.dto.LoginRequestDto;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import org.springframework.mail.javamail.JavaMailSender;
import com.fasterxml.jackson.databind.ObjectMapper;

@SpringBootTest
@Transactional
@ActiveProfiles("test")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@DisplayName("AuthControllerTest")
class AuthControllerTest {

    @MockBean
    private JavaMailSender javaMailSender;

    @Autowired
    private AuthController authController;

    @Autowired
    private cz.osu.praxeo.dao.UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private cz.osu.praxeo.dao.RefreshTokenRepository refreshTokenRepository;

    private final ObjectMapper objectMapper = new ObjectMapper();

    private User saveUser(String email, String rawPassword, Role role, boolean active) {
        User user = new User();
        user.setEmail(email);
        user.setPassword(rawPassword != null ? passwordEncoder.encode(rawPassword) : null);
        user.setFirstName("Jana");
        user.setLastName("Králová");
        user.setRole(role);
        user.setActive(active);
        return userRepository.save(user);
    }

    // login

    @DisplayName("login – platné údaje")
    @Test
    @Order(1)
    void login_validCredentials_returnsTokenAndEmail() {
        saveUser("login-success@osu.cz", "raw", Role.STUDENT, true);

        LoginRequestDto dto = new LoginRequestDto();
        dto.setEmail("login-success@osu.cz");
        dto.setPassword("raw");

        ResponseEntity<?> response = authController.login(dto);

        assertEquals(HttpStatus.OK, response.getStatusCode());

        @SuppressWarnings("unchecked")
        Map<String, Object> body = objectMapper.convertValue(response.getBody(), Map.class);

        assertTrue(body.containsKey("token"));
        assertTrue(body.containsKey("refreshToken"));
        assertEquals("login-success@osu.cz", body.get("email"));
    }

    @DisplayName("login – neexistující uživatel")
    @Test
    @Order(2)
    void login_nonExistingUser_returnsUnauthorized() {
        LoginRequestDto dto = new LoginRequestDto();
        dto.setEmail("unknown@osu.cz");
        dto.setPassword("pass");

        ResponseEntity<?> response = authController.login(dto);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertTrue(response.getBody().toString().toLowerCase().contains("uživatel"));
    }

    @DisplayName("login – špatné heslo")
    @Test
    @Order(3)
    void login_wrongPassword_returnsUnauthorized() {
        saveUser("login-wrong@osu.cz", "correct", Role.STUDENT, true);

        LoginRequestDto dto = new LoginRequestDto();
        dto.setEmail("login-wrong@osu.cz");
        dto.setPassword("wrong");

        ResponseEntity<?> response = authController.login(dto);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertTrue(response.getBody().toString().toLowerCase().contains("neplatné"));
    }

    @DisplayName("login – neaktivní uživatel")
    @Test
    @Order(4)
    void login_inactiveUser_returnsUnauthorized() {
        saveUser("inactive@osu.cz", "heslo", Role.STUDENT, false);

        LoginRequestDto dto = new LoginRequestDto();
        dto.setEmail("inactive@osu.cz");
        dto.setPassword("heslo");

        ResponseEntity<?> response = authController.login(dto);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
    }

    // refresh

    @DisplayName("refresh – chybí token")
    @Test
    @Order(5)
    void refresh_missingToken_returnsBadRequest() {
        Map<String, String> body = new HashMap<>();

        ResponseEntity<?> response = authController.refresh(body);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertTrue(response.getBody().toString().toLowerCase().contains("refresh"));
    }

    @DisplayName("refresh – platný token")
    @Test
    @Order(6)
    void refresh_validToken_returnsNewJwtToken() {
        User user = saveUser("refresh-success@osu.cz", null, Role.STUDENT, true);

        RefreshToken rt = new RefreshToken();
        rt.setToken("VALID_REFRESH_TOKEN");
        rt.setUser(user);
        rt.setExpiryDate(LocalDateTime.now().plusDays(30));
        rt.setRevoked(false);
        refreshTokenRepository.save(rt);

        Map<String, String> body = new HashMap<>();
        body.put("refreshToken", "VALID_REFRESH_TOKEN");

        ResponseEntity<?> response = authController.refresh(body);

        assertEquals(HttpStatus.OK, response.getStatusCode());

        @SuppressWarnings("unchecked")
        Map<String, Object> respBody = objectMapper.convertValue(response.getBody(), Map.class);

        assertTrue(respBody.containsKey("token"));
        assertEquals("VALID_REFRESH_TOKEN", respBody.get("refreshToken"));
        assertEquals("refresh-success@osu.cz", respBody.get("email"));
    }

    @DisplayName("refresh – neplatný token")
    @Test
    @Order(7)
    void refresh_invalidToken_returnsUnauthorized() {
        Map<String, String> body = new HashMap<>();
        body.put("refreshToken", "NEPLATNY_TOKEN");

        ResponseEntity<?> response = authController.refresh(body);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertTrue(response.getBody().toString().toLowerCase().contains("token"));
    }

    @DisplayName("refresh – odvolaný token")
    @Test
    @Order(8)
    void refresh_revokedToken_returnsUnauthorized() {
        User user = saveUser("revoked@osu.cz", null, Role.STUDENT, true);

        RefreshToken rt = new RefreshToken();
        rt.setToken("REVOKED_TOKEN");
        rt.setUser(user);
        rt.setExpiryDate(LocalDateTime.now().plusDays(30));
        rt.setRevoked(true);
        refreshTokenRepository.save(rt);

        Map<String, String> body = new HashMap<>();
        body.put("refreshToken", "REVOKED_TOKEN");

        ResponseEntity<?> response = authController.refresh(body);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
    }

    @DisplayName("refresh – expirovaný token")
    @Test
    @Order(9)
    void refresh_expiredToken_returnsUnauthorized() {
        User user = saveUser("expired@osu.cz", null, Role.STUDENT, true);

        RefreshToken rt = new RefreshToken();
        rt.setToken("EXPIRED_TOKEN");
        rt.setUser(user);
        rt.setExpiryDate(LocalDateTime.now().minusDays(1));
        rt.setRevoked(false);
        refreshTokenRepository.save(rt);

        Map<String, String> body = new HashMap<>();
        body.put("refreshToken", "EXPIRED_TOKEN");

        ResponseEntity<?> response = authController.refresh(body);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
    }

    @AfterEach
    void cleanup() {
        refreshTokenRepository.deleteAll();
        userRepository.deleteAll();
    }
}
