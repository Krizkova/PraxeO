package cz.osu.praxeo.dao;

import cz.osu.praxeo.entity.Attachment;
import cz.osu.praxeo.entity.PracticeDetail;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PracticeDetailRepository extends JpaRepository<PracticeDetail, Long> {

}

