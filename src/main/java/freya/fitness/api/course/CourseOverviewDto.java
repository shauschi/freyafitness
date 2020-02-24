package freya.fitness.api.course;

import com.fasterxml.jackson.annotation.JsonFormat;
import freya.fitness.api.membership.ParticipationStatus;
import java.time.LocalDateTime;
import java.util.UUID;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class CourseOverviewDto {

  private UUID id;
  @NotNull
  @NotEmpty
  private CourseTypeDto courseType;
  @NotNull
  @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
  private LocalDateTime start;
  @NotNull
  private ParticipationStatus participationStatus;

}
