package freya.fitness.controller;

import com.fasterxml.jackson.annotation.JsonFormat;
import freya.fitness.domain.Course;
import freya.fitness.domain.CourseType;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class CourseDetailDto {

  private Long id;
  private CourseType type;
  @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
  private LocalDateTime start;
  private Long minutes;
  private String instructor;
  private List<String> attendees;

  public CourseDetailDto(Course course) {
    this.id = course.getId();
    this.type = course.getType();
    this.start = course.getStart();
    this.minutes = course.getMinutes();
    this.instructor = course.getInstructor();
    this.attendees = course.getAttendees();
  }
}
