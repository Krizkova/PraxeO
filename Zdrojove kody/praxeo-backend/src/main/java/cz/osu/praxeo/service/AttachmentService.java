package cz.osu.praxeo.service;

import cz.osu.praxeo.dao.AttachmentRepository;
import cz.osu.praxeo.dao.PracticeDetailRepository;
import cz.osu.praxeo.dto.AttachmentDto;
import cz.osu.praxeo.entity.Attachment;
import cz.osu.praxeo.entity.PracticeDetail;
import cz.osu.praxeo.entity.User;
import cz.osu.praxeo.mapper.AttachmentMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AttachmentService {

    private final AttachmentRepository attachmentRepository;
    private final PracticeDetailRepository practiceDetailRepository;
    private final AttachmentMapper attachmentMapper;
    private final UserService userService;

    public List<AttachmentDto> getAttachmentsForPractice(Long practiceDetailId) {
       /* return attachmentRepository.findByPracticeDetailId(practiceDetailId)
                .stream()
                .map(attachmentMapper::toDto)
                .toList();*/
        return attachmentRepository.findByPracticeDetailId(practiceDetailId);
    }

    @Transactional
    public AttachmentDto uploadAttachment(Long practiceDetailId, MultipartFile file) throws IOException {
        PracticeDetail detail = practiceDetailRepository.findById(practiceDetailId).orElse(null);
        if (detail == null) return null;

        User user = userService.getCurrentUser();

        Attachment a = new Attachment();
        a.setPracticeDetail(detail);
        a.setUploadedBy(user);
        a.setTitle(file.getOriginalFilename());
        a.setFileType(file.getContentType());
        a.setFileSize(file.getSize());
        a.setFileData(file.getBytes());
        a.setUrl(null);

        attachmentRepository.save(a);
        return attachmentMapper.toDto(a);
    }

    public boolean deleteAttachment(Long id) {
        if (!attachmentRepository.existsById(id)) return false;
        attachmentRepository.deleteById(id);
        return true;
    }

    @Transactional(readOnly = true)
    public Attachment getAttachmentEntity(Long id) {
        return attachmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Attachment not found"));
    }
}
