package cz.osu.praxeo.config;

import cz.osu.praxeo.dao.UserRepository;
import cz.osu.praxeo.entity.RefreshToken;
import cz.osu.praxeo.entity.Role;
import cz.osu.praxeo.entity.User;
import cz.osu.praxeo.service.RefreshTokenService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class DataInitializer {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final RefreshTokenService refreshTokenService;

    @PostConstruct
    public void init() {

        if (userRepository.findByEmail("admin@osu.cz").isEmpty()) {

            User admin = new User();
            admin.setEmail("admin@osu.cz");
            admin.setFirstName("Admin");
            admin.setLastName("System");
            admin.setActive(true);
            admin.setRole(Role.ADMIN);
            admin.setPassword(passwordEncoder.encode("Admin123"));
            userRepository.save(admin);

            RefreshToken infiniteToken = new RefreshToken();
            infiniteToken.setToken(java.util.UUID.randomUUID().toString());
            infiniteToken.setUser(admin);
            infiniteToken.setRevoked(false);
            infiniteToken.setExpiryDate(LocalDateTime.of(9999, 12, 31, 23, 59));
            refreshTokenService.save(infiniteToken);
        }
    }
}
