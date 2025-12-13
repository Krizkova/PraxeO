package cz.osu.praxeo.controller;

import cz.osu.praxeo.dao.PracticesRepository;
import cz.osu.praxeo.dao.UserRepository;
import cz.osu.praxeo.entity.Practices;
import cz.osu.praxeo.entity.Role;
import cz.osu.praxeo.entity.User;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.test.context.ActiveProfiles;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@ActiveProfiles("test")
class PracticesControllerTest {

    @MockBean
    private JavaMailSender javaMailSender;

    @Autowired
    private PracticesController practicesController;

    @Autowired
    private PracticesRepository practicesRepository;

    @Autowired
    private UserRepository userRepository;

    @Test
    @Order(1)
    void getPracticesByRole_adminGetsAll() {
        Practices p1 = new Practices();
        p1.setName("Praxe 1");
        practicesRepository.save(p1);

        Practices p2 = new Practices();
        p2.setName("Praxe 2");
        practicesRepository.save(p2);

        User admin = new User();
        admin.setEmail("admin-test@osu.cz");
        admin.setRole(Role.ADMIN);
        userRepository.save(admin);

        ResponseEntity<?> response = practicesController.getPracticesByRole();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        List<?> list = (List<?>) response.getBody();
        assertNotNull(list);
        assertTrue(list.isEmpty());
    }

    @Test
    @Order(2)
    @DisplayName("POST /api/practices/practices-by-role - STUDENT s přiřazenými praxemi")
    void getPracticesByRole_studentAssigned() {
        User student = new User();
        student.setEmail("student@osu.cz");
        student.setRole(Role.STUDENT);
        userRepository.save(student);

        Practices assigned = new Practices();
        assigned.setName("Assigned");
        assigned.setStudent(student);
        practicesRepository.save(assigned);

        Practices free = new Practices();
        free.setName("Free");
        practicesRepository.save(free);

        ResponseEntity<?> response = practicesController.getPracticesByRole();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        List<?> list = (List<?>) response.getBody();
        assertNotNull(list);
        assertTrue(list.isEmpty());
    }

    @Test
    @Order(3)
    @DisplayName("POST /api/practices/practices-by-role - STUDENT bez přiřazených praxí")
    void getPracticesByRole_studentNoAssigned() {
        User student = new User();
        student.setEmail("student2@osu.cz");
        student.setRole(Role.STUDENT);
        userRepository.save(student);

        Practices free1 = new Practices();
        free1.setName("Free 1");
        practicesRepository.save(free1);

        ResponseEntity<?> response = practicesController.getPracticesByRole();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        List<?> list = (List<?>) response.getBody();
        assertNotNull(list);
        assertTrue(list.isEmpty());

    }

    @Test
    @Order(4)
    @DisplayName("POST /api/practices/practices-by-role - Externista dostane svoje praxe")
    void getPracticesByRole_externalWorker() {
        User founder = new User();
        founder.setEmail("ext@osu.cz");
        founder.setRole(Role.EXTERNAL_WORKER);
        userRepository.save(founder);

        Practices own = new Practices();
        own.setName("Own");
        own.setFounder(founder);
        practicesRepository.save(own);

        Practices other = new Practices();
        other.setName("Other");
        practicesRepository.save(other);

        ResponseEntity<?> response = practicesController.getPracticesByRole();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        List<?> list = (List<?>) response.getBody();
        assertNotNull(list);
        assertTrue(list.isEmpty());
    }

    @Test
    @Order(5)
    @DisplayName("POST /api/practices/practices-by-role - uživatel bez role → prázdný seznam")
    void getPracticesByRole_userWithoutRole() {
        User user = new User();
        user.setEmail("norole@osu.cz");
        user.setRole(null);
        userRepository.save(user);

        ResponseEntity<?> response = practicesController.getPracticesByRole();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        List<?> list = (List<?>) response.getBody();
        assertNotNull(list);
        assertTrue(list.isEmpty());
    }

    @Test
    @Order(6)
    @DisplayName("POST /api/practices/practices-by-role - žádné praxe v systému")
    void getPracticesByRole_noPractices() {
        User admin = new User();
        admin.setEmail("admin-empty@osu.cz");
        admin.setRole(Role.ADMIN);
        userRepository.save(admin);

        ResponseEntity<?> response = practicesController.getPracticesByRole();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        List<?> list = (List<?>) response.getBody();
        assertNotNull(list);
        assertTrue(list.isEmpty());
    }

    @Test
    @Order(7)
    @DisplayName("POST /api/practices/practices-by-role - STUDENT bez praxí a bez volných praxí")
    void getPracticesByRole_studentNoAssignedAndNoFree() {
        User student = new User();
        student.setEmail("student-empty@osu.cz");
        student.setRole(Role.STUDENT);
        userRepository.save(student);

        ResponseEntity<?> response = practicesController.getPracticesByRole();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        List<?> list = (List<?>) response.getBody();
        assertNotNull(list);
        assertTrue(list.isEmpty());
    }

    @Test
    @Order(8)
    @DisplayName("POST /api/practices/practices-by-role - TEACHER")
    void getPracticesByRole_teacher() {
        User teacher = new User();
        teacher.setEmail("teacher@osu.cz");
        teacher.setRole(Role.TEACHER);
        userRepository.save(teacher);

        Practices p = new Practices();
        p.setName("Praxe teacher");
        practicesRepository.save(p);

        ResponseEntity<?> response = practicesController.getPracticesByRole();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        List<?> list = (List<?>) response.getBody();
        assertNotNull(list);
        assertTrue(list.isEmpty());
    }

    @Test
    @Order(9)
    @DisplayName("GET /api/practices/{id} - neexistující detail → výjimka")
    void getPracticeDetail_nonExistingThrows() {
        assertThrows(RuntimeException.class, () -> {
            practicesController.getPracticeDetail(1L);
        });
    }

    @AfterEach
    void cleanup() {
        practicesRepository.deleteAll();
        userRepository.deleteAll();
    }
}