package freya.fitness.api.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import freya.fitness.domain.jpa.Course;
import freya.fitness.domain.jpa.CourseType;
import freya.fitness.domain.jpa.Membership;
import freya.fitness.domain.jpa.Participation;
import freya.fitness.domain.jpa.User;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.function.Predicate;
import java.util.stream.Collectors;
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

  public CourseDto(final User user, final Course course) {
    this(course);
    if (user != null) {
      final UUID userId = user.getId();
      this.signedIn = course.getParticipantions().stream()
          .map(Participation::getMembership)
          .map(Membership::getUser)
          .map(User::getId)
          .anyMatch(Predicate.isEqual(userId));
    }
  }

  public CourseDto(final Course course) {
    this.id = course.getId();
    final CourseType type = course.getType();
    this.courseTypeId = type != null ? type.getId() : null;
    this.start = course.getStart();
    this.minutes = course.getMinutes();
    final User instructor = course.getInstructor();
    this.instructor = new ProfileDto(instructor);
    this.maxParticipants = course.getMaxParticipants();
    this.canceled = course.isCanceled();
    this.attendees = course.getParticipantions().stream()
        .map(Participation::getMembership)
        .map(Membership::getUser)
        .map(ProfileDto::new)
        .collect(Collectors.toList());
  }
}
