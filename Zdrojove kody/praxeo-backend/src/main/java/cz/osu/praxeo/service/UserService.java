package cz.osu.praxeo.service;

import cz.osu.praxeo.dao.UserRepository;
import cz.osu.praxeo.dao.VerificationTokenRepository;
import cz.osu.praxeo.dto.UserDto;
import cz.osu.praxeo.entity.Role;
import cz.osu.praxeo.entity.User;
import cz.osu.praxeo.entity.VerificationToken;
import cz.osu.praxeo.exception.UserException;
import cz.osu.praxeo.mapper.UserMapper;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService  implements UserDetailsService {

    @Value("${university.email.domain}")
    private String universityEmailDomain;

    private final UserMapper userMapper;
    private final UserRepository userRepository;
    private final VerificationTokenRepository tokenRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public UserDto registerUser(UserDto userDto) {
        if (userRepository.existsByEmail(userDto.getEmail())) {
            throw new UserException("Email už existuje");
        }

        User user = userMapper.toEntity(userDto);
        if (user.getStudentNumber() != null && user.getStudentNumber().isBlank()) {
            user.setStudentNumber(null);
        }
        if (user.getRole() == null) {
            user.setRole(Role.STUDENT);
        }
        if ((user.getRole() == Role.STUDENT || user.getRole() == Role.TEACHER)
                && !user.getEmail().toLowerCase().endsWith(universityEmailDomain)) {
            throw new UserException("Učitelé a studenti musí mít univerzitní e-mail končící na @osu.cz");
        }
        user.setActive(false);
        user = userRepository.save(user);

        String token = UUID.randomUUID().toString();

        VerificationToken verificationToken = new VerificationToken();
        verificationToken.setToken(token);
        verificationToken.setUser(user);
        verificationToken.setExpiryDate(LocalDateTime.now().plusHours(24));
        tokenRepository.save(verificationToken);

        String frontendUrl = System.getenv("FRONTEND_URL");
        if (frontendUrl == null || frontendUrl.isBlank()) {
            frontendUrl = "http://localhost:5173";
        }

        String link = frontendUrl + "/verify?token=" + token;
        emailService.sendVerificationEmail(user.getEmail(), link);
        return userMapper.toDto(user);
    }

    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(userMapper::toDto)
                .collect(Collectors.toList());
    }

    public Map<String, Object> completeRegistration(
            String token,
            String newPassword,
            String firstName,
            String lastName,
            String studentNumber,
            String companyName
    ) {
        Optional<VerificationToken> optionalToken = tokenRepository.findByToken(token);

        if (optionalToken.isEmpty()) {
            return Map.of(
                    "success", false,
                    "message", "Neplatný nebo expirovaný token"
            );
        }

        VerificationToken verificationToken = optionalToken.get();
        User user = verificationToken.getUser();

        if (user == null) {
            return Map.of(
                    "success", false,
                    "message", "Uživatel neexistuje"
            );
        }

        user.setFirstName(firstName);
        user.setLastName(lastName);
        if (user.getRole().name().equals("STUDENT")) {
            user.setStudentNumber(studentNumber);
        }
        if (user.getRole().name().equals("EXTERNAL_WORKER")) {
            user.setCompanyName(companyName);
        }
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setActive(true);

        userRepository.save(user);
        tokenRepository.delete(verificationToken);

        return Map.of(
                "success", true,
                "message", "Registrace byla dokončena.",
                "email", user.getEmail()
        );
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Uživatel s e-mailem " + email + " nebyl nalezen."));
    }

    public VerificationToken findRoleByToken(String token) {
        return tokenRepository.findByToken(token).orElse(null);
    }
}
