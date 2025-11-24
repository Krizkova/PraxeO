package cz.osu.praxeo.controller;

import cz.osu.praxeo.dto.LoginRequest;
import cz.osu.praxeo.dto.UserDto;
import cz.osu.praxeo.entity.Role;
import cz.osu.praxeo.entity.User;
import cz.osu.praxeo.entity.VerificationToken;
import cz.osu.praxeo.exception.UserException;
import cz.osu.praxeo.mapper.UserMapper;
import cz.osu.praxeo.service.UserService;
import cz.osu.praxeo.service.EmailService;
import jakarta.annotation.security.PermitAll;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    private final UserMapper userMapper;


    @GetMapping
    public List<UserDto> getAllUsers() {
        return userService.getAllUsers();
    }

    @PermitAll
    @PostMapping("/registerUser")
    public ResponseEntity<?> registerUser(@Valid @RequestBody UserDto dto) {
        try {
            UserDto registered = userService.registerUser(dto);
            return ResponseEntity.ok(Map.of(
                    "message", "Registrace úspěšná.",
                    "email", registered.getEmail()
            ));
        }  catch (UserException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Registrace se nezdařila.");
        }
    }

    @PostMapping("/set-password")
    @PermitAll
    public ResponseEntity<?> setPassword(@RequestBody Map<String, String> data) {
        String token = (String) data.get("token");
        String password = (String) data.get("password");
        String firstName = (String) data.get("firstName");
        String lastName = (String) data.get("lastName");
        String studentNumber = (String) data.get("studentNumber");
        String companyName = (String) data.get("companyName");

        Map<String, Object> result = userService.completeRegistration(
                token, password, firstName, lastName, studentNumber, companyName
        );

        boolean success = (boolean) result.get("success");

        if (!success) {
            return ResponseEntity.badRequest().body(result);
        }

        return ResponseEntity.ok(result);
    }

    @GetMapping("/role-by-token")
    @PermitAll
    public ResponseEntity<?> getRoleByToken(@RequestParam String token) {
        VerificationToken vt =  userService.findRoleByToken(token);
        if (vt == null) {
            return ResponseEntity.badRequest().body("Invalid token");
        }

        return ResponseEntity.ok(Map.of("role", vt.getUser().getRole().name()));
    }


    @GetMapping("/me")
    public ResponseEntity<UserDto> getCurrentUser(@AuthenticationPrincipal User userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }

        User user = userService.findByEmail(userDetails.getEmail());
        if (user == null) {
            return ResponseEntity.status(404).build();
        }

        return ResponseEntity.ok(userMapper.toDto(user));
    }



}
