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
import lombok.ToString;
import org.hibernate.annotations.GenericGenerator;

@Data
@Entity
@EqualsAndHashCode(exclude = "user")
@ToString(exclude = "user")
@Table(
    name = "user_preference",
    schema = "public",
    uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "key"})
)
public class UserPreference {

  public static final String VIEW_PARTICIPATION = "VIEW_PARTICIPATION";
  public static final String VIEW_PROFILE_PICTURE = "VIEW_PROFILE_PICTURE";
  public static final String VIEW_STATISTICS = "VIEW_STATISTICS";

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
