package freya.fitness.api.membership;

import freya.fitness.api.common.BusinessObject;
import freya.fitness.api.user.User;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@Entity
@EqualsAndHashCode(callSuper = false)
@Table(name = "membership", schema = "public")
public class Membership extends BusinessObject {

  @ManyToOne
  @JoinColumn(name = "user_id")
  private User user;

  @ManyToOne
  @JoinColumn(name = "membership_type_id")
  private MembershipType type;

}
