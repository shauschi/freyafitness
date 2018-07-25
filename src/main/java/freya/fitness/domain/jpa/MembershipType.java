package freya.fitness.domain.jpa;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;
import javax.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@Entity
@EqualsAndHashCode(callSuper = false)
@Table(
    name = "membership_type",
    schema = "public",
    uniqueConstraints = @UniqueConstraint(columnNames = {"key"})
)
public class MembershipType extends BusinessObject {

  @NotNull
  private String key;

  @NotNull
  private String name;

  private String description;

  private int maxParticipations;

  @NotNull
  private int validityDays;

}
