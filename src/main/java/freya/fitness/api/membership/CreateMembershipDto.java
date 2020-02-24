package freya.fitness.api.membership;

import freya.fitness.api.common.ProfileDto;
import freya.fitness.api.common.ValidityDto;
import java.util.UUID;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateMembershipDto {

  @NotNull
  @NotEmpty
  private ProfileDto user;

  @NotNull
  @NotEmpty
  private UUID membershipTypeId;

  private ValidityDto validity;

}
