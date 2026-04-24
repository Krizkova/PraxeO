package cz.osu.praxeo.dao;

import cz.osu.praxeo.entity.VerificationToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VerificationTokenRepository extends JpaRepository<VerificationToken, Long> {
    Optional<VerificationToken> findByToken(String token);

    // nový method pro test completeRegistrationSuccess
    Optional<VerificationToken> findByUser(cz.osu.praxeo.entity.User user);

    // Slouží k nalezení a smazání starého tokenu před vytvořením nového při obnově hesla
    Optional<VerificationToken> findByUserAndPurpose(
            cz.osu.praxeo.entity.User user,
            cz.osu.praxeo.entity.Purpose purpose
    );
}