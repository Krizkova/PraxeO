package cz.osu.praxeo.service;

import cz.osu.praxeo.dao.PracticesRepository;
import cz.osu.praxeo.dao.UserRepository;
import cz.osu.praxeo.dto.PracticesDto;
import cz.osu.praxeo.dto.UserDto;
import cz.osu.praxeo.entity.Practices;
import cz.osu.praxeo.entity.User;
import cz.osu.praxeo.mapper.PracticesMapper;
import cz.osu.praxeo.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PracticesService {

    private final PracticesMapper practicesMapper;
    private final UserService userService;
    private final PracticesRepository practicesRepository;

    public List<PracticesDto> getPracticesByRole() {

        User user = userService.getCurrentUser();
        String role = user.getRole().name();

        List<Practices> list;

        switch (role) {
            case "ADMIN":
            case "TEACHER":
                list = practicesRepository.findAll();
                break;
            case "STUDENT":
                List<Practices> assigned = practicesRepository.findByStudent(user);
                if (!assigned.isEmpty()) {
                    list = assigned;
                } else {
                    list = practicesRepository.findByStudentIsNull();
                }
                break;
            case "EXTERNAL_WORKER":
                list = practicesRepository.findByFounder(user);
                break;
            default:
                list = List.of();
        }

        return list.stream()
                .map(practicesMapper::toDto)
                .toList();
    }

    public PracticesDto getPracticeDetail(Long id) {
        Practices p = practicesRepository.findById(id).orElse(null);
        if (p == null) return null;
        return practicesMapper.toDto(p);
    }
}
