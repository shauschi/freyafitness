package freya.fitness.api.dto;

import java.util.UUID;
import lombok.Data;

@Data
public class ParticipationDto {

  private UUID id;

  private CourseDto course;

}
