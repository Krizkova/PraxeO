package cz.osu.praxeo.config;

import cz.osu.praxeo.entity.Role;
import cz.osu.praxeo.entity.User;
import cz.osu.praxeo.dao.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            User admin = new User();
            admin.setFirstName("Admin");
            admin.setLastName("PraxeO");
            admin.setEmail("admin@osu.cz");
            admin.setPassword(passwordEncoder.encode("Heslo123"));
            admin.setRole(Role.ADMIN);
            admin.setActive(true);
            userRepository.save(admin);
            System.out.println("✅ Defaultní uživatel ADMIN byl vytvořen.");
        }
    }
}
