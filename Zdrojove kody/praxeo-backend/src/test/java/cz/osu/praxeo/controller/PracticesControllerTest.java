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
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.context.ActiveProfiles;

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


    private void setAuthenticatedUser(User user) {
        var auth = new UsernamePasswordAuthenticationToken(
                user, null, user.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(auth);
    }

    @Test
    @Order(1)
    @DisplayName("ADMIN – vrátí všechny praxe")
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
        admin.setPassword("x");
        userRepository.save(admin);

        setAuthenticatedUser(admin);

        ResponseEntity<?> response = practicesController.getPracticesByRole();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        List<?> list = (List<?>) response.getBody();
        assertNotNull(list);
        assertEquals(2, list.size());
    }

    @Test
    @Order(2)
    @DisplayName("STUDENT s přiřazenými praxemi – vrátí jen svoje")
    void getPracticesByRole_studentAssigned() {
        User student = new User();
        student.setEmail("student@osu.cz");
        student.setRole(Role.STUDENT);
        student.setPassword("x");
        userRepository.save(student);

        Practices assigned = new Practices();
        assigned.setName("Assigned");
        assigned.setStudent(student);
        practicesRepository.save(assigned);

        Practices free = new Practices();
        free.setName("Free");
        practicesRepository.save(free);

        setAuthenticatedUser(student);

        ResponseEntity<?> response = practicesController.getPracticesByRole();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        List<?> list = (List<?>) response.getBody();
        assertNotNull(list);
        assertEquals(1, list.size());
    }

    @Test
    @Order(3)
    @DisplayName("STUDENT bez přiřazených – vrátí volné praxe")
    void getPracticesByRole_studentNoAssigned() {
        User student = new User();
        student.setEmail("student2@osu.cz");
        student.setRole(Role.STUDENT);
        student.setPassword("x");
        userRepository.save(student);

        Practices free1 = new Practices();
        free1.setName("Free 1");
        practicesRepository.save(free1);

        setAuthenticatedUser(student);

        ResponseEntity<?> response = practicesController.getPracticesByRole();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        List<?> list = (List<?>) response.getBody();
        assertNotNull(list);
        assertEquals(1, list.size());
    }

    @Test
    @Order(4)
    @DisplayName("Externista– vrátí jen svoje praxe")
    void getPracticesByRole_externalWorker() {
        User founder = new User();
        founder.setEmail("ext@osu.cz");
        founder.setRole(Role.EXTERNAL_WORKER);
        founder.setPassword("x");
        userRepository.save(founder);

        Practices own = new Practices();
        own.setName("Own");
        own.setFounder(founder);
        practicesRepository.save(own);

        Practices other = new Practices();
        other.setName("Other");
        practicesRepository.save(other);

        setAuthenticatedUser(founder);

        ResponseEntity<?> response = practicesController.getPracticesByRole();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        List<?> list = (List<?>) response.getBody();
        assertNotNull(list);
        assertEquals(1, list.size());
    }

    @Test
    @Order(5)
    @DisplayName("ADMIN – prázdný seznam")
    void getPracticesByRole_noPractices() {
        User admin = new User();
        admin.setEmail("admin-empty@osu.cz");
        admin.setRole(Role.ADMIN);
        admin.setPassword("x");
        userRepository.save(admin);

        setAuthenticatedUser(admin);

        ResponseEntity<?> response = practicesController.getPracticesByRole();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        List<?> list = (List<?>) response.getBody();
        assertNotNull(list);
        assertTrue(list.isEmpty());
    }

    @Test
    @Order(6)
    @DisplayName("TEACHER – vrátí všechny praxe")
    void getPracticesByRole_teacher() {
        User teacher = new User();
        teacher.setEmail("teacher@osu.cz");
        teacher.setRole(Role.TEACHER);
        teacher.setPassword("x");
        userRepository.save(teacher);

        Practices p = new Practices();
        p.setName("Praxe teacher");
        practicesRepository.save(p);

        setAuthenticatedUser(teacher);

        ResponseEntity<?> response = practicesController.getPracticesByRole();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        List<?> list = (List<?>) response.getBody();
        assertNotNull(list);
        assertEquals(1, list.size());
    }

    // ------- /api/practices/{id} -------

    @Test
    @Order(7)
    @DisplayName("GET /api/practices/{id} – neexistující detail")
    void getPracticeDetail_nonExistingThrows() {
        assertThrows(RuntimeException.class,
                () -> practicesController.getPracticeDetail(1L));
    }

    @AfterEach
    void cleanup() {
        SecurityContextHolder.clearContext();
        practicesRepository.deleteAll();
        userRepository.deleteAll();
    }
}