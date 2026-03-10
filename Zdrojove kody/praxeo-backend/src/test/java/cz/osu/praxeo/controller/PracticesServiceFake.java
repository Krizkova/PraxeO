package cz.osu.praxeo.controller;

import cz.osu.praxeo.dto.PracticesDto;
import cz.osu.praxeo.service.PracticesService;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class PracticesServiceFake extends PracticesService {

    private Long throwId = null;
    private boolean throwInvalidState = false;

    public PracticesServiceFake() {
        super(null, null, null);
    }

    public void setThrowExceptionForId(Long id) {
        this.throwId = id;
    }

    public void setThrowInvalidState() {
        this.throwInvalidState = true;
    }

    @Override
    public List<PracticesDto> getPracticesByRole() {
        PracticesDto dto1 = createFakeDto(1L, "Praxe 1", "Popis praxe 1");
        PracticesDto dto2 = createFakeDto(2L, "Praxe 2", "Popis praxe 2");
        return List.of(dto1, dto2);
    }

    @Override
    public PracticesDto getPracticeById(Long id) {
        if (throwId != null && throwId.equals(id)) {
            throw new RuntimeException("Praxe neexistuje");
        }
        return createFakeDto(id, "Praxe " + id, "Detail praxe " + id);
    }

    @Override
    public PracticesDto updatePractice(Long id, PracticesDto request) {
        if (throwId != null && throwId.equals(id)) {
            throw new RuntimeException("Praxe neexistuje");
        }
        return createFakeDto(id,
                request.getName() != null ? request.getName() : "Updated",
                request.getDescription() != null ? request.getDescription() : "Updated");
    }

    @Override
    public PracticesDto createPractice(String name, String description, LocalDate completedAt) {
        return createFakeDto(10L,
                name != null ? name : "Nová praxe",
                description != null ? description : "Nový popis");
    }

    @Override
    public PracticesDto changePracticeState(Long id, String newState) {
        if (throwInvalidState && !"CANCELED".equals(newState) && !"COMPLETED".equals(newState)) {
            throw new RuntimeException("Neplatný stav");
        }
        PracticesDto dto = createFakeDto(id, "Praxe " + id, "Stav změněn na: " + newState);
        dto.setState(newState);
        return dto;
    }

    private PracticesDto createFakeDto(Long id, String name, String description) {
        PracticesDto dto = new PracticesDto();
        dto.setId(id);
        dto.setName(name);
        dto.setDescription(description);
        dto.setCreatedAt(LocalDateTime.now().minusDays(1));
        dto.setState("ACTIVE");
        dto.setFounderEmail("zakladatel@test.cz");
        dto.setStudentEmail("student@test.cz");
        dto.setCanEditFounderFields(true);
        dto.setCanEditStudentFields(false);
        dto.setCanUploadAttachments(true);
        dto.setCanEditTasks(true);
        dto.setCanEditFinalEvaluation(false);
        dto.setCanChangeState(true);
        dto.setClosed(false);
        return dto;
    }
}
