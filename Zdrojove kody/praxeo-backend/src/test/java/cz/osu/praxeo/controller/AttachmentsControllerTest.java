package cz.osu.praxeo.controller;

import cz.osu.praxeo.dto.AttachmentDto;
import cz.osu.praxeo.entity.Attachment;
import cz.osu.praxeo.service.AttachmentService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import java.nio.charset.StandardCharsets;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("AttachmentsControllerTest")
class AttachmentsControllerTest {

    @Mock
    private AttachmentService attachmentService;

    @InjectMocks
    private AttachmentsController controller;

    private MultipartFile testFile;

    @BeforeEach
    void setUp() {
        testFile = new MockMultipartFile(
                "file", "test.txt", "text/plain", "hello".getBytes()
        );
    }

    // getAttachments

    @DisplayName("getAttachments – praxe má přílohy")
    @Test
    void getAttachments_success_returnsOkWithList() {
        AttachmentDto dto = new AttachmentDto(1L, "test.txt", null, "text/plain", 5L, 42L);
        when(attachmentService.getAttachmentsForPractice(123L)).thenReturn(List.of(dto));

        ResponseEntity<?> response = controller.getAttachments(123L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(List.of(dto), response.getBody());
        verify(attachmentService).getAttachmentsForPractice(123L);
    }

    @DisplayName("getAttachments – praxe bez příloh")
    @Test
    void getAttachments_empty_returnsOkWithEmptyList() {
        when(attachmentService.getAttachmentsForPractice(123L)).thenReturn(List.of());

        ResponseEntity<?> response = controller.getAttachments(123L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(List.of(), response.getBody());
    }

    // upload

    @DisplayName("upload – platný soubor")
    @Test
    void upload_validFile_returnsOkWithDto() throws Exception {
        AttachmentDto dto = new AttachmentDto(1L, "test.txt", null, "text/plain", 5L, 10L);
        when(attachmentService.uploadAttachment(456L, testFile)).thenReturn(dto);

        ResponseEntity<?> response = controller.upload(456L, testFile);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(dto, response.getBody());
        verify(attachmentService).uploadAttachment(456L, testFile);
    }

    @DisplayName("upload – prázdný soubor")
    @Test
    void upload_emptyFile_returnsBadRequest() throws Exception {
        MultipartFile emptyFile = new MockMultipartFile(
                "file", "", "text/plain", new byte[0]
        );

        ResponseEntity<?> response = controller.upload(456L, emptyFile);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Soubor nesmí být prázdný", response.getBody());
        verifyNoInteractions(attachmentService);
    }

    @DisplayName("upload – null soubor")
    @Test
    void upload_nullFile_returnsBadRequest() throws Exception {
        ResponseEntity<?> response = controller.upload(456L, null);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Soubor nesmí být prázdný", response.getBody());
        verifyNoInteractions(attachmentService);
    }

    // delete

    @DisplayName("delete – existující příloha")
    @Test
    void delete_existingAttachment_returnsOk() {
        when(attachmentService.deleteAttachment(789L)).thenReturn(true);

        ResponseEntity<?> response = controller.delete(789L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNull(response.getBody());
        verify(attachmentService).deleteAttachment(789L);
    }

    @DisplayName("delete – neexistující příloha")
    @Test
    void delete_nonExistingAttachment_returnsNotFound() {
        when(attachmentService.deleteAttachment(999L)).thenReturn(false);

        ResponseEntity<?> response = controller.delete(999L);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        verify(attachmentService).deleteAttachment(999L);
    }

    // download

    @DisplayName("download – existující soubor + hlavičky")
    @Test
    void download_existingAttachment_returnsFileWithCorrectHeaders() {
        Attachment attachment = new Attachment();
        attachment.setId(1L);
        attachment.setTitle("soubor.txt");
        attachment.setFileType("text/plain");

        byte[] fileContent = "obsah souboru".getBytes(StandardCharsets.UTF_8);

        when(attachmentService.getAttachmentEntity(1L)).thenReturn(attachment);
        when(attachmentService.getFileData(1L)).thenReturn(fileContent);

        ResponseEntity<byte[]> response = controller.download(1L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertArrayEquals(fileContent, response.getBody());
        assertTrue(response.getHeaders()
                .getFirst(HttpHeaders.CONTENT_DISPOSITION)
                .contains("soubor.txt"));
        assertEquals(
                MediaType.parseMediaType("text/plain"),
                response.getHeaders().getContentType()
        );
        verify(attachmentService).getAttachmentEntity(1L);
        verify(attachmentService).getFileData(1L);
    }

    @DisplayName("download – diakritika v názvu")
    @Test
    void download_filenameIsUrlEncoded() {
        Attachment attachment = new Attachment();
        attachment.setId(2L);
        attachment.setTitle("příloha s mezerami.pdf");
        attachment.setFileType("application/pdf");

        when(attachmentService.getAttachmentEntity(2L)).thenReturn(attachment);
        when(attachmentService.getFileData(2L)).thenReturn(new byte[]{1, 2, 3});

        ResponseEntity<byte[]> response = controller.download(2L);

        String disposition = response.getHeaders().getFirst(HttpHeaders.CONTENT_DISPOSITION);
        assertFalse(disposition.contains("příloha s mezerami.pdf"));
        assertTrue(disposition.contains("p%C5%99%C3%ADloha"));
    }
}
