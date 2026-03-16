package cz.osu.praxeo.service;

import cz.osu.praxeo.dao.RefreshTokenRepository;
import cz.osu.praxeo.entity.RefreshToken;
import cz.osu.praxeo.entity.Role;
import cz.osu.praxeo.entity.User;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("RefreshTokenServiceTest")
class RefreshTokenServiceTest {

    @Mock
    private RefreshTokenRepository refreshTokenRepository;

    @InjectMocks
    private RefreshTokenService refreshTokenService;

    private User makeUser(Long id, String email) {
        User u = new User();
        u.setId(id);
        u.setEmail(email);
        u.setRole(Role.STUDENT);
        u.setActive(true);
        return u;
    }

    private RefreshToken makeToken(User user, String token, boolean revoked, boolean expired) {
        RefreshToken rt = new RefreshToken();
        rt.setToken(token);
        rt.setUser(user);
        rt.setRevoked(revoked);
        rt.setExpiryDate(expired
                ? LocalDateTime.now().minusDays(1)   // vypršený token
                : LocalDateTime.now().plusDays(30)   // platný token
        );
        return rt;
    }

    //  createRefreshToken

    @Test
    @DisplayName("createRefreshToken – ukládá token pro uživatele")
    void createRefreshToken_savesTokenForUser() {
        User user = makeUser(1L, "student@osu.cz");
        when(refreshTokenRepository.save(any(RefreshToken.class)))
                .thenAnswer(inv -> inv.getArgument(0));

        RefreshToken result = refreshTokenService.createRefreshToken(user);

        assertNotNull(result);
        assertEquals(user, result.getUser());
        assertFalse(result.isRevoked());
        assertNotNull(result.getToken());
        // Token musí být platný 30 dní od teď
        assertTrue(result.getExpiryDate().isAfter(LocalDateTime.now().plusDays(29)));
        verify(refreshTokenRepository).save(any(RefreshToken.class));
    }

    @Test
    @DisplayName("createRefreshToken – každý token je unikátní")
    void createRefreshToken_eachTokenIsUnique() {
        User user = makeUser(1L, "student@osu.cz");
        when(refreshTokenRepository.save(any(RefreshToken.class)))
                .thenAnswer(inv -> inv.getArgument(0));

        RefreshToken first = refreshTokenService.createRefreshToken(user);
        RefreshToken second = refreshTokenService.createRefreshToken(user);

        assertNotEquals(first.getToken(), second.getToken());
    }

    //  validateRefreshToken

    @Test
    @DisplayName("validateRefreshToken – platný token vrací token")
    void validateRefreshToken_validToken_returnsToken() {
        User user = makeUser(1L, "student@osu.cz");
        RefreshToken rt = makeToken(user, "platny-token", false, false);
        when(refreshTokenRepository.findByToken("platny-token")).thenReturn(Optional.of(rt));

        RefreshToken result = refreshTokenService.validateRefreshToken("platny-token");

        assertNotNull(result);
        assertEquals("platny-token", result.getToken());
    }

    @Test
    @DisplayName("validateRefreshToken – neexistující token vyhodí výjimku")
    void validateRefreshToken_tokenNotFound_throwsException() {
        when(refreshTokenRepository.findByToken("neexistuje")).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class,
                () -> refreshTokenService.validateRefreshToken("neexistuje"));
    }

    @Test
    @DisplayName("validateRefreshToken – expirovaný token vyhodí výjimku")
    void validateRefreshToken_expiredToken_throwsException() {
        User user = makeUser(1L, "student@osu.cz");
        RefreshToken rt = makeToken(user, "expirovaný-token", false, true);
        when(refreshTokenRepository.findByToken("expirovaný-token")).thenReturn(Optional.of(rt));

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> refreshTokenService.validateRefreshToken("expirovaný-token"));

        assertTrue(ex.getMessage().toLowerCase().contains("neplatný nebo expirovaný"));
    }

    @Test
    @DisplayName("validateRefreshToken – revokovaný token vyhodí výjimku")
    void validateRefreshToken_revokedToken_throwsException() {
        User user = makeUser(1L, "student@osu.cz");
        RefreshToken rt = makeToken(user, "revokovaný-token", true, false);
        when(refreshTokenRepository.findByToken("revokovaný-token")).thenReturn(Optional.of(rt));

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> refreshTokenService.validateRefreshToken("revokovaný-token"));

        assertTrue(ex.getMessage().toLowerCase().contains("neplatný nebo expirovaný"));
    }

    // revokeToken

    @Test
    @DisplayName("revokeToken – existující token označí jako revokovaný")
    void revokeToken_existingToken_setsRevokedTrue() {
        User user = makeUser(1L, "student@osu.cz");
        RefreshToken rt = makeToken(user, "aktivní-token", false, false);
        when(refreshTokenRepository.findByToken("aktivní-token")).thenReturn(Optional.of(rt));

        refreshTokenService.revokeToken("aktivní-token");

        assertTrue(rt.isRevoked());
        verify(refreshTokenRepository).save(rt);
    }

    @Test
    @DisplayName("revokeToken – neexistující token nic nedělá")
    void revokeToken_nonExistingToken_doesNothing() {
        when(refreshTokenRepository.findByToken("neexistuje")).thenReturn(Optional.empty());

        assertDoesNotThrow(() -> refreshTokenService.revokeToken("neexistuje"));
        verify(refreshTokenRepository, never()).save(any());
    }

    // save

    @Test
    @DisplayName("save – volá repository save")
    void save_callsRepository() {
        User user = makeUser(1L, "student@osu.cz");
        RefreshToken rt = makeToken(user, "token", false, false);

        refreshTokenService.save(rt);

        verify(refreshTokenRepository).save(rt);
    }
}
