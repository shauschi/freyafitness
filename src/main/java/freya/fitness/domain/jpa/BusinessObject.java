package freya.fitness.domain.jpa;

import lombok.Data;

import javax.persistence.*;

@Data
@MappedSuperclass
public abstract class BusinessObject {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  public Long id;

  @Embedded
  @AttributeOverrides({
      @AttributeOverride(name = "from", column = @Column(name = "validity_from")),
      @AttributeOverride(name = "to", column = @Column(name = "validity_to"))
  })
  public Validity validity;

}

