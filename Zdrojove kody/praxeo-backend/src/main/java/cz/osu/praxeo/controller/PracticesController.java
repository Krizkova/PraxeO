package cz.osu.praxeo.controller;

import cz.osu.praxeo.dto.PracticesDto;
import cz.osu.praxeo.entity.Practices;
import cz.osu.praxeo.mapper.PracticesMapper;
import cz.osu.praxeo.mapper.UserMapper;
import cz.osu.praxeo.service.PracticesService;
import cz.osu.praxeo.service.UserService;
import jakarta.annotation.security.RolesAllowed;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/practices")
@RequiredArgsConstructor
public class PracticesController {

    private final PracticesService practicesService;


    @PostMapping("/practices-by-role")
    public ResponseEntity<?> getPracticesByRole() {
        List<PracticesDto> list = practicesService.getPracticesByRole();
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPractice(@PathVariable Long id) {
        return ResponseEntity.ok(practicesService.getPracticeById(id));
    }

    @PreAuthorize("hasRole('TEACHER') or hasRole('EXTERNAL_WORKER') or hasRole('ADMIN')")
    @PostMapping("/create")
    public ResponseEntity<?> createPractice(@RequestBody PracticesDto request) {
        PracticesDto created = practicesService.createPractice(
                request.getName(),
                request.getDescription(),
                request.getCompletedAt()
        );

        return ResponseEntity.ok(created);
    }
}
