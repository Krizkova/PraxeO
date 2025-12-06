package cz.osu.praxeo.dao;

import cz.osu.praxeo.entity.Practices;
import cz.osu.praxeo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PracticesRepository extends JpaRepository<Practices, Long> {

    List<Practices> findByStudentIsNull();
    List<Practices> findByFounder(User founder);
    List<Practices> findByStudent(User user);
}
