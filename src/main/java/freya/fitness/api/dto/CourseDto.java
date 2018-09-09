package freya.fitness.api.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class CourseDto {

  private UUID id;
  @NotNull
  @NotEmpty
  private UUID courseTypeId;
  @NotNull
  @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
  private LocalDateTime start;
  @NotNull
  private Integer minutes;
  private ProfileDto instructor;
  private boolean signedIn;
  @NotNull
  private Integer maxParticipants;
  private boolean canceled;
  private List<ProfileDto> attendees;

}
