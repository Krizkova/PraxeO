package cz.osu.praxeo.mapper;

import cz.osu.praxeo.dto.UserDto;
import cz.osu.praxeo.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public User toEntity(UserDto dto) {
        User user = new User();
        user.setId(dto.getId());
        user.setJmeno(dto.getJmeno());
        user.setPrijmeni(dto.getPrijmeni());
        user.setEmail(dto.getEmail());
        user.setHeslo(dto.getHeslo());
        user.setStudijniCislo(dto.getStudijniCislo());
        user.setRole(dto.getRole());
        return user;
    }

    public UserDto toDto(User user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setJmeno(user.getJmeno());
        dto.setPrijmeni(user.getPrijmeni());
        dto.setEmail(user.getEmail());
        dto.setStudijniCislo(user.getStudijniCislo());
        dto.setRole(user.getRole());
        return dto;
    }
}
