package cz.osu.praxeo.service;

import cz.osu.praxeo.dao.UserRepository;
import cz.osu.praxeo.dto.UserDto;
import cz.osu.praxeo.entity.User;
import cz.osu.praxeo.exception.UserException;
import cz.osu.praxeo.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User registerUser(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new UserException("Uživatel s emailem " + user.getEmail() + " již existuje");
        }

        user.setHeslo(passwordEncoder.encode(user.getHeslo()));
        return userRepository.save(user);
    }

    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(userMapper::toDto)
                .collect(Collectors.toList());
    }

}
