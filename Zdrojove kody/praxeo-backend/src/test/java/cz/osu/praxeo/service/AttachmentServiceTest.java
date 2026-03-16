package cz.osu.praxeo.service;

import cz.osu.praxeo.dao.AttachmentDataRepository;
import cz.osu.praxeo.dao.AttachmentRepository;
import cz.osu.praxeo.dao.PracticesRepository;
import cz.osu.praxeo.dto.AttachmentDto;
import cz.osu.praxeo.entity.*;
import cz.osu.praxeo.mapper.AttachmentMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("AttachmentServiceTest")
class AttachmentServiceTest {

    @Mock
    private AttachmentRepository attachmentRepository;

    @Mock
    private AttachmentDataRepository attachmentDataRepository;

    @Mock
    private PracticesRepository practicesRepository;

    @Mock
    private UserService userService;

    private AttachmentMapper attachmentMapper;

    private AttachmentService attachmentService;

    @BeforeEach
    void setUp() {
        attachmentMapper = new AttachmentMapper();
        attachmentService = new AttachmentService(
                attachmentRepository,
                attachmentDataRepository,
                attachmentMapper,
                practicesRepository,
                userService
        );
    }

    private Practices makePractice(Long id) {
        Practices p = new Practices();
        p.setId(id);
        return p;
    }

    private User makeUser(Long id, String email) {
        User u = new User();
        u.setId(id);
        u.setEmail(email);
        return u;
    }

    private Attachment makeAttachment(Long id, String title, String fileType, long fileSize, User uploadedBy) {
        Attachment a = new Attachment();
        a.setId(id);
        a.setTitle(title);
        a.setFileType(fileType);
        a.setFileSize(fileSize);
        a.setUploadedBy(uploadedBy);
        return a;
    }

    //  getAttachmentsForPractice

    @Test
    @DisplayName("getAttachmentsForPractice – vrací správně namapované DTO")
    void getAttachmentsForPractice_returnsMappedDtos() {
        User uploader = makeUser(5L, "ucitel@osu.cz");
        Attachment attachment = makeAttachment(1L, "dokument.pdf", "application/pdf", 100L, uploader);

        when(attachmentRepository.findByPracticeId(10L)).thenReturn(List.of(attachment));

        List<AttachmentDto> result = attachmentService.getAttachmentsForPractice(10L);

        assertEquals(1, result.size());
        AttachmentDto dto = result.get(0);
        assertEquals(1L, dto.getId());
        assertEquals("dokument.pdf", dto.getTitle());
        assertEquals("application/pdf", dto.getFileType());
        assertEquals(100L, dto.getFileSize());
        assertEquals(5L, dto.getUploadedById());
        verify(attachmentRepository).findByPracticeId(10L);
    }

    @Test
    @DisplayName("getAttachmentsForPractice – příloha bez uploadedBy má uploadedById null")
    void getAttachmentsForPractice_attachmentWithoutUploader_uploaderIdIsNull() {
        Attachment attachment = makeAttachment(1L, "soubor.txt", "text/plain", 50L, null);

        when(attachmentRepository.findByPracticeId(10L)).thenReturn(List.of(attachment));

        List<AttachmentDto> result = attachmentService.getAttachmentsForPractice(10L);

        assertNull(result.get(0).getUploadedById());
    }

    @Test
    @DisplayName("getAttachmentsForPractice – prázdný seznam")
    void getAttachmentsForPractice_noPractices_returnsEmptyList() {
        when(attachmentRepository.findByPracticeId(99L)).thenReturn(List.of());

        List<AttachmentDto> result = attachmentService.getAttachmentsForPractice(99L);

        assertTrue(result.isEmpty());
    }

    // uploadAttachment

    @Test
    @DisplayName("uploadAttachment – platný soubor uloží metadata a data, vrátí správné DTO")
    void uploadAttachment_validFile_savesAndReturnsMappedDto() throws IOException {
        MultipartFile file = new MockMultipartFile(
                "file", "report.pdf", "application/pdf", "obsah".getBytes()
        );
        Practices practice = makePractice(1L);
        User user = makeUser(1L, "student@osu.cz");

        when(practicesRepository.findById(1L)).thenReturn(Optional.of(practice));
        when(userService.getCurrentUser()).thenReturn(user);
        when(attachmentRepository.save(any(Attachment.class))).thenAnswer(inv -> inv.getArgument(0));

        AttachmentDto result = attachmentService.uploadAttachment(1L, file);

        assertNotNull(result);
        assertEquals("report.pdf", result.getTitle());
        assertEquals("application/pdf", result.getFileType());
        assertEquals(5L, result.getFileSize());
        assertEquals(1L, result.getUploadedById());
        verify(attachmentRepository).save(any(Attachment.class));
        verify(attachmentDataRepository).save(any(AttachmentData.class));
    }

    @Test
    @DisplayName("uploadAttachment – ukládá správná metadata ze souboru")
    void uploadAttachment_setsCorrectMetadata() throws IOException {
        MultipartFile file = new MockMultipartFile(
                "file", "obrazek.png", "image/png", new byte[256]
        );
        Practices practice = makePractice(1L);
        User user = makeUser(2L, "ucitel@osu.cz");

        when(practicesRepository.findById(1L)).thenReturn(Optional.of(practice));
        when(userService.getCurrentUser()).thenReturn(user);
        when(attachmentRepository.save(any(Attachment.class))).thenAnswer(inv -> inv.getArgument(0));

        attachmentService.uploadAttachment(1L, file);

        ArgumentCaptor<Attachment> captor = ArgumentCaptor.forClass(Attachment.class);
        verify(attachmentRepository).save(captor.capture());
        Attachment saved = captor.getValue();

        assertEquals("obrazek.png", saved.getTitle());
        assertEquals("image/png", saved.getFileType());
        assertEquals(256L, saved.getFileSize());
        assertEquals(user, saved.getUploadedBy());
        assertEquals(practice, saved.getPractice());
        assertNull(saved.getUrl());
    }

    @Test
    @DisplayName("uploadAttachment – praxe neexistuje, vyhodí výjimku")
    void uploadAttachment_practiceNotFound_throwsException() {
        MultipartFile file = new MockMultipartFile(
                "file", "file.txt", "text/plain", "data".getBytes()
        );
        when(practicesRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> attachmentService.uploadAttachment(999L, file));
        verify(attachmentRepository, never()).save(any());
        verify(attachmentDataRepository, never()).save(any());
    }

    //  getFileData

    @Test
    @DisplayName("getFileData – existující data vrátí bajty")
    void getFileData_existingAttachment_returnsBytes() {
        AttachmentData data = new AttachmentData();
        data.setFileData("obsah souboru".getBytes());

        when(attachmentDataRepository.findById(1L)).thenReturn(Optional.of(data));

        byte[] result = attachmentService.getFileData(1L);

        assertArrayEquals("obsah souboru".getBytes(), result);
    }

    @Test
    @DisplayName("getFileData – neexistující data vyhodí výjimku")
    void getFileData_notFound_throwsException() {
        when(attachmentDataRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> attachmentService.getFileData(999L));
    }

    // deleteAttachment

    @Test
    @DisplayName("deleteAttachment – existující příloha se smaže a vrátí true")
    void deleteAttachment_existingId_deletesAndReturnsTrue() {
        when(attachmentRepository.existsById(1L)).thenReturn(true);

        boolean result = attachmentService.deleteAttachment(1L);

        assertTrue(result);
        verify(attachmentRepository).deleteById(1L);
    }

    @Test
    @DisplayName("deleteAttachment – neexistující příloha vrátí false")
    void deleteAttachment_nonExistingId_returnsFalse() {
        when(attachmentRepository.existsById(999L)).thenReturn(false);

        boolean result = attachmentService.deleteAttachment(999L);

        assertFalse(result);
        verify(attachmentRepository, never()).deleteById(any());
    }

    // getAttachmentEntity

    @Test
    @DisplayName("getAttachmentEntity – existující příloha vrátí entitu se správnými daty")
    void getAttachmentEntity_existingId_returnsAttachment() {
        User uploader = makeUser(1L, "student@osu.cz");
        Attachment attachment = makeAttachment(1L, "soubor.docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", 2048L, uploader);

        when(attachmentRepository.findById(1L)).thenReturn(Optional.of(attachment));

        Attachment result = attachmentService.getAttachmentEntity(1L);

        assertNotNull(result);
        assertEquals("soubor.docx", result.getTitle());
        assertEquals(2048L, result.getFileSize());
        assertEquals(uploader, result.getUploadedBy());
    }

    @Test
    @DisplayName("getAttachmentEntity – neexistující příloha vyhodí výjimku")
    void getAttachmentEntity_notFound_throwsException() {
        when(attachmentRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> attachmentService.getAttachmentEntity(999L));
    }
}