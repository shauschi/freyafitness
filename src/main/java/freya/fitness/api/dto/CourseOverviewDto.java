package freya.fitness.api.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import freya.fitness.domain.jpa.Course;
import freya.fitness.domain.jpa.CourseType;
import freya.fitness.domain.jpa.User;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;
import java.util.function.Predicate;

@Data
@NoArgsConstructor
public class CourseOverviewDto {

  private UUID id;
  private UUID courseTypeId;
  @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
  private LocalDateTime start;
  private Integer minutes;
  private ProfileDto instructor;
  private boolean signedIn;
  private Integer maxParticipants;
  private boolean canceled;
  private Integer attendees;

  public CourseOverviewDto(final User user, final Course course) {
    this(course);
    if (user != null) {
      final UUID userId = user.getId();
      this.signedIn = course.getAttendees().stream()
          .map(User::getId)
          .anyMatch(Predicate.isEqual(userId));
    }
  }

  public CourseOverviewDto(final Course course) {
    this.id = course.getId();
    final CourseType type = course.getType();
    this.courseTypeId = type != null ? type.getId() : null;
    this.start = course.getStart();
    this.minutes = course.getMinutes();
    final User instructor = course.getInstructor();
    this.instructor = new ProfileDto(instructor);
    this.maxParticipants = course.getMaxParticipants();
    this.canceled = course.isCanceled();
    this.attendees = course.getAttendees().size();
  }
}
