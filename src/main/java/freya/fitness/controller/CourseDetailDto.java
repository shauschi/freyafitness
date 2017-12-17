package freya.fitness.controller;

import com.fasterxml.jackson.annotation.JsonFormat;
import freya.fitness.domain.Course;
import freya.fitness.domain.CourseType;

import java.time.LocalDateTime;
import java.util.List;

public class CourseDetailDto {

  private Long id;
  private CourseType type;
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

  @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
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
