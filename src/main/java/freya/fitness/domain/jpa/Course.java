package freya.fitness.domain.jpa;

import lombok.Data;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@Table(name = "course", schema="public")
public class Course {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne
  @JoinColumn(name = "course_type_id")
  private CourseType type;

  private LocalDateTime start;

  private Integer minutes;

  @ManyToOne
  @JoinColumn(name = "instructor_id")
  private User instructor;

  private Integer maxParticipants;

  private boolean canceled;

  @ManyToMany
  @JoinTable(
      name="course_user",
      joinColumns=@JoinColumn(name="course_id", referencedColumnName="id"),
      inverseJoinColumns=@JoinColumn(name="user_id", referencedColumnName="id"))
  private List<User> attendees;

}
