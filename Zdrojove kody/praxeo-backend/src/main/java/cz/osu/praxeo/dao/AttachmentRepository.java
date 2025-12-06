package cz.osu.praxeo.dao;

import cz.osu.praxeo.dto.AttachmentDto;
import cz.osu.praxeo.entity.Attachment;
import cz.osu.praxeo.entity.PracticeDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface AttachmentRepository extends JpaRepository<Attachment, Long> {

    @Query("""
    select new cz.osu.praxeo.dto.AttachmentDto(
        a.id,
        a.title,
        a.url,
        a.fileType,
        a.fileSize,
        a.uploadedBy.id
    )
    from Attachment a
    where a.practiceDetail.id = :id
""")
    List<AttachmentDto> findByPracticeDetailId(Long id);
}