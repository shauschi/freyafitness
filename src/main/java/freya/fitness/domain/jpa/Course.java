package freya.fitness.domain.jpa;

import lombok.Data;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Entity
@Table(name = "course", schema="public")
public class Course {

  @Id
  @GeneratedValue(generator = "UUID")
  @GenericGenerator(
      name = "UUID",
      strategy = "org.hibernate.id.UUIDGenerator"
  )
  private UUID id;

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
