package cz.osu.praxeo.mapper;

import cz.osu.praxeo.dto.AttachmentDto;
import cz.osu.praxeo.entity.Attachment;
import org.springframework.stereotype.Component;

@Component
public class AttachmentMapper {

    public AttachmentDto toDto(Attachment a) {
        AttachmentDto dto = new AttachmentDto();
        dto.setId(a.getId());
        dto.setTitle(a.getTitle());
        dto.setUrl(a.getUrl());
        dto.setFileType(a.getFileType());
        dto.setFileSize(a.getFileSize());
        if (a.getUploadedBy() != null) dto.setUploadedById(a.getUploadedBy().getId());
        return dto;
    }
}