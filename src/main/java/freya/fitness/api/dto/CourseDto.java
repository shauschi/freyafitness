package freya.fitness.api.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class CourseDto {

  private UUID id;
  private UUID courseTypeId;
  @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
  private LocalDateTime start;
  private Integer minutes;
  private ProfileDto instructor;
  private boolean signedIn;
  private Integer maxParticipants;
  private boolean canceled;
  private List<ProfileDto> attendees;

}
