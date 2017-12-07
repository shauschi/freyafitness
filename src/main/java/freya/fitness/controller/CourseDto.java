package freya.fitness.controller;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import freya.fitness.domain.Course;
import freya.fitness.domain.CourseType;

import java.time.LocalDateTime;

public class CourseDto {

  private Long id;
  private CourseType type;
  private LocalDateTime start;
  private Long minutes;
  private String instructor;

  public CourseDto(Course course) {
    this.id = course.getId();
    this.type = course.getType();
    this.start = course.getStart();
    this.minutes = course.getMinutes();
    this.instructor = course.getInstructor();
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
}
