package cz.osu.praxeo.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "attachment_data")
public class AttachmentData {

    @Id
    private Long id;

    @MapsId
    @OneToOne
    @JoinColumn(name = "attachment_id")
    private Attachment attachment;

    @Lob
    @Basic(fetch = FetchType.LAZY)
    @Column(name = "file_data")
    private byte[] fileData;
}
