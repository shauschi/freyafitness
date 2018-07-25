package freya.fitness.api.dto;

import java.util.UUID;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import lombok.Data;

@Data
public class MembershipDto {

  @NotNull
  @NotEmpty
  private UUID membershipTypeId;

  @NotNull
  @NotEmpty
  private ValidityDto validity;

  private long participations;

}
