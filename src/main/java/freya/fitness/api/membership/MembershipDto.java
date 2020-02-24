package freya.fitness.api.membership;

import freya.fitness.api.common.ProfileDto;
import freya.fitness.api.common.ValidityDto;
import java.util.UUID;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import lombok.Data;

@Data
public class MembershipDto {

  private UUID id;

  @NotNull
  @NotEmpty
  private UUID membershipTypeId;

  @NotNull
  @NotEmpty
  private ValidityDto validity;

  private ProfileDto user;

  private long participationCount;

}
