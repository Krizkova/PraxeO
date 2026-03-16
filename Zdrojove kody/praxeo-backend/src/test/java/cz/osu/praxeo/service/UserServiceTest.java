package cz.osu.praxeo.service;

import cz.osu.praxeo.dao.UserRepository;
import cz.osu.praxeo.dao.VerificationTokenRepository;
import cz.osu.praxeo.dto.UserDto;
import cz.osu.praxeo.entity.*;
import cz.osu.praxeo.mapper.UserMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("UserServiceTest")
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private VerificationTokenRepository tokenRepository;

    @Mock
    private EmailService emailService;

    @Mock
    private PasswordEncoder passwordEncoder;

    private UserMapper userMapper;

    private UserService userService;

    @BeforeEach
    void setUp() {
        userMapper = new UserMapper();
        userService = new UserService(
                userMapper,
                userRepository,
                tokenRepository,
                emailService,
                passwordEncoder
        );
        setField(userService, "universityEmailDomain", "@osu.cz");
    }

    private User makeUser(Long id, String email, Role role, boolean active) {
        User u = new User();
        u.setId(id);
        u.setEmail(email);
        u.setRole(role);
        u.setActive(active);
        u.setFirstName("Jana");
        u.setLastName("Králová");
        return u;
    }

    // registerUser

    @Test
    @DisplayName("registerUser – platný student – uloží uživatele a pošle verifikační email")
    void registerUser_validStudent_savesAndSendsVerificationEmail() {
        UserDto dto = new UserDto();
        dto.setEmail("student@osu.cz");
        dto.setRole(Role.STUDENT);

        when(userRepository.existsByEmail("student@osu.cz")).thenReturn(false);
        User savedUser = makeUser(1L, "student@osu.cz", Role.STUDENT, false);
        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        UserDto result = userService.registerUser(dto);

        assertEquals("student@osu.cz", result.getEmail());
        assertEquals(Role.STUDENT, result.getRole());
        assertFalse(result.isActive());
        verify(tokenRepository).save(any(VerificationToken.class));
        verify(emailService).sendVerificationEmail(eq("student@osu.cz"), anyString());
    }

    @Test
    @DisplayName("registerUser – verifikační email obsahuje správný odkaz s tokenem")
    void registerUser_sentEmailContainsToken() {
        UserDto dto = new UserDto();
        dto.setEmail("student@osu.cz");
        dto.setRole(Role.STUDENT);

        when(userRepository.existsByEmail("student@osu.cz")).thenReturn(false);
        when(userRepository.save(any(User.class))).thenReturn(makeUser(1L, "student@osu.cz", Role.STUDENT, false));

        userService.registerUser(dto);

        ArgumentCaptor<String> linkCaptor = ArgumentCaptor.forClass(String.class);
        verify(emailService).sendVerificationEmail(eq("student@osu.cz"), linkCaptor.capture());
        assertTrue(linkCaptor.getValue().contains("/verify?token="));
    }

    @Test
    @DisplayName("registerUser – duplicitní email vyhodí konflikt")
    void registerUser_emailAlreadyExists_throwsConflict() {
        UserDto dto = new UserDto();
        dto.setEmail("student@osu.cz");

        when(userRepository.existsByEmail("student@osu.cz")).thenReturn(true);

        assertThrows(ResponseStatusException.class, () -> userService.registerUser(dto));
        verify(userRepository, never()).save(any());
    }

    @Test
    @DisplayName("registerUser – student s gmail vyhodí konflikt")
    void registerUser_studentWithNonUniversityEmail_throwsConflict() {
        UserDto dto = new UserDto();
        dto.setEmail("student@gmail.com");
        dto.setRole(Role.STUDENT);

        when(userRepository.existsByEmail(any())).thenReturn(false);

        assertThrows(ResponseStatusException.class, () -> userService.registerUser(dto));
        verify(userRepository, never()).save(any());
    }

    @Test
    @DisplayName("registerUser – učitel s gmail vyhodí konflikt")
    void registerUser_teacherWithNonUniversityEmail_throwsConflict() {
        UserDto dto = new UserDto();
        dto.setEmail("ucitel@gmail.com");
        dto.setRole(Role.TEACHER);

        when(userRepository.existsByEmail(any())).thenReturn(false);

        assertThrows(ResponseStatusException.class, () -> userService.registerUser(dto));
        verify(userRepository, never()).save(any());
    }

    @Test
    @DisplayName("registerUser – externí pracovník s libovolným emailem uspěje")
    void registerUser_externalWorkerWithAnyEmail_succeeds() {
        UserDto dto = new UserDto();
        dto.setEmail("worker@firma.cz");
        dto.setRole(Role.EXTERNAL_WORKER);

        when(userRepository.existsByEmail("worker@firma.cz")).thenReturn(false);
        when(userRepository.save(any(User.class))).thenReturn(makeUser(1L, "worker@firma.cz", Role.EXTERNAL_WORKER, false));

        UserDto result = userService.registerUser(dto);

        assertEquals("worker@firma.cz", result.getEmail());
        assertEquals(Role.EXTERNAL_WORKER, result.getRole());
        verify(userRepository).save(any(User.class));
    }

    @Test
    @DisplayName("registerUser – nový uživatel je neaktivní")
    void registerUser_newUserIsInactive() {
        UserDto dto = new UserDto();
        dto.setEmail("student@osu.cz");
        dto.setRole(Role.STUDENT);

        when(userRepository.existsByEmail("student@osu.cz")).thenReturn(false);
        User savedUser = makeUser(1L, "student@osu.cz", Role.STUDENT, false);
        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        UserDto result = userService.registerUser(dto);

        assertFalse(result.isActive());
    }

    // completeRegistration

    @Test
    @DisplayName("completeRegistration – platný token aktivuje uživatele a nastaví data")
    void completeRegistration_validToken_activatesUser() {
        User user = makeUser(1L, "student@osu.cz", Role.STUDENT, false);
        VerificationToken vt = new VerificationToken();
        vt.setToken("platny");
        vt.setUser(user);

        when(tokenRepository.findByToken("platny")).thenReturn(Optional.of(vt));
        when(passwordEncoder.encode("heslo")).thenReturn("$encoded$");

        Map<String, Object> result = userService.completeRegistration(
                "platny", "heslo", "Jana", "Nováková", "ST12345", null
        );

        assertTrue((Boolean) result.get("success"));
        assertTrue(user.isActive());
        assertTrue(user.isAgreedToTerms());
        assertEquals("Jana", user.getFirstName());
        assertEquals("Nováková", user.getLastName());
        assertEquals("ST12345", user.getStudentNumber());
        assertEquals("$encoded$", user.getPassword());
        assertEquals("student@osu.cz", result.get("email"));
        verify(userRepository).save(user);
        verify(tokenRepository).delete(vt);
    }

    @Test
    @DisplayName("completeRegistration – pro externího pracovníka nastaví companyName")
    void completeRegistration_externalWorker_setsCompanyName() {
        User user = makeUser(1L, "worker@firma.cz", Role.EXTERNAL_WORKER, false);
        VerificationToken vt = new VerificationToken();
        vt.setToken("ext-token");
        vt.setUser(user);

        when(tokenRepository.findByToken("ext-token")).thenReturn(Optional.of(vt));
        when(passwordEncoder.encode("heslo")).thenReturn("$encoded$");

        Map<String, Object> result = userService.completeRegistration(
                "ext-token", "heslo", "Petr", "Novák", null, "Firma s.r.o."
        );

        assertTrue((Boolean) result.get("success"));
        assertEquals("Firma s.r.o.", user.getCompanyName());
    }

    @Test
    @DisplayName("completeRegistration – neplatný token vrátí failure")
    void completeRegistration_invalidToken_returnsFailure() {
        when(tokenRepository.findByToken("spatny")).thenReturn(Optional.empty());

        Map<String, Object> result = userService.completeRegistration(
                "spatny", "heslo", "Jan", "Novák", null, null
        );

        assertFalse((Boolean) result.get("success"));
        assertEquals("Neplatný nebo expirovaný token", result.get("message"));
        verify(userRepository, never()).save(any());
    }

    //  findByEmail

    @Test
    @DisplayName("findByEmail – existující uživatel vrátí uživatele se správnými daty")
    void findByEmail_existingUser_returnsUser() {
        User user = makeUser(1L, "ucitel@osu.cz", Role.TEACHER, true);
        when(userRepository.findByEmail("ucitel@osu.cz")).thenReturn(Optional.of(user));

        User result = userService.findByEmail("ucitel@osu.cz");

        assertNotNull(result);
        assertEquals("ucitel@osu.cz", result.getEmail());
        assertEquals(Role.TEACHER, result.getRole());
        assertTrue(result.isActive());
    }

    @Test
    @DisplayName("findByEmail – neexistující uživatel vrátí null")
    void findByEmail_nonExistingUser_returnsNull() {
        when(userRepository.findByEmail("nikdo@osu.cz")).thenReturn(Optional.empty());

        assertNull(userService.findByEmail("nikdo@osu.cz"));
    }

    // getAllUsers

    @Test
    @DisplayName("getAllUsers – vrátí správně namapovaný seznam")
    void getAllUsers_returnsMappedList() {
        User u1 = makeUser(1L, "student@osu.cz", Role.STUDENT, true);
        User u2 = makeUser(2L, "ucitel@osu.cz", Role.TEACHER, true);
        when(userRepository.findAll()).thenReturn(List.of(u1, u2));

        List<UserDto> result = userService.getAllUsers();

        assertEquals(2, result.size());
        assertEquals("student@osu.cz", result.get(0).getEmail());
        assertEquals(Role.STUDENT, result.get(0).getRole());
        assertEquals("ucitel@osu.cz", result.get(1).getEmail());
        assertEquals(Role.TEACHER, result.get(1).getRole());
    }

    @Test
    @DisplayName("getAllUsers – heslo není součástí DTO")
    void getAllUsers_passwordNotExposedInDto() {
        User u = makeUser(1L, "student@osu.cz", Role.STUDENT, true);
        u.setPassword("$2a$secret");
        when(userRepository.findAll()).thenReturn(List.of(u));

        List<UserDto> result = userService.getAllUsers();

        // UserMapper.toDto() nenastavuje heslo — musí být null v DTO
        assertNull(result.get(0).getPassword());
    }

    // sendMailForPasswordReset

    @Test
    @DisplayName("sendMailForPasswordReset – aktivní uživatel uloží token a pošle email")
    void sendMailForPasswordReset_activeUser_savesTokenAndSendsEmail() {
        User active = makeUser(1L, "student@osu.cz", Role.STUDENT, true);
        when(userRepository.findByEmail("student@osu.cz")).thenReturn(Optional.of(active));

        userService.sendMailForPasswordReset("student@osu.cz");

        ArgumentCaptor<VerificationToken> tokenCaptor = ArgumentCaptor.forClass(VerificationToken.class);
        verify(tokenRepository).save(tokenCaptor.capture());
        assertEquals(Purpose.RESET_PASSWORD, tokenCaptor.getValue().getPurpose());
        assertEquals(active, tokenCaptor.getValue().getUser());

        ArgumentCaptor<String> linkCaptor = ArgumentCaptor.forClass(String.class);
        verify(emailService).sendPasswordResetEmail(eq("student@osu.cz"), linkCaptor.capture());
        assertTrue(linkCaptor.getValue().contains("/reset-password?token="));
    }

    @Test
    @DisplayName("sendMailForPasswordReset – neexistující uživatel vyhodí výjimku")
    void sendMailForPasswordReset_userNotFound_throwsException() {
        when(userRepository.findByEmail("nikdo@osu.cz")).thenReturn(Optional.empty());

        assertThrows(ResponseStatusException.class,
                () -> userService.sendMailForPasswordReset("nikdo@osu.cz"));
        verify(emailService, never()).sendPasswordResetEmail(any(), any());
    }

    @Test
    @DisplayName("sendMailForPasswordReset – neaktivní uživatel vyhodí výjimku")
    void sendMailForPasswordReset_inactiveUser_throwsException() {
        User inactive = makeUser(1L, "student@osu.cz", Role.STUDENT, false);
        when(userRepository.findByEmail("student@osu.cz")).thenReturn(Optional.of(inactive));

        assertThrows(ResponseStatusException.class,
                () -> userService.sendMailForPasswordReset("student@osu.cz"));
        verify(emailService, never()).sendPasswordResetEmail(any(), any());
    }

    // resetPassword

    @Test
    @DisplayName("resetPassword – platný token změní heslo, smaže token a vrátí email")
    void resetPassword_validToken_changesPasswordAndDeletesToken() {
        User user = makeUser(1L, "student@osu.cz", Role.STUDENT, true);
        VerificationToken vt = new VerificationToken();
        vt.setToken("platny-token");
        vt.setUser(user);
        vt.setPurpose(Purpose.RESET_PASSWORD);
        vt.setExpiryDate(LocalDateTime.now().plusHours(1));

        when(tokenRepository.findByToken("platny-token")).thenReturn(Optional.of(vt));
        when(passwordEncoder.encode("noveHeslo")).thenReturn("$encoded$");

        Map<String, Object> result = userService.resetPassword("platny-token", "noveHeslo");

        assertTrue((Boolean) result.get("success"));
        assertEquals("student@osu.cz", result.get("email"));
        assertEquals("$encoded$", user.getPassword());
        verify(userRepository).save(user);
        verify(tokenRepository).delete(vt);
    }

    @Test
    @DisplayName("resetPassword – neplatný token vrátí failure")
    void resetPassword_invalidToken_returnsFailure() {
        when(tokenRepository.findByToken("spatny-token")).thenReturn(Optional.empty());

        Map<String, Object> result = userService.resetPassword("spatny-token", "noveHeslo");

        assertFalse((Boolean) result.get("success"));
        verify(userRepository, never()).save(any());
    }

    @Test
    @DisplayName("resetPassword – expirovaný token vrátí failure")
    void resetPassword_expiredToken_returnsFailure() {
        User user = makeUser(1L, "student@osu.cz", Role.STUDENT, true);
        VerificationToken vt = new VerificationToken();
        vt.setToken("expirovaný-token");
        vt.setUser(user);
        vt.setPurpose(Purpose.RESET_PASSWORD);
        vt.setExpiryDate(LocalDateTime.now().minusHours(1));

        when(tokenRepository.findByToken("expirovaný-token")).thenReturn(Optional.of(vt));

        Map<String, Object> result = userService.resetPassword("expirovaný-token", "noveHeslo");

        assertFalse((Boolean) result.get("success"));
        verify(userRepository, never()).save(any());
    }

    @Test
    @DisplayName("resetPassword – token pro registraci vrátí failure")
    void resetPassword_wrongPurposeToken_returnsFailure() {
        User user = makeUser(1L, "student@osu.cz", Role.STUDENT, true);
        VerificationToken vt = new VerificationToken();
        vt.setToken("registracni-token");
        vt.setUser(user);
        vt.setPurpose(Purpose.REGISTER);
        vt.setExpiryDate(LocalDateTime.now().plusHours(1));

        when(tokenRepository.findByToken("registracni-token")).thenReturn(Optional.of(vt));

        Map<String, Object> result = userService.resetPassword("registracni-token", "noveHeslo");

        assertFalse((Boolean) result.get("success"));
        verify(userRepository, never()).save(any());
    }

    // loadUserByUsername

    @Test
    @DisplayName("loadUserByUsername – existující email vrátí UserDetails")
    void loadUserByUsername_existingEmail_returnsUserDetails() {
        User user = makeUser(1L, "student@osu.cz", Role.STUDENT, true);
        when(userRepository.findByEmail("student@osu.cz")).thenReturn(Optional.of(user));

        var result = userService.loadUserByUsername("student@osu.cz");

        assertNotNull(result);
        assertEquals("student@osu.cz", result.getUsername());
    }

    @Test
    @DisplayName("loadUserByUsername – neexistující email vyhodí výjimku")
    void loadUserByUsername_nonExistingEmail_throwsException() {
        when(userRepository.findByEmail("nikdo@osu.cz")).thenReturn(Optional.empty());

        assertThrows(Exception.class, () -> userService.loadUserByUsername("nikdo@osu.cz"));
    }

    // Pomocná metoda

    private void setField(Object target, String fieldName, Object value) {
        try {
            var field = target.getClass().getDeclaredField(fieldName);
            field.setAccessible(true);
            field.set(target, value);
        } catch (Exception e) {
            throw new RuntimeException("Nepodařilo se nastavit pole: " + fieldName, e);
        }
    }
}