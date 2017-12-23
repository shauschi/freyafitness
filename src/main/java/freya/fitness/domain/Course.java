package freya.fitness.domain;

import lombok.Data;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
public class Course {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Enumerated(EnumType.STRING)
  private CourseType type;

  private LocalDateTime start;

  private Long minutes;

  private String instructor;

  @Transient
  private List<String> attendees;
}
