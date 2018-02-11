package freya.fitness.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import freya.fitness.domain.jpa.Course;
import freya.fitness.domain.jpa.CourseType;
import freya.fitness.domain.jpa.User;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
public class CourseDto {

  private Long id;
  private CourseType type;
  @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
  private LocalDateTime start;
  private Integer minutes;
  private ProfileDto instructor;
  private boolean signedIn;
  private Integer maxParticipants;
  private boolean canceled;
  private List<ProfileDto> attendees;

  public CourseDto(User user, Course course) {
    Long userId = user.getId();
    this.id = course.getId();
    this.type = course.getType();
    this.start = course.getStart();
    this.minutes = course.getMinutes();
    User instructor = course.getInstructor();
    this.instructor = new ProfileDto(instructor);
    this.signedIn = course.getAttendees().stream().anyMatch(attendee -> Objects.equals(attendee.getId(), userId));
    this.maxParticipants = course.getMaxParticipants();
    this.canceled = course.isCanceled();
    this.attendees = course.getAttendees().stream().map(ProfileDto::new).collect(Collectors.toList());
  }
}
