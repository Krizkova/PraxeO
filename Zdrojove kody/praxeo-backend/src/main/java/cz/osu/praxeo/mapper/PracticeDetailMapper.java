package cz.osu.praxeo.mapper;

import cz.osu.praxeo.dto.PracticeDetailDto;
import cz.osu.praxeo.entity.PracticeDetail;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class PracticeDetailMapper{

    private final PracticesMapper practicesMapper;

    public PracticeDetailDto toDto(PracticeDetail detail) {
        PracticeDetailDto dto = new PracticeDetailDto();
        dto.setId(detail.getId());
        dto.setPractice(practicesMapper.toDto(detail.getPractice()));
        dto.setFinalEvaluation(detail.getFinalEvaluation());
        dto.setClosed(detail.isClosed());
        dto.setMarkedForExport(detail.isMarkedForExport());
        return dto;
    }

}
