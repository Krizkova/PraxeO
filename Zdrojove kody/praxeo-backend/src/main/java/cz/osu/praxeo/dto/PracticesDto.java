package cz.osu.praxeo.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PracticesDto {
    private Long id;
    private String name;
    private String description;
    private String companyName;
    private String validFrom;
    private String validTo;
    private String founderEmail;
    private String studentEmail;
}
