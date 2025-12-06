package cz.osu.praxeo.controller;

import cz.osu.praxeo.dto.LoginRequestDto;
import cz.osu.praxeo.dto.UserDto;
import cz.osu.praxeo.entity.RefreshToken;
import cz.osu.praxeo.entity.User;
import cz.osu.praxeo.mapper.UserMapper;
import cz.osu.praxeo.security.JwtService;
import cz.osu.praxeo.service.RefreshTokenService;
import cz.osu.praxeo.service.UserService;
import jakarta.annotation.security.PermitAll;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;

    @PostMapping("/login")
    @PermitAll
    public ResponseEntity<?> login(@RequestBody LoginRequestDto loginRequestDto) {
        User user = userService.findByEmail(loginRequestDto.getEmail());
        if (user == null) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Uživatel neexistuje");
        }
        if (!passwordEncoder.matches(loginRequestDto.getPassword(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Neplatné přihlašovací údaje");
        }

        String accessToken = jwtService.generateToken(user);
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user);
        UserDto dto = userMapper.toDto(user);

        return ResponseEntity.ok(Map.of(
                "token", accessToken,
                "refreshToken", refreshToken.getToken(),
                "email", user.getEmail(),
                "role", user.getRole().name(),
                "firstName", user.getFirstName(),
                "lastName", user.getLastName()
        ));
    }


    @PostMapping("/refresh")
    @PermitAll
    public ResponseEntity<?> refresh(@RequestBody Map<String, String> body) {
        String refreshTokenValue = body.get("refreshToken");
        if (refreshTokenValue == null || refreshTokenValue.isBlank()) {
            return ResponseEntity.badRequest().body("Chybí refreshToken");
        }

        try {
            RefreshToken refreshToken = refreshTokenService.validateRefreshToken(refreshTokenValue);
            User user = refreshToken.getUser();
            String newAccessToken = jwtService.generateToken(user);

            return ResponseEntity.ok(Map.of(
                    "token", newAccessToken,
                    "refreshToken", refreshTokenValue,
                    "email", user.getEmail(),
                    "role", user.getRole().name(),
                    "firstName", user.getFirstName(),
                    "lastName", user.getLastName()
            ));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ex.getMessage());
        }
    }



}
