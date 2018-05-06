package freya.fitness.domain.jpa;

import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.security.core.GrantedAuthority;

import javax.persistence.Entity;
import javax.persistence.Table;
import javax.validation.constraints.NotEmpty;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "user", schema="public")
public class Role extends BusinessObject implements GrantedAuthority {

  @NotEmpty
  private String authority;

  private String description;

}
