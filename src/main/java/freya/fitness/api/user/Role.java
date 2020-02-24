package freya.fitness.api.user;

import freya.fitness.api.common.BusinessObject;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.validation.constraints.NotEmpty;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.security.core.GrantedAuthority;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "role", schema = "public")
public class Role extends BusinessObject implements GrantedAuthority {

  @NotEmpty
  private String authority;

  private String description;

}
