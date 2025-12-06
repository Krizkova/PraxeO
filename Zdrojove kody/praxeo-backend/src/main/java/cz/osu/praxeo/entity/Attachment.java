package cz.osu.praxeo.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "attachments")
public class Attachment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String url;

    @Lob
    @Column(name = "file_data")
    private byte[] fileData;

    private String fileType;

    private Long fileSize;

    @ManyToOne
    @JoinColumn(name = "uploaded_by")
    private User uploadedBy;

    @ManyToOne
    @JoinColumn(name = "practice_detail_id")
    private PracticeDetail practiceDetail;

    @ManyToOne
    @JoinColumn(name = "task_id")
    private Task task;
}

