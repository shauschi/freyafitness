package freya.fitness.api.membership;

import freya.fitness.api.course.CourseOverviewDto;
import java.util.UUID;
import lombok.Data;

@Data
public class ParticipationDto {

  private UUID id;

  private CourseOverviewDto course;

}
