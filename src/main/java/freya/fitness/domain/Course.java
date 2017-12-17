package freya.fitness.domain;

import java.time.LocalDateTime;
import java.util.List;

public class Course {

  private Long id;
  private CourseType type;
  private LocalDateTime start;
  private Long minutes;
  private String instructor;
  private List<String> attendees;

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public CourseType getType() {
    return type;
  }

  public void setType(CourseType type) {
    this.type = type;
  }

  public LocalDateTime getStart() {
    return start;
  }

  public void setStart(LocalDateTime start) {
    this.start = start;
  }

  public Long getMinutes() {
    return minutes;
  }

  public void setMinutes(Long minutes) {
    this.minutes = minutes;
  }

  public String getInstructor() {
    return instructor;
  }

  public void setInstructor(String instructor) {
    this.instructor = instructor;
  }

  public List<String> getAttendees() {
    return attendees;
  }

  public void setAttendees(List<String> attendees) {
    this.attendees = attendees;
  }
}
