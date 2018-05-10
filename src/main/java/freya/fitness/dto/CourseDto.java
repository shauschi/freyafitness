package freya.fitness.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import freya.fitness.domain.jpa.Course;
import freya.fitness.domain.jpa.CourseType;
import freya.fitness.domain.jpa.User;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.function.Predicate;
import java.util.stream.Collectors;

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

  public CourseDto(final User user, final Course course) {
    final UUID id = user.getId();
    this.id = course.getId();
    final CourseType type = course.getType();
    this.courseTypeId = type != null ? type.getId() : null;
    this.start = course.getStart();
    this.minutes = course.getMinutes();
    final User instructor = course.getInstructor();
    this.instructor = new ProfileDto(instructor);
    this.signedIn = course.getAttendees().stream()
        .map(User::getId)
        .anyMatch(Predicate.isEqual(id));
    this.maxParticipants = course.getMaxParticipants();
    this.canceled = course.isCanceled();
    this.attendees = course.getAttendees().stream().map(ProfileDto::new).collect(Collectors.toList());
  }
}
