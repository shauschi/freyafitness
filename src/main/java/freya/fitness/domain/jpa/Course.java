package freya.fitness.domain.jpa;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Set;
import java.util.UUID;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import lombok.AccessLevel;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Setter;
import org.hibernate.annotations.GenericGenerator;

@Data
@EqualsAndHashCode(exclude = "participantions")
@Entity
@Table(name = "course", schema = "public")
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

  private int maxParticipants;

  private boolean canceled;

  @Setter(AccessLevel.NONE)
  @OneToMany(fetch = FetchType.EAGER, mappedBy = "course")
  private Set<Participation> participantions = Collections.emptySet();

}
