package freya.fitness.domain.jpa;

import java.util.UUID;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.GenericGenerator;

@Data
@Entity
@EqualsAndHashCode(exclude = "user")
@Table(
    name = "user_preference",
    schema = "public",
    uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "key"})
)
public class UserPreference {

  @Id
  @GeneratedValue(generator = "UUID")
  @GenericGenerator(
      name = "UUID",
      strategy = "org.hibernate.id.UUIDGenerator"
  )
  protected UUID id;


  @ManyToOne
  @JoinColumn(name = "user_id")
  private User user;

  private String key;

  private String value;

}
