package cz.osu.praxeo.dao;

import cz.osu.praxeo.entity.Attachment;
import cz.osu.praxeo.entity.AttachmentData;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AttachmentDataRepository extends JpaRepository<AttachmentData, Long> {


}
