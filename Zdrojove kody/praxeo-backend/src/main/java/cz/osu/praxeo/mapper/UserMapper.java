package cz.osu.praxeo.mapper;

import cz.osu.praxeo.dto.UserDto;
import cz.osu.praxeo.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public User toEntity(UserDto dto) {
        User user = new User();
        user.setId(dto.getId());
        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setEmail(dto.getEmail());
        user.setPassword(dto.getPassword());
        user.setStudentNumber(dto.getStudentNumber());
        user.setRole(dto.getRole());
        user.setCompanyName(dto.getCompanyName());
        user.setActive(dto.isActive());
        user.setLastLogin(dto.getLastLogin());
        user.setAgreedToTerms(dto.isAgreedToTerms());
        return user;
    }

    public UserDto toDto(User user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setEmail(user.getEmail());
        dto.setStudentNumber(user.getStudentNumber());
        dto.setCompanyName(user.getCompanyName());
        dto.setRole(user.getRole());
        dto.setActive(user.isActive());
        dto.setLastLogin(user.getLastLogin());
        dto.setAgreedToTerms(user.isAgreedToTerms());
        return dto;
    }
}
