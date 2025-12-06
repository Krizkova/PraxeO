package cz.osu.praxeo.mapper;

import cz.osu.praxeo.dto.PracticesDto;
import cz.osu.praxeo.dto.UserDto;
import cz.osu.praxeo.entity.Practices;
import cz.osu.praxeo.entity.User;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class PracticesMapper {

    public PracticesDto toDto(Practices practices) {
        PracticesDto dto = new PracticesDto();
        dto.setId(practices.getId());
        dto.setName(practices.getName());
        dto.setDescription(practices.getDescription());
        dto.setCompanyName(practices.getFounder() != null ? practices.getFounder().getCompanyName() : null);
        dto.setValidFrom(practices.getValidFrom() != null ? practices.getValidFrom().toString() : null);
        dto.setValidTo(practices.getValidTo() != null ? practices.getValidTo().toString() : null);
        dto.setFounderEmail(practices.getFounder() != null ? practices.getFounder().getEmail() : null);
        dto.setStudentEmail(practices.getStudent() != null ? practices.getStudent().getEmail() : null);
        return dto;
    }

}
