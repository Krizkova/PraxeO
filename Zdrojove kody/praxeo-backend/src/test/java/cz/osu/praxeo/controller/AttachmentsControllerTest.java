package cz.osu.praxeo.controller;

import cz.osu.praxeo.dto.AttachmentDto;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.junit.jupiter.api.MethodOrderer;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;


@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class AttachmentsControllerTest {
    private final AttachmentServiceFake attachmentService = new AttachmentServiceFake();
    private final AttachmentsController controller = new AttachmentsController(attachmentService);

    @Test
    @Order(1)
    @DisplayName("POST /api/attachments/upload/{practiceDetailId} – úspěšné nahrání souboru")
    void upload_ok() throws Exception {
        MultipartFile mf = new MockMultipartFile(
                    "file", "test.txt", "text/plain", "abc".getBytes()
        );


        ResponseEntity<?> response = controller.upload(10L, mf);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        AttachmentDto body = (AttachmentDto) response.getBody();
        assertNotNull(body);
        assertEquals("test.txt", body.getTitle());
    }

    @Test
    @Order(2)
    @DisplayName("GET /api/attachments/by-practice/{id} – vrátí seznam příloh")
    void getAttachments_ok() {
        ResponseEntity<?> response = controller.getAttachments(100L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        List<?> body = (List<?>) response.getBody();
        assertEquals(1, body.size());
    }

    @Test
    @Order(3)
    @DisplayName("DELETE /api/attachments/{id} – úspěšné smazání")
    void delete_found() {
        ResponseEntity<?> response = controller.delete(1L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    @Order(4)
    @DisplayName("DELETE /api/attachments/{id} – příloha nenalezena")
    void delete_notFound() {
        ResponseEntity<?> response = controller.delete(2L);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    @Order(5)
    @DisplayName("GET /api/attachments/{id}/download – úspěšné stažení souboru")
    void download_ok() {
        ResponseEntity<byte[]> response = controller.download(5L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertArrayEquals("data".getBytes(), response.getBody());
        String cd = response.getHeaders().getFirst(HttpHeaders.CONTENT_DISPOSITION);
        assertNotNull(cd);
        assertTrue(cd.contains("soubor.txt"));
        assertEquals("text/plain", response.getHeaders().getContentType().toString());
    }

    @Test
    @Order(6)
    @DisplayName("POST /api/attachments/upload/{practiceDetailId} – prázdný soubor")
    void upload_emptyFile() throws Exception {
        MultipartFile mf = new MockMultipartFile(
                "file", "empty.txt", "text/plain", new byte[0]
        );

        ResponseEntity<?> response = controller.upload(10L, mf);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().toString().toLowerCase().contains("soubor"));
    }

    @Test
    @Order(7)
    @DisplayName("POST /api/attachments/upload/{practiceDetailId} – null soubor")
    void upload_nullFile() throws Exception {
        ResponseEntity<?> response = controller.upload(10L, null);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

}
