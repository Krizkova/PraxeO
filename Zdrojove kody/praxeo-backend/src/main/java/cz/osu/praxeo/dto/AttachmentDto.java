package cz.osu.praxeo.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AttachmentDto {
    private Long id;
    private String title;
    private String url;
    private String fileType;
    private Long fileSize;
    private Long uploadedById;
}