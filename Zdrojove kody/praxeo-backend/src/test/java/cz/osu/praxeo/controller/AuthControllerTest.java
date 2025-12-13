package cz.osu.praxeo.controller;

import cz.osu.praxeo.entity.RefreshToken;
import cz.osu.praxeo.entity.Role;
import cz.osu.praxeo.entity.User;
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
import java.util.LinkedHashMap;

@SpringBootTest
@ActiveProfiles("test")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
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

    // LOGIN

    @Test
    @Order(1)
    @DisplayName("POST /api/auth/login - úspěšné přihlášení")
    void loginSuccess() {
        User user = new User();
        user.setEmail("login-success@osu.cz");
        user.setPassword(passwordEncoder.encode("raw"));
        user.setFirstName("Jana");
        user.setLastName("Kralova");
        user.setRole(Role.STUDENT);
        user.setActive(true);
        userRepository.save(user);

        var dto = new LoginRequestDto();
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

    @Test
    @Order(2)
    @DisplayName("POST /api/auth/login - neexistující uživatel")
    void loginUserNotFound() {
        LoginRequestDto dto = new LoginRequestDto();
        dto.setEmail("unknown@osu.cz");
        dto.setPassword("pass");

        ResponseEntity<?> response = authController.login(dto);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertTrue(response.getBody().toString().toLowerCase().contains("uživatel"));
    }

    @Test
    @Order(3)
    @DisplayName("POST /api/auth/login - špatné heslo")
    void loginWrongPassword() {
        User user = new User();
        user.setEmail("login-wrong@osu.cz");
        user.setPassword(passwordEncoder.encode("correct"));
        user.setRole(Role.STUDENT);
        user.setActive(true);
        userRepository.save(user);

        LoginRequestDto dto = new LoginRequestDto();
        dto.setEmail("login-wrong@osu.cz");
        dto.setPassword("wrong");

        ResponseEntity<?> response = authController.login(dto);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertTrue(response.getBody().toString().toLowerCase().contains("neplatné"));
    }

    // REFRESH

    @Test
    @Order(4)
    @DisplayName("POST /api/auth/refresh - chybí refreshToken v těle")
    void refreshMissingToken() {
        Map<String, String> body = new HashMap<>();

        ResponseEntity<?> response = authController.refresh(body);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertTrue(response.getBody().toString().toLowerCase().contains("refresh"));
    }

    @Test
    @Order(5)
    @DisplayName("POST /api/auth/refresh - úspěch s platným tokenem")
    void refreshSuccess() {
        User user = new User();
        user.setEmail("refresh-success@osu.cz");
        user.setFirstName("Jana");
        user.setLastName("Kralova");
        user.setRole(Role.STUDENT);
        user.setActive(true);
        user = userRepository.save(user);

        RefreshToken rt = new RefreshToken();
        rt.setToken("SOME_REFRESH_TOKEN");
        rt.setUser(user);
        rt.setExpiryDate(LocalDateTime.now().plusDays(30));
        rt.setRevoked(false);
        refreshTokenRepository.save(rt);

        Map<String, String> body = new HashMap<>();
        body.put("refreshToken", "SOME_REFRESH_TOKEN");

        ResponseEntity<?> response = authController.refresh(body);

        assertEquals(HttpStatus.OK, response.getStatusCode());

        @SuppressWarnings("unchecked")
        Map<String, Object> respBody = objectMapper.convertValue(response.getBody(), Map.class);

        assertTrue(respBody.containsKey("token"));
        assertEquals("SOME_REFRESH_TOKEN", respBody.get("refreshToken"));
        assertEquals("refresh-success@osu.cz", respBody.get("email"));
    }

    @Test
    @Order(6)
    @DisplayName("POST /api/auth/refresh - neplatný / expirovaný refresh token")
    void refreshInvalidToken() {
        Map<String, String> body = new HashMap<>();
        body.put("refreshToken", "BAD_TOKEN");

        ResponseEntity<?> response = authController.refresh(body);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertTrue(response.getBody().toString().toLowerCase().contains("token"));
    }

    @AfterEach
    void cleanup() {
        refreshTokenRepository.deleteAll();
        userRepository.deleteAll();
    }
}
