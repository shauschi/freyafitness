package freya.fitness.domain;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class Course {

  private Long id;
  private CourseType type;
  private LocalDateTime start;
  private Long minutes;
  private String instructor;
  private List<String> attendees;

}
