package freya.fitness.domain.jpa;

import lombok.Data;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@MappedSuperclass
public abstract class BusinessObject {

  @Id
  @GeneratedValue(generator = "UUID")
  @GenericGenerator(
      name = "UUID",
      strategy = "org.hibernate.id.UUIDGenerator"
  )
  protected UUID id;

  @Embedded
  @AttributeOverrides({
      @AttributeOverride(name = "from", column = @Column(name = "validity_from")),
      @AttributeOverride(name = "to", column = @Column(name = "validity_to"))
  })
  protected Validity validity;

  public boolean isValid() {
    return validity.isValid(LocalDateTime.now());
  }

  public boolean isValid(final LocalDateTime dateTime) {
    return validity.isValid(dateTime);
  }

}

