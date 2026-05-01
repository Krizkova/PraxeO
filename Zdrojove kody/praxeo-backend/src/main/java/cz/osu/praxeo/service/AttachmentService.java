package cz.osu.praxeo.service;

import cz.osu.praxeo.dao.AttachmentDataRepository;
import cz.osu.praxeo.dao.AttachmentRepository;
import cz.osu.praxeo.dao.PracticesRepository;
import cz.osu.praxeo.dao.TaskRepository;
import cz.osu.praxeo.dto.AttachmentDto;
import cz.osu.praxeo.entity.Attachment;
import cz.osu.praxeo.entity.AttachmentData;
import cz.osu.praxeo.entity.Practices;
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
    private final AttachmentDataRepository attachmentDataRepository;
    private final AttachmentMapper attachmentMapper;
    private final PracticesRepository practicesRepository;
    private final TaskRepository taskRepository;
    private final UserService userService;

    @Transactional(readOnly = true)
    public List<AttachmentDto> getAttachmentsForPractice(Long practiceId) {
        // Vrací pouze přílohy praxe — soubory tasků jsou zobrazeny v kartě tasku
        return attachmentRepository.findByPracticeIdAndTaskIsNull(practiceId)
                .stream()
                .map(attachmentMapper::toDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<AttachmentDto> getAttachmentsForTask(Long taskId) {
        return attachmentRepository.findByTaskId(taskId)
                .stream()
                .map(attachmentMapper::toDto)
                .toList();
    }

    @Transactional
    public AttachmentDto uploadAttachment(Long practiceId, Long taskId, MultipartFile file) throws IOException {
        Practices practice = practicesRepository.findById(practiceId)
                .orElseThrow(() -> new RuntimeException("Praxe nenalezena"));

        User user = userService.getCurrentUser();
        Attachment attachment = new Attachment();
        attachment.setPractice(practice);

        if (taskId != null) {
                cz.osu.praxeo.entity.Task task = taskRepository.findById(taskId)
                    .orElseThrow(() -> new RuntimeException("Task nenalezen"));
            attachment.setTask(task);
        }

        attachment.setUploadedBy(user);
        attachment.setTitle(file.getOriginalFilename());
        attachment.setFileType(file.getContentType());
        attachment.setFileSize(file.getSize());
        attachment.setUrl(null);
        attachmentRepository.save(attachment);

        AttachmentData data = new AttachmentData();
        data.setAttachment(attachment);
        data.setFileData(file.getBytes());
        attachmentDataRepository.save(data);

        return attachmentMapper.toDto(attachment);
    }

    @Transactional(readOnly = true)
    public byte[] getFileData(Long attachmentId) {

        AttachmentData data = attachmentDataRepository.findById(attachmentId)
                .orElseThrow(() -> new RuntimeException("File data neexistuji"));

        return data.getFileData();
    }

    @Transactional
    public boolean deleteAttachment(Long id) {
        if (!attachmentRepository.existsById(id)) return false;
        attachmentRepository.deleteById(id);
        return true;
    }

    @Transactional(readOnly = true)
    public Attachment getAttachmentEntity(Long id) {
        return attachmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Priloha neexistuje"));
    }
}
