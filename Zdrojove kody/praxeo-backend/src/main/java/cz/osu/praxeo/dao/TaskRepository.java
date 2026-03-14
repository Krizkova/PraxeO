package cz.osu.praxeo.dao;

import cz.osu.praxeo.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByPracticeId(Long practiceId);
}
