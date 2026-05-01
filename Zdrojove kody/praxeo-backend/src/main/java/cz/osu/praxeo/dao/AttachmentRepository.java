package cz.osu.praxeo.dao;

import cz.osu.praxeo.entity.Attachment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AttachmentRepository extends JpaRepository<Attachment, Long> {

    List<Attachment> findByPracticeId(Long practiceId);

    List<Attachment> findByTaskId(Long taskId);

    // Vrací pouze přílohy praxe bez souborů tasků
    List<Attachment> findByPracticeIdAndTaskIsNull(Long practiceId);

}