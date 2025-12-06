package cz.osu.praxeo.controller;

import cz.osu.praxeo.dao.PracticeDetailRepository;
import cz.osu.praxeo.dto.PracticeDetailDto;
import cz.osu.praxeo.dto.PracticesDto;
import cz.osu.praxeo.entity.PracticeDetail;
import cz.osu.praxeo.entity.Practices;
import cz.osu.praxeo.mapper.PracticesMapper;
import cz.osu.praxeo.mapper.UserMapper;
import cz.osu.praxeo.service.PracticesService;
import cz.osu.praxeo.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/practices")
@RequiredArgsConstructor
public class PracticesController {

    private final PracticesService practicesService;

    private final PracticesMapper practicesMapper;
    private final PracticeDetailRepository practiceDetailRepository;

    @PostMapping("/practices-by-role")
    public ResponseEntity<?> getPracticesByRole() {
        List<PracticesDto> list = practicesService.getPracticesByRole();
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPracticeDetail(@PathVariable Long id) {
        PracticeDetailDto detail = practicesService.getPracticeDetail(id);
        return ResponseEntity.ok(detail);
    }
}
