package cz.osu.praxeo.controller;

import cz.osu.praxeo.dto.AttachmentDto;
import cz.osu.praxeo.entity.Attachment;
import cz.osu.praxeo.service.AttachmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;

@RestController
@RequestMapping("/api/attachments")
@RequiredArgsConstructor
public class AttachmentsController {

    private final AttachmentService attachmentService;

    @GetMapping("/by-practice/{id}")
    public ResponseEntity<?> getAttachments(@PathVariable Long id) {
        List<AttachmentDto> list = attachmentService.getAttachmentsForPractice(id);
        return ResponseEntity.ok(list);
    }

    @PostMapping("/upload/{practiceDetailId}")
    public ResponseEntity<?> upload(@PathVariable Long practiceDetailId,
                                    @RequestParam("file") MultipartFile file) throws IOException {

        if (file == null || file.isEmpty()) {
            return ResponseEntity.badRequest().body("Soubor nesmí být prázdný");
        }

        AttachmentDto dto = attachmentService.uploadAttachment(practiceDetailId, file);
        return ResponseEntity.ok(dto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        boolean ok = attachmentService.deleteAttachment(id);
        return ok ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<byte[]> download(@PathVariable Long id) {
        Attachment a = attachmentService.getAttachmentEntity(id);

        String filename = URLEncoder.encode(a.getTitle(), StandardCharsets.UTF_8);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.parseMediaType(a.getFileType()))
                .body(a.getFileData());
    }
}
