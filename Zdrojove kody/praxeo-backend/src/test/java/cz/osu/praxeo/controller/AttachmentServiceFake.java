package cz.osu.praxeo.controller;

import cz.osu.praxeo.dto.AttachmentDto;
import cz.osu.praxeo.entity.Attachment;
import cz.osu.praxeo.service.AttachmentService;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

class AttachmentServiceFake extends AttachmentService {

    AttachmentServiceFake() {
        super(null, null, null, null);
    }

    @Override
    public AttachmentDto uploadAttachment(Long practiceDetailId, MultipartFile file) throws IOException {
        return new AttachmentDto(1L, file.getOriginalFilename(), "/fake/url",
                file.getContentType(), file.getSize(), 5L);
    }

    @Override
    public List<AttachmentDto> getAttachmentsForPractice(Long practiceDetailId) {
        if (practiceDetailId == 0L) {
            return List.of();
        }
        return List.of(new AttachmentDto(1L, "file.txt", "/fake/url",
                "text/plain", 10L, 5L));
    }

    @Override
    public boolean deleteAttachment(Long id) {
        return id == 1L;
    }

    @Override
    public Attachment getAttachmentEntity(Long id) {
        if (id == 999L) {
            throw new RuntimeException("Attachment not found");
        }
        Attachment a = new Attachment();
        a.setId(id);
        a.setTitle("soubor.txt");
        a.setFileType("text/plain");
        a.setFileData("data".getBytes());
        return a;
    }

}
