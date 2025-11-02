package cz.osu.praxeo.controller;

import cz.osu.praxeo.dto.UserDto;
import cz.osu.praxeo.entity.User;
import cz.osu.praxeo.mapper.UserMapper;
import cz.osu.praxeo.service.UserService;
import jakarta.annotation.security.PermitAll;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;
    private final UserMapper userMapper;

    public UserController(UserService userService, UserMapper userMapper) {
        this.userService = userService;
        this.userMapper = userMapper;
    }

    @GetMapping
    public List<UserDto> getAllUsers() {
        return userService.getAllUsers();
    }

    @PermitAll
    @PostMapping("/register")
    public UserDto register(@RequestBody UserDto dto) {
        User user = userMapper.toEntity(dto);
        User saved = userService.registerUser(user);
        return userMapper.toDto(saved);
    }
}
